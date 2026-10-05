// -----------------------------------------------------------------------------
// routes/scrape — обработчик POST /api/scrape.
// -----------------------------------------------------------------------------
//
// ЧТО ДЕЛАЕТ:
//   1. Принимает URL в теле запроса.
//   2. Проверяет URL через SSRF-фильтр.
//   3. Проверяет rate limit по IP.
//   4. Скачивает страницу (fetchPage).
//   5. Парсит HTML (parseHtmlData).
//   6. Возвращает ScrapedData в JSON.
//
// КОГДА ИСПОЛЬЗУЕТСЯ:
//   - Фронт для отладки: увидеть, что именно распарсилось, без вызова Gemini.
//   - Внутренне из /api/audit при необходимости.
// -----------------------------------------------------------------------------

import { Env, ScrapeRequest, ScrapedData } from '../types';
import { fetchPage } from '../scraper/fetchPage';
import { parseHtmlData } from '../scraper/parseHtmlData';
import { checkRateLimit, rateLimitResponse } from '../security/rateLimit';

// -----------------------------------------------------------------------------
// Вспомогательная функция: JSON-ответ.
// -----------------------------------------------------------------------------
function jsonResponse(data: unknown, status: number = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

// -----------------------------------------------------------------------------
// Обработчик.
// -----------------------------------------------------------------------------
export async function handleScrape(
  request: Request,
  env: Env
): Promise<Response> {
  // 1. Метод
  if (request.method !== 'POST') {
    return jsonResponse(
      { error: 'Method Not Allowed. Use POST with JSON body { "url": "..." }.' },
      405
    );
  }

  // 2. Rate limit
  const rl = await checkRateLimit(request, env);
  if (!rl.allowed) {
    return rateLimitResponse(rl);
  }

  // 3. Парсим тело
  let body: ScrapeRequest;
  try {
    body = (await request.json()) as ScrapeRequest;
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  const url = body?.url?.trim();
  if (!url) {
    return jsonResponse({ error: 'URL обязателен для проверки' }, 400);
  }

  // 4. Скачиваем страницу (SSRF-проверка внутри fetchPage)
  const fetchResult = await fetchPage(url);

  if (!fetchResult.ok) {
    // Бот-защита: отдельный ответ, чтобы фронт мог показать понятное сообщение
    if (fetchResult.blockedByBotProtection) {
      return jsonResponse(
        {
          error: fetchResult.error,
          statusCode: fetchResult.statusCode,
          blockedByBotProtection: true,
          message:
            'Для анализа защищённого сайта перейдите во вкладку «Исходный HTML», нажмите на странице в браузере Ctrl+U (Просмотр кода), скопируйте HTML и вставьте сюда.',
          url: fetchResult.finalUrl,
        },
        403
      );
    }

    // Прочие сетевые ошибки (404, таймаут, SSRF-блок)
    return jsonResponse(
      {
        error: fetchResult.error || 'Не удалось загрузить сайт',
        statusCode: fetchResult.statusCode,
        url: fetchResult.finalUrl,
      },
      422
    );
  }

  // 5. Парсим HTML
  const data: ScrapedData = parseHtmlData(
    fetchResult.html,
    fetchResult.finalUrl,
    fetchResult.headers,
    fetchResult.responseTimeMs
  );

  // 6. Добавляем HTTP-статус в результат
  data.statusCode = fetchResult.statusCode;
  data.statusMessage = fetchResult.statusMessage;

  return jsonResponse(data, 200);
}