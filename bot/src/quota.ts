// -----------------------------------------------------------------------------
// quota — работа с KV namespace RATE_LIMIT (запись user:<uuid>).
// -----------------------------------------------------------------------------
//
// ЧТО ЭТО:
//   Обёртка над Cloudflare KV, которая читает и обновляет записи
//   о подписке пользователя. Использует ТОТ ЖЕ namespace RATE_LIMIT,
//   что и основной Worker аудита — благодаря этому бот и сайт работают
//   с одной базой.
//
// ФОРМАТ ЗАПИСИ user:<uuid>:
//   {
//     "used": 5,
//     "subscription": "active",
//     "firstIp": "1.2.3.4",
//     "createdAt": 1728224000000
//   }
//
// ФОРМАТ ЗАПИСИ tg:<userId>:
//   {
//     "uuid": "abc-123-...",
//     "linkedAt": 1728224000000
//   }
//
// ВАЖНО:
//   - Записи user:<uuid> создаёт основной Worker при первом запросе
//     к /api/audit. Бот их только читает и обновляет поле subscription.
//   - Записи tg:<userId> создаёт бот при /start <uuid>. Нужны для
//     команды /status, чтобы найти UUID по Telegram user_id.
//   - TTL записей в KV — 1 год.
// -----------------------------------------------------------------------------

/**
 * Минимальный интерфейс Env для модуля quota.
 * Полный Env определён в `bot/src/index.ts`.
 */
export interface QuotaEnv {
  RATE_LIMIT: KVNamespace;
}

// -----------------------------------------------------------------------------
// Типы записей.
// -----------------------------------------------------------------------------

export interface UserQuotaEntry {
  used: number;
  subscription: 'none' | 'active';
  firstIp: string;
  createdAt: number;
}

export interface TelegramLink {
  uuid: string;
  linkedAt: number;
}

// -----------------------------------------------------------------------------
// Константы.
// -----------------------------------------------------------------------------
const KV_TTL_SECONDS = 365 * 24 * 60 * 60; // 1 год

// -----------------------------------------------------------------------------
// Ключи.
// -----------------------------------------------------------------------------
function userKey(uuid: string): string {
  return `user:${uuid}`;
}

function tgKey(telegramUserId: number): string {
  return `tg:${telegramUserId}`;
}

// -----------------------------------------------------------------------------
// Валидация UUID.
// -----------------------------------------------------------------------------
function isValidUuid(uuid: string): boolean {
  if (!uuid || typeof uuid !== 'string') return false;
  const trimmed = uuid.trim();
  if (trimmed.length < 16 || trimmed.length > 64) return false;
  if (!/^[a-zA-Z0-9-]+$/.test(trimmed)) return false;
  return true;
}

// -----------------------------------------------------------------------------
// Получить запись квоты пользователя.
// -----------------------------------------------------------------------------
export async function getUserQuota(
  env: QuotaEnv,
  uuid: string
): Promise<UserQuotaEntry | null> {
  if (!isValidUuid(uuid)) {
    console.warn('[quota] invalid uuid:', uuid);
    return null;
  }

  try {
    const raw = await env.RATE_LIMIT.get(userKey(uuid));
    if (!raw) return null;
    return JSON.parse(raw) as UserQuotaEntry;
  } catch (err) {
    console.error('[quota] KV read error:', err);
    return null;
  }
}

// -----------------------------------------------------------------------------
// Проверить, активна ли подписка у пользователя.
// -----------------------------------------------------------------------------
export async function isSubscriptionActive(
  env: QuotaEnv,
  uuid: string
): Promise<boolean> {
  const entry = await getUserQuota(env, uuid);
  return entry?.subscription === 'active';
}

// -----------------------------------------------------------------------------
// Активировать подписку (установить subscription: 'active').
// -----------------------------------------------------------------------------
//
// Если записи нет — создаёт её с нуля (used: 0, firstIp: 'bot', createdAt: now).
// Если запись есть — обновляет только поле subscription, сохраняя used,
// firstIp и createdAt.
// -----------------------------------------------------------------------------
export async function activateSubscription(
  env: QuotaEnv,
  uuid: string
): Promise<UserQuotaEntry | null> {
  if (!isValidUuid(uuid)) {
    console.warn('[quota] activateSubscription: invalid uuid:', uuid);
    return null;
  }

  const now = Date.now();
  const existing = await getUserQuota(env, uuid);

  const updated: UserQuotaEntry = existing
    ? { ...existing, subscription: 'active' }
    : {
        used: 0,
        subscription: 'active',
        firstIp: 'bot',
        createdAt: now,
      };

  try {
    await env.RATE_LIMIT.put(userKey(uuid), JSON.stringify(updated), {
      expirationTtl: KV_TTL_SECONDS,
    });
    return updated;
  } catch (err) {
    console.error('[quota] KV write error:', err);
    return null;
  }
}

// -----------------------------------------------------------------------------
// Деактивировать подписку (для тестов или отката).
// -----------------------------------------------------------------------------
export async function deactivateSubscription(
  env: QuotaEnv,
  uuid: string
): Promise<UserQuotaEntry | null> {
  if (!isValidUuid(uuid)) return null;

  const existing = await getUserQuota(env, uuid);
  if (!existing) return null;

  const updated: UserQuotaEntry = { ...existing, subscription: 'none' };

  try {
    await env.RATE_LIMIT.put(userKey(uuid), JSON.stringify(updated), {
      expirationTtl: KV_TTL_SECONDS,
    });
    return updated;
  } catch (err) {
    console.error('[quota] KV write error:', err);
    return null;
  }
}

// -----------------------------------------------------------------------------
// Связка Telegram user_id ↔ UUID.
// -----------------------------------------------------------------------------

/**
 * Сохранить связку Telegram user_id → UUID.
 * Вызывается при /start <uuid>.
 */
export async function linkTelegramUser(
  env: QuotaEnv,
  telegramUserId: number,
  uuid: string
): Promise<boolean> {
  if (!isValidUuid(uuid)) return false;
  if (!telegramUserId || telegramUserId <= 0) return false;

  const payload: TelegramLink = {
    uuid,
    linkedAt: Date.now(),
  };

  try {
    await env.RATE_LIMIT.put(tgKey(telegramUserId), JSON.stringify(payload), {
      expirationTtl: KV_TTL_SECONDS,
    });
    return true;
  } catch (err) {
    console.error('[quota] KV write tg link error:', err);
    return false;
  }
}

/**
 * Получить UUID по Telegram user_id.
 * Возвращает null, если связки нет.
 */
export async function getUuidByTelegramId(
  env: QuotaEnv,
  telegramUserId: number
): Promise<string | null> {
  if (!telegramUserId || telegramUserId <= 0) return null;

  try {
    const raw = await env.RATE_LIMIT.get(tgKey(telegramUserId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as TelegramLink;
    return parsed.uuid || null;
  } catch (err) {
    console.error('[quota] KV read tg link error:', err);
    return null;
  }
}