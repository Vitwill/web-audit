// -----------------------------------------------------------------------------
// SSRF-защита: предотвращение запросов во внутреннюю сеть и служебные адреса.
// -----------------------------------------------------------------------------
//
// ЗАЧЕМ:
// Наш Worker принимает URL от пользователя и делает по нему fetch.
// Без защиты злоумышленник может заставить нас обратиться к:
//   - http://localhost:*/      — внутренние сервисы Cloudflare
//   - http://127.0.0.1/        — localhost
//   - http://169.254.169.254/  — метаданные облачных провайдеров
//   - http://10.0.0.0/8        — приватные сети
//   - http://192.168.0.0/16    — домашние сети
//   - http://[::1]/            — IPv6-localhost
//   - http://my-scrapers-app.workers.dev — рекурсия на себя
//
// КАК РЕАЛИЗОВАНО:
// 1. Проверяем сам URL (протокол, порт, credentials, hostname).
// 2. Резолвим hostname в IP через DNS-over-HTTPS (1.1.1.1).
// 3. Проверяем каждый полученный IP на попадание в запрещённые диапазоны.
// 4. Если всё чисто — отдаём нормализованный URL.
//
// ВАЖНО:
// Даже с этой защитой нужно помнить о редиректах. `fetch` может сходить
// на приватный IP после 301/302. Поэтому в `fetchPage()` мы используем
// `redirect: 'manual'` и проверяем каждый Location отдельно.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Запрещённые диапазоны IPv4 (regex).
// -----------------------------------------------------------------------------
// Источник: RFC 1918 (private), RFC 6598 (shared), RFC 5735 (loopback,
// link-local, multicast, reserved).
// -----------------------------------------------------------------------------
const BLOCKED_IPV4_PATTERNS: RegExp[] = [
  /^0\./, // "this network"
  /^10\./, // private
  /^100\.(6[4-9]|[7-9]\d|1[0-1]\d|12[0-7])\./, // CGNAT 100.64.0.0/10
  /^127\./, // loopback
  /^169\.254\./, // link-local (в т.ч. 169.254.169.254 — cloud metadata)
  /^172\.(1[6-9]|2\d|3[01])\./, // private 172.16.0.0/12
  /^192\.0\.0\./, // IETF protocol assignments
  /^192\.0\.2\./, // TEST-NET-1
  /^192\.168\./, // private
  /^198\.1[89]\./, // benchmarking
  /^198\.51\.100\./, // TEST-NET-2
  /^203\.0\.113\./, // TEST-NET-3
  /^22[4-9]\./, // multicast
  /^23\d\./, // multicast
  /^24\d\./, // reserved
  /^255\./, // broadcast
];

// -----------------------------------------------------------------------------
// Служебные hostname'ы, которые нельзя резолвить в принципе.
// -----------------------------------------------------------------------------
const BLOCKED_HOSTNAMES: Set<string> = new Set([
  'localhost',
  'localhost.localdomain',
  'metadata.google.internal',
  'metadata.goog',
  'instance-data',
  'kubernetes.default.svc',
]);

// -----------------------------------------------------------------------------
// Таймаут DNS-запроса (мс).
// -----------------------------------------------------------------------------
const DNS_TIMEOUT_MS = 3000;

// -----------------------------------------------------------------------------
// Результат проверки URL.
// -----------------------------------------------------------------------------
export interface UrlValidationResult {
  ok: boolean;
  reason?: string;
  normalizedUrl?: string;
}

// -----------------------------------------------------------------------------
// Проверка: IP запрещён?
// -----------------------------------------------------------------------------
function isBlockedIp(ip: string): boolean {
  // IPv4: проверяем по паттернам
  if (ip.includes('.') && !ip.includes(':')) {
    for (const pattern of BLOCKED_IPV4_PATTERNS) {
      if (pattern.test(ip)) return true;
    }
    return false;
  }

  // IPv6: проверяем вручную
  if (ip.includes(':')) {
    const lower = ip.toLowerCase();

    // ::1 — loopback, :: — unspecified
    if (lower === '::1' || lower === '::') return true;

    // fc00::/7 — Unique Local Addresses
    if (lower.startsWith('fc') || lower.startsWith('fd')) return true;

    // fe80::/10 — Link-Local
    if (
      lower.startsWith('fe8') ||
      lower.startsWith('fe9') ||
      lower.startsWith('fea') ||
      lower.startsWith('feb')
    ) {
      return true;
    }

    // IPv4-mapped IPv6 (::ffff:1.2.3.4) — рекурсивно проверяем вложенный IPv4
    const v4Mapped = lower.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
    if (v4Mapped) return isBlockedIp(v4Mapped[1]);

    return false;
  }

  // Не смогли определить формат — блокируем на всякий случай
  return true;
}

