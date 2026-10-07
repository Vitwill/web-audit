// -----------------------------------------------------------------------------
// handlers/status — обработчик команды /status.
// -----------------------------------------------------------------------------
//
// ЧТО ДЕЛАЕТ:
//   Показывает текущий статус подписки пользователя.
//
// ЛОГИКА:
//   1. Получаем Telegram user_id из message.from.id.
//   2. Читаем связку tg:<userId> → uuid из KV.
//   3. Если связки нет — пользователь ещё не запускал /start <uuid>.
//   4. Если связка есть:
//      - Читаем user:<uuid> из KV.
//      - Если subscription === 'active' — сообщаем, что безлимит активен.
//      - Если subscription === 'none' — сообщаем, сколько осталось.
// -----------------------------------------------------------------------------

import { sendMessage } from '../telegram';
import type { TelegramMessage } from '../telegram';
import { getUserQuota, getUuidByTelegramId } from '../quota';
import type { Env } from '../index';

const FREE_QUOTA = 5;

const SITE_URL = 'https://vitwill.github.io/web-audit/';
const CHANNEL_URL = 'https://t.me/sites_ai_tasks';

export async function handleStatus(
  message: TelegramMessage,
  env: Env
): Promise<void> {
  const chatId = message.chat.id;
  const userId = message.from?.id;

  if (!userId) {
    console.warn('[status] no user id in message');
    return;
  }

  // Ищем UUID по telegram user_id.
  const uuid = await getUuidByTelegramId(env, userId);

  if (!uuid) {
    await sendMessage(
      env,
      chatId,
      `ℹ️ У вас пока нет активного профиля в Web-Audit.\n\n` +
        `Зайдите на сайт ${SITE_URL}, запустите аудит — и нажмите ` +
        `«Оформить подписку», чтобы активировать безлимит.`,
      { disableWebPagePreview: true }
    );
    return;
  }

  // Читаем запись пользователя.
  const quota = await getUserQuota(env, uuid);

  if (!quota) {
    await sendMessage(
      env,
      chatId,
      `⚠️ Не удалось найти данные вашего профиля. ` +
        `Попробуйте снова зайти на сайт и запустить аудит: ${SITE_URL}`,
      { disableWebPagePreview: true }
    );
    return;
  }

  // Сценарий 1: подписка активна.
  if (quota.subscription === 'active') {
    await sendMessage(
      env,
      chatId,
      `✅ Ваш безлимит активен.\n\n` +
        `Использовано аудитов: ${quota.used}.\n` +
        `Сервис: ${SITE_URL}`,
      { disableWebPagePreview: true }
    );
    return;
  }

  // Сценарий 2: подписка не активна.
  const remaining = Math.max(0, FREE_QUOTA - quota.used);
  await sendMessage(
    env,
    chatId,
    `📊 Ваш текущий статус:\n\n` +
      `• Использовано аудитов: ${quota.used} из ${FREE_QUOTA}\n` +
      `• Осталось бесплатно: ${remaining}\n\n` +
      `Чтобы активировать безлимит, подпишитесь на канал: ${CHANNEL_URL}\n` +
      `После подписки вернитесь на сайт и нажмите «Оформить подписку» ещё раз — или напишите /start с сайта.`,
    { disableWebPagePreview: true }
  );
}