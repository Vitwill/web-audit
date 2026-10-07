// -----------------------------------------------------------------------------
// web-audit-bot — точка входа Telegram-бота.
// -----------------------------------------------------------------------------
//
// ЧТО ДЕЛАЕТ:
//   1. Принимает webhook от Telegram (POST /telegram/webhook).
//   2. Проверяет секрет X-Telegram-Bot-Api-Secret-Token.
//   3. Разбирает Update (message или callback_query).
//   4. Направляет в нужный handler.
//   5. Отвечает 200 OK, чтобы Telegram не ретраил.
//
// КОМАНДЫ:
//   /start [uuid]  — активация подписки (uuid приходит с сайта)
//   /status        — проверить статус подписки
//   /help          — справка
//
// ENV (задаётся в wrangler.toml и secrets):
//   TELEGRAM_BOT_TOKEN       — токен бота (secret)
//   TELEGRAM_WEBHOOK_SECRET  — секрет для проверки webhook (secret, опционально)
//   CHANNEL_ID               — username канала для проверки подписки (var)
//   ENVIRONMENT              — 'production' | 'development' (var)
//   RATE_LIMIT               — KV namespace (binding)
// -----------------------------------------------------------------------------

import { handleStart } from './handlers/start';
import { handleStatus } from './handlers/status';
import { handleHelp } from './handlers/help';
import { handleCallback } from './handlers/callback';
import type { TelegramUpdate } from './telegram';

// -----------------------------------------------------------------------------
// Env — переменные окружения и bindings.
// -----------------------------------------------------------------------------
export interface Env {
  // Secrets
  TELEGRAM_BOT_TOKEN: string;
  TELEGRAM_WEBHOOK_SECRET?: string;

  // Vars
  CHANNEL_ID: string;
  ENVIRONMENT: 'production' | 'development';

  // KV namespace (тот же, что в основном Worker'е)
  RATE_LIMIT: KVNamespace;
}

// -----------------------------------------------------------------------------
// Ответ 200 OK (для Telegram).
// -----------------------------------------------------------------------------
function ok(): Response {
  return new Response('OK', { status: 200 });
}

// -----------------------------------------------------------------------------
// Разбор Update и вызов handler'а.
// -----------------------------------------------------------------------------
async function routeUpdate(update: TelegramUpdate, env: Env): Promise<void> {
  // 1. Callback query (нажатие inline-кнопки).
  if (update.callback_query) {
    await handleCallback(update.callback_query, env);
    return;
  }

  // 2. Текстовые команды.
  const message = update.message;
  if (!message || !message.text) return;

  const text = message.text.trim();

  // /start, /start@bot, /start <uuid>
  if (/^\/start(\s|$|@)/.test(text)) {
    await handleStart(message, env);
    return;
  }

  if (/^\/status(\s|$|@)/.test(text)) {
    await handleStatus(message, env);
    return;
  }

  if (/^\/help(\s|$|@)/.test(text)) {
    await handleHelp(message, env);
    return;
  }

  // Неизвестные команды игнорируем.
  console.log('[bot] unhandled message:', text.slice(0, 50));
}

// -----------------------------------------------------------------------------
// Главный fetch.
// -----------------------------------------------------------------------------
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // -------- /health --------
    if (url.pathname === '/health' && request.method === 'GET') {
      return new Response(
        JSON.stringify({
          ok: true,
          service: 'web-audit-bot',
          version: '0.1.0',
          channel: env.CHANNEL_ID,
          hasToken: Boolean(env.TELEGRAM_BOT_TOKEN),
          time: new Date().toISOString(),
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
        }
      );
    }

    // -------- /telegram/webhook --------
    if (url.pathname === '/telegram/webhook' && request.method === 'POST') {
      // 1. Проверка секрета (если задан).
      if (env.TELEGRAM_WEBHOOK_SECRET) {
        const secret = request.headers.get('X-Telegram-Bot-Api-Secret-Token');
        if (secret !== env.TELEGRAM_WEBHOOK_SECRET) {
          console.warn('[bot] webhook secret mismatch');
          return new Response('Forbidden', { status: 403 });
        }
      }

      // 2. Парсинг JSON.
      let update: TelegramUpdate;
      try {
        update = (await request.json()) as TelegramUpdate;
      } catch (err) {
        console.error('[bot] invalid JSON in webhook:', err);
        // Отвечаем 200, чтобы Telegram не ретраил битый запрос.
        return ok();
      }

      // 3. Обработка в фоне через ctx.waitUntil — чтобы ответить Telegram
      //    быстро и не держать соединение.
      ctx.waitUntil(
        routeUpdate(update, env).catch((err) => {
          console.error('[bot] routeUpdate error:', err);
        })
      );

      // 4. Всегда отвечаем 200 OK.
      return ok();
    }

    // -------- всё остальное --------
    return new Response('Not Found', { status: 404 });
  },
};