// -----------------------------------------------------------------------------
// Резолв hostname → массив IP через DNS-over-HTTPS (Cloudflare 1.1.1.1).
// -----------------------------------------------------------------------------
async function resolveHostname(hostname: string): Promise<string[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DNS_TIMEOUT_MS);

  try {
    const url = `https://1.1.1.1/dns-query?name=${encodeURIComponent(hostname)}&type=A`;
    const response = await fetch(url, {
      headers: { Accept: 'application/dns-json' },
      signal: controller.signal,
    });

    if (!response.ok) {
      // Если A-записи нет — попробуем AAAA (IPv6)
      const url6 = `https://1.1.1.1/dns-query?name=${encodeURIComponent(hostname)}&type=AAAA`;
      const response6 = await fetch(url6, {
        headers: { Accept: 'application/dns-json' },
        signal: controller.signal,
      });

      if (!response6.ok) return [];

      const data6 = (await response6.json()) as any;
      return (data6?.Answer || [])
        .filter((a: any) => a.type === 28) // 28 = AAAA
        .map((a: any) => a.data);
    }

    const data = (await response.json()) as any;

    const aRecords = (data?.Answer || [])
      .filter((a: any) => a.type === 1) // 1 = A
      .map((a: any) => a.data);

    // Если A-записей нет, проверим AAAA
    if (aRecords.length === 0) {
      const url6 = `https://1.1.1.1/dns-query?name=${encodeURIComponent(hostname)}&type=AAAA`;
      const response6 = await fetch(url6, {
        headers: { Accept: 'application/dns-json' },
        signal: controller.signal,
      });

      if (!response6.ok) return [];

      const data6 = (await response6.json()) as any;
      return (data6?.Answer || [])
        .filter((a: any) => a.type === 28)
        .map((a: any) => a.data);
    }

    return aRecords;
  } catch {
    return [];
  } finally {
    clearTimeout(timeoutId);
  }
}

// -----------------------------------------------------------------------------
// Главная функция: проверка URL перед fetch.
// -----------------------------------------------------------------------------
export async function validateUrlForFetch(
  rawUrl: string
): Promise<UrlValidationResult> {
  // 1. Парсим URL
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    return { ok: false, reason: 'Некорректный URL' };
  }

  // 2. Только http/https
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return { ok: false, reason: 'Разрешены только http и https' };
  }

  // 3. Запрещаем логин/пароль в URL (http://user:pass@host)
  if (url.username || url.password) {
    return { ok: false, reason: 'URL с логином/паролем запрещён' };
  }

  // 4. Порт — только 80, 443 или пусто (по умолчанию)
  const port = url.port
    ? Number(url.port)
    : url.protocol === 'https:'
    ? 443
    : 80;
  if (port !== 80 && port !== 443) {
    return { ok: false, reason: 'Разрешены только порты 80 и 443' };
  }

  // 5. Проверяем hostname
  const hostname = url.hostname.toLowerCase();

  if (BLOCKED_HOSTNAMES.has(hostname)) {
    return { ok: false, reason: 'Доступ к этому хосту запрещён' };
  }

  // 6. Если hostname — уже IP, проверяем напрямую (без DNS)
  const isDirectIp = /^\d+\.\d+\.\d+\.\d+$/.test(hostname) || hostname.includes(':');
  if (isDirectIp) {
    const cleanIp = hostname.replace(/^\[|\]$/g, ''); // убираем [] у IPv6
    if (isBlockedIp(cleanIp)) {
      return { ok: false, reason: 'Доступ к приватным и служебным IP запрещён' };
    }
    return { ok: true, normalizedUrl: url.toString() };
  }

  // 7. Резолвим DNS и проверяем все полученные IP
  const addresses = await resolveHostname(hostname);

  if (addresses.length === 0) {
    return { ok: false, reason: 'Не удалось разрешить DNS-имя хоста' };
  }

  for (const addr of addresses) {
    if (isBlockedIp(addr)) {
      return {
        ok: false,
        reason: 'Хост указывает на приватный или служебный IP',
      };
    }
  }

  // 8. Всё чисто — возвращаем нормализованный URL
  return { ok: true, normalizedUrl: url.toString() };
}