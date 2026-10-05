// -----------------------------------------------------------------------------
// rateLimit — ограничение частоты запросов по IP через KV.
// -----------------------------------------------------------------------------
//
// ЗАЧЕМ:
//   - Защита от DDoS и спама.
//   - Защита лимитов Gemini (каждый вызов стоит денег или квоты).
//   - Справедливость: один пользователь не должен блокировать API для всех.
//
// КАК РАБОТАЕТ:
//   1. Извлекаем IP из запроса (CF-Connecting-IP).
//   2. Читаем из KV запись rl:<IP>: { count, resetAt }.
//   3. Если записи нет или resetAt в прошлом — создаём новую с count = 1.
//   4. Если count >= лимит — возвращаем отказ.
//   5. Иначе увеличиваем count, сохраняем, разрешаем запрос.
//
// НАСТРОЙКИ:
//   - RATE_LIMIT_WINDOW_SEC = 60 секунд
//   - RATE_LIMIT_MAX        = 10 запросов в окне
//
// ВАЖНО:
//   - KV не атомарный. При экстремальной нагрузке возможны "потери"
//     нескольких запросов (race condition). Для нашего сервиса это приемлемо.
//     Если понадобится строгий учёт — используйте Durable Objects.
//   - IP берём из заголовка CF-Connecting-IP. Cloudflare всегда его
//     проставляет, пользователь не может подделать.
// -----------------------------------------------------------------------------

import { Env, RateLimitEntry } from '../types';

// -----------------------------------------------------------------------------
// Настройки.
// -----------------------------------------------------------------------------
const RATE_LIMIT_WINDOW_SEC = 60;
const RATE_LIMIT_MAX = 10;
const KV_TTL_SEC = 70; // чуть больше окна, чтобы KV автоочищался

// -----------------------------------------------------------------------------
// Извлечение IP-адреса клиента.
// -----------------------------------------------------------------------------
function getClientIp(request: Request): string {
  // Cloudflare всегда проставляет CF-Connecting-IP для входящих запросов
  const cfIp = request.headers.get('CF-Connecting-IP');
  if (cfIp) return cfIp;

  // Резервные варианты (на случай локальной разработки)
  const xff = request.headers.get('X-Forwarded-For');
  if (xff) return xff.split(',')[0].trim();

  const xRealIp = request.headers.get('X-Real-IP');
  if (xRealIp) return xRealIp;

  return 'unknown';
}

// -----------------------------------------------------------------------------
// Проверка лимита.
// -----------------------------------------------------------------------------
export interface RateLimitResult {
  /** Запрос разрешён? */
  allowed: boolean;
  /** Сколько запросов уже сделано в окне */
  current: number;
  /** Максимум запросов в окне */
  limit: number;
  /** Unix-время (мс), когда окно сбросится */
  resetAt: number;
  /** Сколько секунд осталось до сброса */
  retryAfterSec: number;
}

export async function checkRateLimit(
  request: Request,
  env: Env
): Promise<RateLimitResult> {
  const ip = getClientIp(request);
  const key = `rl:${ip}`;
  const now = Date.now();
  const windowMs = RATE_LIMIT_WINDOW_SEC * 1000;

  // 1. Читаем текущую запись из KV
  let entry: RateLimitEntry | null = null;
  try {
    const raw = await env.RATE_LIMIT.get(key);
    if (raw) {
      entry = JSON.parse(raw) as RateLimitEntry;
    }
  } catch (err) {
    // KV временно недоступен — не блокируем пользователя, разрешаем
    console.error('[rateLimit] KV read error:', err);
    return {
      allowed: true,
      current: 0,
      limit: RATE_LIMIT_MAX,
      resetAt: now + windowMs,
      retryAfterSec: RATE_LIMIT_WINDOW_SEC,
    };
  }

  // 2. Если записи нет или окно истекло — сбрасываем счётчик
  if (!entry || entry.resetAt <= now) {
    const newEntry: RateLimitEntry = {
      count: 1,
      resetAt: now + windowMs,
    };
    await env.RATE_LIMIT.put(key, JSON.stringify(newEntry), {
      expirationTtl: KV_TTL_SEC,
    });

    return {
      allowed: true,
      current: 1,
      limit: RATE_LIMIT_MAX,
      resetAt: newEntry.resetAt,
      retryAfterSec: RATE_LIMIT_WINDOW_SEC,
    };
  }

  // 3. Окно ещё активно — проверяем лимит
  if (entry.count >= RATE_LIMIT_MAX) {
    const retryAfterMs = entry.resetAt - now;
    return {
      allowed: false,
      current: entry.count,
      limit: RATE_LIMIT_MAX,
      resetAt: entry.resetAt,
      retryAfterSec: Math.ceil(retryAfterMs / 1000),
    };
  }

  // 4. Увеличиваем счётчик
  entry.count += 1;
  const remainingTtl = Math.ceil((entry.resetAt - now) / 1000) + 10;

  try {
    await env.RATE_LIMIT.put(key, JSON.stringify(entry), {
      expirationTtl: Math.max(60, remainingTtl),
    });
  } catch (err) {
    // Ошибка записи — не блокируем
    console.error('[rateLimit] KV write error:', err);
  }

  return {
    allowed: true,
    current: entry.count,
    limit: RATE_LIMIT_MAX,
    resetAt: entry.resetAt,
    retryAfterSec: Math.ceil((entry.resetAt - now) / 1000),
  };
}

// -----------------------------------------------------------------------------
// Формирование ответа 429 Too Many Requests.
// -----------------------------------------------------------------------------
export function rateLimitResponse(result: RateLimitResult): Response {
  return new Response(
    JSON.stringify({
      error: 'Too Many Requests',
      message: `Слишком много запросов. Попробуйте через ${result.retryAfterSec} секунд.`,
      limit: result.limit,
      retryAfterSec: result.retryAfterSec,
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Retry-After': String(result.retryAfterSec),
        'X-RateLimit-Limit': String(result.limit),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': String(result.resetAt),
      },
    }
  );
}

// -----------------------------------------------------------------------------
// Добавление заголовков с информацией о лимите к обычному ответу.
// -----------------------------------------------------------------------------
export function addRateLimitHeaders(
  response: Response,
  result: RateLimitResult
): Response {
  const headers = new Headers(response.headers);
  headers.set('X-RateLimit-Limit', String(result.limit));
  headers.set('X-RateLimit-Remaining', String(Math.max(0, result.limit - result.current)));
  headers.set('X-RateLimit-Reset', String(result.resetAt));

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}