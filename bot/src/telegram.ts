// -----------------------------------------------------------------------------
// telegram — клиент Telegram Bot API.
// -----------------------------------------------------------------------------
//
// ЧТО ЭТО:
//   Тонкая обёртка над REST API Telegram (api.telegram.org). Использует
//   встроенный `fetch` Cloudflare Workers — без сторонних библиотек.
//
// ЧТО ВНУТРИ:
//   - sendMessage()          — отправить текстовое сообщение
//   - sendMessageWithKeyboard() — отправить сообщение с inline-кнопками
//   - getChatMember()        — проверить подписку пользователя на канал
//   - answerCallbackQuery()  — ответить на нажатие inline-кнопки
//   - editMessageReplyMarkup() — убрать/изменить кнопки у сообщения
//   - deleteMessage()        — удалить сообщение
//
// КАК РАБОТАЕТ:
//   1. Формируется URL: https://api.telegram.org/bot<TOKEN>/<method>
//   2. Делается POST с JSON-телом (или GET с query для простых случаев).
//   3. Если ok: false — возвращается null и логируется ошибка.
//
// ОШИБКИ:
//   Все методы возвращают `null` при ошибке. Не бросают исключения —
//   это позволяет вызывающему коду продолжить работу и просто пропустить
//   неудачный вызов.
// -----------------------------------------------------------------------------

/**
 * Минимальный интерфейс Env для модуля Telegram.
 * Полный Env определён в `bot/src/index.ts`.
 */
export interface TelegramEnv {
  TELEGRAM_BOT_TOKEN: string;
}

// -----------------------------------------------------------------------------
// Базовый вызов Telegram API.
// -----------------------------------------------------------------------------
async function callTelegramApi<T = unknown>(
  env: TelegramEnv,
  method: string,
  payload: Record<string, unknown> = {}
): Promise<T | null> {
  if (!env.TELEGRAM_BOT_TOKEN) {
    console.error('[telegram] TELEGRAM_BOT_TOKEN is not set');
    return null;
  }

  const url = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/${method}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const json = (await response.json()) as {
      ok: boolean;
      result?: T;
      description?: string;
      error_code?: number;
    };

    if (!json.ok) {
      console.error(
        `[telegram] ${method} failed: ${json.error_code} ${json.description || 'unknown error'}`
      );
      return null;
    }

    return json.result ?? null;
  } catch (err: any) {
    console.error(`[telegram] ${method} threw:`, err?.message || err);
    return null;
  }
}

// -----------------------------------------------------------------------------
// Отправка текстового сообщения.
// -----------------------------------------------------------------------------
export async function sendMessage(
  env: TelegramEnv,
  chatId: number | string,
  text: string,
  options: {
    parseMode?: 'HTML' | 'Markdown' | 'MarkdownV2';
    disableWebPagePreview?: boolean;
    replyMarkup?: InlineKeyboardMarkup;
  } = {}
): Promise<{ message_id: number } | null> {
  return callTelegramApi<{ message_id: number }>(env, 'sendMessage', {
    chat_id: chatId,
    text,
    parse_mode: options.parseMode,
    disable_web_page_preview: options.disableWebPagePreview,
    reply_markup: options.replyMarkup,
  });
}

// -----------------------------------------------------------------------------
// Отправка сообщения с inline-кнопками (обёртка для удобства).
// -----------------------------------------------------------------------------
export async function sendMessageWithKeyboard(
  env: TelegramEnv,
  chatId: number | string,
  text: string,
  keyboard: InlineKeyboardMarkup,
  options: {
    parseMode?: 'HTML' | 'Markdown' | 'MarkdownV2';
    disableWebPagePreview?: boolean;
  } = {}
): Promise<{ message_id: number } | null> {
  return sendMessage(env, chatId, text, {
    ...options,
    replyMarkup: keyboard,
  });
}

// -----------------------------------------------------------------------------
// Проверка подписки пользователя на канал.
// -----------------------------------------------------------------------------
export type ChatMemberStatus =
  | 'creator'
  | 'administrator'
  | 'member'
  | 'restricted'
  | 'left'
  | 'kicked';

export interface ChatMemberResult {
  status: ChatMemberStatus;
  user: {
    id: number;
    is_bot: boolean;
    first_name: string;
    username?: string;
  };
}

