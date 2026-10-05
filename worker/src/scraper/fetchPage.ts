// -----------------------------------------------------------------------------
// fetchPage — скачивание HTML-страницы по URL с защитой и таймаутами.
// -----------------------------------------------------------------------------
//
// ЧТО ДЕЛАЕТ:
// 1. Проверяет URL через SSRF-фильтр.
// 2. Скачивает страницу с User-Agent реального браузера.
// 3. Вручную обрабатывает редиректы (до 5 штук), каждый раз проверяя
//    новый URL через SSRF-фильтр.
// 4. Ограничивает максимальный размер ответа (2 МБ).
// 5. Возвращает HTML, статус, заголовки, время ответа.
//
// ВОЗВРАЩАЕТ:
// Объект FetchResult с полями:
//   - ok: boolean              — успешно ли скачали
//   - html: string             — HTML-код (пустой, если ошибка)
//   - finalUrl: string         — URL после редиректов
//   - statusCode: number       — HTTP-код
//   - statusMessage: string    — текст статуса
//   - headers: Headers         — заголовки ответа
//   - responseTimeMs: number   — время до первого байта (TTFB)
//   - error?: string           — текст ошибки, если ok=false
//   - blockedByBotProtection?: boolean — Cloudflare/WAF/anti-bot
// -----------------------------------------------------------------------------

import { validateUrlForFetch } from '../security/ssrf';

// -----------------------------------------------------------------------------
// Настройки.
// -----------------------------------------------------------------------------
const MAX_REDIRECTS = 5;
const FETCH_TIMEOUT_MS = 12000;
const MAX_HTML_BYTES = 2 * 1024 * 1024; // 2 МБ

// Заголовки, которые эмулируют реальный браузер. Помогают проходить
// простые антибот-проверки и получать полноценный HTML.
const BROWSER_HEADERS: Record<string, string> = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
    '(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  Accept:
    'text/html,application/xhtml+xml,application/xml;q=0.9,' +
    'image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'none',
  'Sec-Fetch-User': '?1',
  'Upgrade-Insecure-Requests': '1',
};

// -----------------------------------------------------------------------------
// Результат скачивания.
// -----------------------------------------------------------------------------
export interface FetchResult {
  ok: boolean;
  html: string;
  finalUrl: string;
  statusCode: number;
  statusMessage: string;
  headers: Headers;
  responseTimeMs: number;
  error?: string;
  blockedByBotProtection?: boolean;
}

