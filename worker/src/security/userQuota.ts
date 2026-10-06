// -----------------------------------------------------------------------------
// userQuota — учёт бесплатной квоты пользователя (5 аудитов навсегда).
// -----------------------------------------------------------------------------
//
// ЛОГИКА:
//   - Каждому посетителю браузер выдаёт UUID (сохраняется в localStorage).
//   - UUID приходит в заголовке X-User-Id с каждым запросом к /api/audit.
//   - Worker ведёт 2 типа записей в KV:
//       user:<uuid>  → { used, subscription, firstIp, createdAt }
//       ip:<ip>      → { uuids: string[], totalUsed, createdAt }
//   - Квота считается как max(user.used, ip.totalUsed) — если пользователь
//     очистит localStorage и получит новый UUID, но останется с того же IP,
//     квота всё равно будет посчитана по IP.
//
// ПОДПИСКА:
//   - Поле subscription: 'none' | 'active'.
//   - По умолчанию 'none'. Активируется вручную через KV:
//       npx wrangler kv key put --binding=RATE_LIMIT \
//         --remote "user:<uuid>" '{"used":5,"subscription":"active",...}'
//   - При 'active' — квота не проверяется, аудит разрешён без ограничений.
//
// ЛИМИТЫ:
//   - FREE_QUOTA = 5   — бесплатных аудитов на пользователя
//   - KV_TTL_DAYS = 365 — записи хранятся год (потом автоочистка)
// -----------------------------------------------------------------------------

import { Env, UserQuotaEntry, IpQuotaEntry } from '../types';

// -----------------------------------------------------------------------------
// Настройки.
// -----------------------------------------------------------------------------
const FREE_QUOTA = 5;
const KV_TTL_SECONDS = 365 * 24 * 60 * 60; // 1 год

// -----------------------------------------------------------------------------
// Результат проверки квоты.
// -----------------------------------------------------------------------------
export interface QuotaCheckResult {
  allowed: boolean;
  reason?: 'quota_exhausted' | 'no_user_id';
  used: number;
  limit: number;
  remaining: number;
  subscription: 'none' | 'active';
  userId: string | null;
}

// -----------------------------------------------------------------------------
// Извлечение UUID пользователя из заголовка.
// -----------------------------------------------------------------------------
function getUserId(request: Request): string | null {
  const id = request.headers.get('X-User-Id');
  if (!id || typeof id !== 'string') return null;
  // Базовая валидация формата UUID v4 (мягкая)
  const trimmed = id.trim();
  if (trimmed.length < 16 || trimmed.length > 64) return null;
  if (!/^[a-zA-Z0-9-]+$/.test(trimmed)) return null;
  return trimmed;
}

// -----------------------------------------------------------------------------
// Извлечение IP.
// -----------------------------------------------------------------------------
function getClientIp(request: Request): string {
  return (
    request.headers.get('CF-Connecting-IP') ||
    request.headers.get('X-Forwarded-For')?.split(',')[0].trim() ||
    request.headers.get('X-Real-IP') ||
    'unknown'
  );
}

// -----------------------------------------------------------------------------
// Чтение записей из KV.
// -----------------------------------------------------------------------------
async function readUserEntry(
  env: Env,
  userId: string
): Promise<UserQuotaEntry | null> {
  try {
    const raw = await env.RATE_LIMIT.get(`user:${userId}`);
    if (!raw) return null;
    return JSON.parse(raw) as UserQuotaEntry;
  } catch (err) {
    console.error('[userQuota] KV read user error:', err);
    return null;
  }
}

async function readIpEntry(env: Env, ip: string): Promise<IpQuotaEntry | null> {
  try {
    const raw = await env.RATE_LIMIT.get(`ip:${ip}`);
    if (!raw) return null;
    return JSON.parse(raw) as IpQuotaEntry;
  } catch (err) {
    console.error('[userQuota] KV read ip error:', err);
    return null;
  }
}

// -----------------------------------------------------------------------------
// Запись в KV.
// -----------------------------------------------------------------------------
async function writeUserEntry(
  env: Env,
  userId: string,
  entry: UserQuotaEntry
): Promise<void> {
  try {
    await env.RATE_LIMIT.put(`user:${userId}`, JSON.stringify(entry), {
      expirationTtl: KV_TTL_SECONDS,
    });
  } catch (err) {
    console.error('[userQuota] KV write user error:', err);
  }
}

async function writeIpEntry(
  env: Env,
  ip: string,
  entry: IpQuotaEntry
): Promise<void> {
  try {
    await env.RATE_LIMIT.put(`ip:${ip}`, JSON.stringify(entry), {
      expirationTtl: KV_TTL_SECONDS,
    });
  } catch (err) {
    console.error('[userQuota] KV write ip error:', err);
  }
}