/**
 * Получить информацию об участнике канала.
 *
 * ВАЖНО: бот должен быть администратором канала, иначе Telegram вернёт
 * ошибку `CHAT_ADMIN_REQUIRED` или `Bad Request: chat not found`.
 *
 * @param env        — окружение с TELEGRAM_BOT_TOKEN
 * @param channelId  — username канала (например, "@sites_ai_tasks") или numeric id
 * @param userId     — Telegram user_id пользователя
 */
export async function getChatMember(
  env: TelegramEnv,
  channelId: string | number,
  userId: number
): Promise<ChatMemberResult | null> {
  return callTelegramApi<ChatMemberResult>(env, 'getChatMember', {
    chat_id: channelId,
    user_id: userId,
  });
}

/**
 * Является ли пользователь подписчиком канала?
 * Считается подписанным, если статус: creator, administrator, member или restricted.
 */
export async function isUserSubscribed(
  env: TelegramEnv,
  channelId: string | number,
  userId: number
): Promise<boolean> {
  const member = await getChatMember(env, channelId, userId);
  if (!member) return false;

  const subscribedStatuses: ChatMemberStatus[] = [
    'creator',
    'administrator',
    'member',
    'restricted',
  ];
  return subscribedStatuses.includes(member.status);
}

// -----------------------------------------------------------------------------
// Ответ на нажатие inline-кнопки.
// -----------------------------------------------------------------------------
export async function answerCallbackQuery(
  env: TelegramEnv,
  callbackQueryId: string,
  options: {
    text?: string;
    showAlert?: boolean;
    url?: string;
    cacheTime?: number;
  } = {}
): Promise<boolean> {
  const result = await callTelegramApi<boolean>(env, 'answerCallbackQuery', {
    callback_query_id: callbackQueryId,
    text: options.text,
    show_alert: options.showAlert,
    url: options.url,
    cache_time: options.cacheTime,
  });
  return result === true;
}

// -----------------------------------------------------------------------------
// Изменение inline-клавиатуры у сообщения.
// -----------------------------------------------------------------------------
export async function editMessageReplyMarkup(
  env: TelegramEnv,
  chatId: number | string,
  messageId: number,
  replyMarkup: InlineKeyboardMarkup | null
): Promise<boolean> {
  const result = await callTelegramApi<unknown>(env, 'editMessageReplyMarkup', {
    chat_id: chatId,
    message_id: messageId,
    reply_markup: replyMarkup,
  });
  return result !== null;
}

// -----------------------------------------------------------------------------
// Удаление сообщения.
// -----------------------------------------------------------------------------
export async function deleteMessage(
  env: TelegramEnv,
  chatId: number | string,
  messageId: number
): Promise<boolean> {
  const result = await callTelegramApi<boolean>(env, 'deleteMessage', {
    chat_id: chatId,
    message_id: messageId,
  });
  return result === true;
}

// -----------------------------------------------------------------------------
// Установка webhook (используется один раз вручную, а не из кода Worker'а).
// -----------------------------------------------------------------------------
export interface SetWebhookOptions {
  url: string;
  secretToken?: string;
  dropPendingUpdates?: boolean;
}

export async function setWebhook(
  env: TelegramEnv,
  options: SetWebhookOptions
): Promise<boolean> {
  const result = await callTelegramApi<boolean>(env, 'setWebhook', {
    url: options.url,
    secret_token: options.secretToken,
    drop_pending_updates: options.dropPendingUpdates ?? false,
    allowed_updates: ['message', 'callback_query'],
  });
  return result === true;
}

// -----------------------------------------------------------------------------
// Типы для inline-клавиатуры.
// -----------------------------------------------------------------------------
export interface InlineKeyboardButton {
  text: string;
  url?: string;
  callback_data?: string;
}

export interface InlineKeyboardMarkup {
  inline_keyboard: InlineKeyboardButton[][];
}

// -----------------------------------------------------------------------------
// Типы для входящего Update от Telegram (используются в router).
// -----------------------------------------------------------------------------
export interface TelegramUser {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

export interface TelegramChat {
  id: number;
  type: 'private' | 'group' | 'supergroup' | 'channel';
  username?: string;
}

export interface TelegramMessage {
  message_id: number;
  from?: TelegramUser;
  chat: TelegramChat;
  date: number;
  text?: string;
}

export interface TelegramCallbackQuery {
  id: string;
  from: TelegramUser;
  message?: TelegramMessage;
  data?: string;
}

export interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
  callback_query?: TelegramCallbackQuery;
}