// -----------------------------------------------------------------------------
// Скачивание с ручной обработкой редиректов.
// -----------------------------------------------------------------------------
export async function fetchPage(rawUrl: string): Promise<FetchResult> {
  // 1. Нормализуем URL: если нет протокола, добавляем https://
  let normalizedUrl = rawUrl.trim();
  if (!/^https?:\/\//i.test(normalizedUrl)) {
    normalizedUrl = 'https://' + normalizedUrl;
  }

  // 2. Проверяем URL через SSRF-фильтр
  const validation = await validateUrlForFetch(normalizedUrl);
  if (!validation.ok || !validation.normalizedUrl) {
    return {
      ok: false,
      html: '',
      finalUrl: normalizedUrl,
      statusCode: 0,
      statusMessage: 'Blocked',
      headers: new Headers(),
      responseTimeMs: 0,
      error: validation.reason || 'URL не прошёл проверку безопасности',
    };
  }

  let currentUrl = validation.normalizedUrl;
  let redirectCount = 0;
  const startTime = Date.now();

  // 3. Цикл обработки редиректов
  while (redirectCount <= MAX_REDIRECTS) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    let response: Response;
    try {
      response = await fetch(currentUrl, {
        method: 'GET',
        headers: BROWSER_HEADERS,
        redirect: 'manual', // ← важно: не следуем редиректам автоматически
        signal: controller.signal,
      });
    } catch (err: any) {
      clearTimeout(timeoutId);
      const isAbort = err?.name === 'AbortError';
      return {
        ok: false,
        html: '',
        finalUrl: currentUrl,
        statusCode: 0,
        statusMessage: 'Network Error',
        headers: new Headers(),
        responseTimeMs: Date.now() - startTime,
        error: isAbort
          ? 'Сайт не ответил за 12 секунд'
          : `Не удалось загрузить страницу: ${err?.message || 'неизвестная ошибка'}`,
      };
    } finally {
      clearTimeout(timeoutId);
    }

    // -------------------------------------------------------------------
    // Обрабатываем редиректы (301, 302, 303, 307, 308).
    // -------------------------------------------------------------------
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('Location');
      if (!location) {
        return {
          ok: false,
          html: '',
          finalUrl: currentUrl,
          statusCode: response.status,
          statusMessage: response.statusText,
          headers: response.headers,
          responseTimeMs: Date.now() - startTime,
          error: 'Редирект без заголовка Location',
        };
      }

      // Разрешаем относительные Location (`/path`) и абсолютные
      let nextUrl: string;
      try {
        nextUrl = new URL(location, currentUrl).toString();
      } catch {
        return {
          ok: false,
          html: '',
          finalUrl: currentUrl,
          statusCode: response.status,
          statusMessage: response.statusText,
          headers: response.headers,
          responseTimeMs: Date.now() - startTime,
          error: 'Некорректный URL в заголовке Location',
        };
      }

      // ← Главная защита: проверяем URL редиректа через SSRF
      const redirectValidation = await validateUrlForFetch(nextUrl);
      if (!redirectValidation.ok || !redirectValidation.normalizedUrl) {
        return {
          ok: false,
          html: '',
          finalUrl: nextUrl,
          statusCode: 0,
          statusMessage: 'Redirect Blocked',
          headers: new Headers(),
          responseTimeMs: Date.now() - startTime,
          error: `Редирект заблокирован: ${redirectValidation.reason}`,
        };
      }

      currentUrl = redirectValidation.normalizedUrl;
      redirectCount++;
      continue;
    }

    // -------------------------------------------------------------------
    // Не редирект. Проверяем статус.
    // -------------------------------------------------------------------
    const responseTimeMs = Date.now() - startTime;

    if (response.status >= 400) {
      // Читаем тело (может понадобиться для определения anti-bot)
      const body = await safeReadText(response, MAX_HTML_BYTES);

      const isBotBlocked = detectBotProtection(response.status, body);

      return {
        ok: false,
        html: body,
        finalUrl: currentUrl,
        statusCode: response.status,
        statusMessage: response.statusText,
        headers: response.headers,
        responseTimeMs,
        error: isBotBlocked
          ? `Сайт вернул HTTP ${response.status} (защита от ботов)`
          : `Сайт вернул HTTP ${response.status}`,
        blockedByBotProtection: isBotBlocked,
      };
    }

    // -------------------------------------------------------------------
    // Успех. Читаем тело.
    // -------------------------------------------------------------------
    const html = await safeReadText(response, MAX_HTML_BYTES);

    return {
      ok: true,
      html,
      finalUrl: currentUrl,
      statusCode: response.status,
      statusMessage: response.statusText || 'OK',
      headers: response.headers,
      responseTimeMs,
    };
  }

  // Превысили лимит редиректов
  return {
    ok: false,
    html: '',
    finalUrl: currentUrl,
    statusCode: 0,
    statusMessage: 'Too Many Redirects',
    headers: new Headers(),
    responseTimeMs: Date.now() - startTime,
    error: `Превышено максимальное число редиректов (${MAX_REDIRECTS})`,
  };
}

// -----------------------------------------------------------------------------
// Безопасное чтение тела ответа с лимитом по размеру.
// -----------------------------------------------------------------------------
async function safeReadText(response: Response, maxBytes: number): Promise<string> {
  try {
    const reader = response.body?.getReader();
    if (!reader) return '';

    const chunks: Uint8Array[] = [];
    let totalSize = 0;
    const decoder = new TextDecoder('utf-8');

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      totalSize += value.length;
      if (totalSize > maxBytes) {
        // Превысили лимит — прекращаем читать, но возвращаем то, что есть
        chunks.push(value);
        break;
      }
      chunks.push(value);
    }

    // Склеиваем все чанки в один Uint8Array
    const combined = new Uint8Array(chunks.reduce((sum, c) => sum + c.length, 0));
    let offset = 0;
    for (const chunk of chunks) {
      combined.set(chunk, offset);
      offset += chunk.length;
    }

    return decoder.decode(combined);
  } catch {
    return '';
  }
}

// -----------------------------------------------------------------------------
// Эвристика: заблокировал ли сайт нас как бота?
// -----------------------------------------------------------------------------
function detectBotProtection(status: number, html: string): boolean {
  // 403 и 429 — очевидные сигналы блокировки
  if (status === 403 || status === 429) return true;

  // Проверяем известные страницы-заглушки антибот-систем
  const signatures = [
    'Cloudflare Ray ID',
    'Attention Required! | Cloudflare',
    'Checking your browser before accessing',
    'cf-browser-verification',
    'Just a moment...',
    'DDoS protection by Cloudflare',
    'bot-traffic@wikimedia.org',
    'Pardon Our Interruption',
    'Access Denied',
  ];

  const lowerHtml = html.toLowerCase();
  for (const sig of signatures) {
    if (html.includes(sig) || lowerHtml.includes(sig.toLowerCase())) {
      return true;
    }
  }

  return false;
}