// -----------------------------------------------------------------------------
// Проверка квоты (без изменения счётчиков).
// -----------------------------------------------------------------------------
export async function checkQuota(
  request: Request,
  env: Env
): Promise<QuotaCheckResult> {
  const userId = getUserId(request);
  const ip = getClientIp(request);

  // Нет UUID — не можем считать точно, но всё равно ограничим по IP.
  if (!userId) {
    const ipEntry = await readIpEntry(env, ip);
    const totalUsed = ipEntry?.totalUsed || 0;
    const remaining = Math.max(0, FREE_QUOTA - totalUsed);

    return {
      allowed: remaining > 0,
      reason: remaining > 0 ? undefined : 'quota_exhausted',
      used: totalUsed,
      limit: FREE_QUOTA,
      remaining,
      subscription: 'none',
      userId: null,
    };
  }

  // Читаем оба счётчика.
  const [userEntry, ipEntry] = await Promise.all([
    readUserEntry(env, userId),
    readIpEntry(env, ip),
  ]);

  const userUsed = userEntry?.used || 0;
  const ipTotalUsed = ipEntry?.totalUsed || 0;

  // Эффективный счётчик: берём максимум.
  // Если у пользователя новый UUID, но с этого IP уже израсходовано 4 —
  // считаем, что израсходовано 4.
  const effectiveUsed = Math.max(userUsed, ipTotalUsed);
  const subscription = userEntry?.subscription || 'none';

  // Подписка активна — не ограничиваем.
  if (subscription === 'active') {
    return {
      allowed: true,
      used: effectiveUsed,
      limit: FREE_QUOTA,
      remaining: Infinity,
      subscription: 'active',
      userId,
    };
  }

  const remaining = Math.max(0, FREE_QUOTA - effectiveUsed);

  return {
    allowed: remaining > 0,
    reason: remaining > 0 ? undefined : 'quota_exhausted',
    used: effectiveUsed,
    limit: FREE_QUOTA,
    remaining,
    subscription,
    userId,
  };
}

// -----------------------------------------------------------------------------
// Списание квоты (после успешного аудита).
// -----------------------------------------------------------------------------
export async function consumeQuota(
  request: Request,
  env: Env
): Promise<void> {
  const userId = getUserId(request);
  const ip = getClientIp(request);
  const now = Date.now();

  // Читаем существующие записи.
  const [userEntry, ipEntry] = await Promise.all([
    userId ? readUserEntry(env, userId) : Promise.resolve(null),
    readIpEntry(env, ip),
  ]);

  // Обновляем запись пользователя.
  if (userId) {
    const newUserEntry: UserQuotaEntry = userEntry
      ? { ...userEntry, used: userEntry.used + 1 }
      : {
          used: 1,
          subscription: 'none',
          firstIp: ip,
          createdAt: now,
        };
    await writeUserEntry(env, userId, newUserEntry);
  }

  // Обновляем запись по IP.
  const uuids = ipEntry?.uuids || [];
  const newUuids =
    userId && !uuids.includes(userId) ? [...uuids, userId] : uuids;

  const newIpEntry: IpQuotaEntry = ipEntry
    ? { ...ipEntry, totalUsed: ipEntry.totalUsed + 1, uuids: newUuids }
    : {
        uuids: userId ? [userId] : [],
        totalUsed: 1,
        createdAt: now,
      };
  await writeIpEntry(env, ip, newIpEntry);
}

// -----------------------------------------------------------------------------
// Ответ 402 Payment Required (или 403) при исчерпании квоты.
// -----------------------------------------------------------------------------
export function quotaExhaustedResponse(
  result: QuotaCheckResult,
  language: 'ru' | 'en' | 'de' = 'ru'
): Response {
  const messages = {
    ru: {
      error: 'Quota Exhausted',
      message: `Бесплатный лимит (${result.limit} аудитов) исчерпан. Оформите подписку для продолжения.`,
      cta: 'Написать в Telegram: @pervyy_zakaz_bot',
      telegramUrl: 'https://t.me/pervyy_zakaz_bot',
    },
    en: {
      error: 'Quota Exhausted',
      message: `Your free limit (${result.limit} audits) is used up. Subscribe to continue.`,
      cta: 'Contact us on Telegram: @pervyy_zakaz_bot',
      telegramUrl: 'https://t.me/pervyy_zakaz_bot',
    },
    de: {
      error: 'Quota Exhausted',
      message: `Ihr kostenloses Limit (${result.limit} Audits) ist aufgebraucht. Abonnieren Sie, um fortzufahren.`,
      cta: 'Kontaktieren Sie uns auf Telegram: @pervyy_zakaz_bot',
      telegramUrl: 'https://t.me/pervyy_zakaz_bot',
    },
  };
  const msg = messages[language];

  return new Response(
    JSON.stringify({
      success: false,
      error: msg.error,
      message: msg.message,
      cta: msg.cta,
      telegramUrl: msg.telegramUrl,
      used: result.used,
      limit: result.limit,
      remaining: 0,
      subscription: result.subscription,
    }),
    {
      status: 402, // Payment Required — семантически точнее, чем 403
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'X-Quota-Remaining': '0',
        'X-Quota-Limit': String(result.limit),
      },
    }
  );
}