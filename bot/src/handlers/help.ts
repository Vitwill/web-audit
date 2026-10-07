// -----------------------------------------------------------------------------
// handlers/help — обработчик команды /help.
// -----------------------------------------------------------------------------
//
// ЧТО ДЕЛАЕТ:
//   Показывает справку по командам бота и ссылки на ресурсы.
// -----------------------------------------------------------------------------

import { sendMessage } from '../telegram';
import type { TelegramMessage } from '../telegram';
import type { Env } from '../index';

const SITE_URL = 'https://vitwill.github.io/web-audit/';
const CHANNEL_URL = 'https://t.me/sites_ai_tasks';
const PORTFOLIO_URL = 'https://vitwill.github.io/';
const ORDER_BOT = 'https://t.me/pervyy_zakaz_bot';

export async function handleHelp(
  message: TelegramMessage,
  env: Env
): Promise<void> {
  const chatId = message.chat.id;

  await sendMessage(
    env,
    chatId,
    `🤖 <b>Web Audit Bot</b>\n\n` +
      `<b>Команды:</b>\n` +
      `/start — активировать безлимит (ссылка приходит с сайта)\n` +
      `/status — проверить статус подписки\n` +
      `/help — эта справка\n\n` +
      `<b>Полезные ссылки:</b>\n` +
      `🌐 Сервис: ${SITE_URL}\n` +
      `📢 Канал: ${CHANNEL_URL}\n` +
      `💼 Портфолио: ${PORTFOLIO_URL}\n` +
      `💬 Заказать сайт: ${ORDER_BOT}`,
    { parseMode: 'HTML', disableWebPagePreview: true }
  );
}