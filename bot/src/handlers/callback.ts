// -----------------------------------------------------------------------------
// handlers/callback — обработчик нажатий на inline-кнопки.
// -----------------------------------------------------------------------------
//
// ЧТО ДЕЛАЕТ:
//   Обрабатывает callback_query от Telegram — нажатие на кнопки
//   в сообщениях бота.
//
// ПОДДЕРЖИВАЕМЫЕ CALLBACK_DATA:
//   - "check_subscription:<uuid>" — пользователь нажал «Я подписался».
//     Бот заново проверяет подписку и либо активирует безлимит,
//     либо сообщает, что подписка не найдена.
//
// ЛОГИКА:
//   1. Извлекаем callback_data.
//   2. Парсим префикс и параметры.
//   3. Выполняем соответствующее действие.
//   4. Всегда отвечаем через answerCallbackQuery (иначе кнопка «висит»).
// -----------------------------------------------------------------------------

import {
  answerCallbackQuery,
  editMessageReplyMarkup,
  isUserSubscribed,
  sendMessage,
} from '../telegram';
import type { TelegramCallbackQuery } from '../telegram';
import { activateSubscription, linkTelegramUser } from '../quota';
import type { Env } from '../index';

const SITE_URL = 'https://vitwill.github.io/web-audit/';

// -----------------------------------------------------------------------------
// Главная функция.
// -----------------------------------------------------------------------------
export async function handleCallback(
  callback: TelegramCallbackQuery,
  env: Env
): Promise<void> {
  const data = callback.data || '';
  const userId = callback.from.id;
  const chatId = callback.message?.chat.id;
  const messageId = callback.message?.message_id;

  // Разбираем callback_data: "action:param1:param2..."
  const [action, ...params] = data.split(':');

  if (action === 'check_subscription') {
    await handleCheckSubscription(callback, env, params[0]);
    return;
  }

  // Неизвестный callback — просто отвечаем.
  await answerCallbackQuery(env, callback.id, {
    text: 'Команда не распознана',
    showAlert: false,
  });
}

// -----------------------------------------------------------------------------
// Проверка подписки по нажатию «Я подписался».
// -----------------------------------------------------------------------------
async function handleCheckSubscription(
  callback: TelegramCallbackQuery,
  env: Env,
  uuid: string | undefined
): Promise<void> {
  const callbackId = callback.id;
  const userId = callback.from.id;
  const chatId = callback.message?.chat.id;
  const messageId = callback.message?.message_id;

  // UUID передан?
  if (!uuid || uuid.length < 16 || uuid.length > 64) {
    await answerCallbackQuery(env, callbackId, {
      text: '⚠️ Некорректная ссылка. Вернитесь на сайт и нажмите кнопку заново.',
      showAlert: true,
    });
    return;
  }

  // Проверяем подписку через Telegram API.
  const subscribed = await isUserSubscribed(env, env.CHANNEL_ID, userId);

  if (!subscribed) {
    await answerCallbackQuery(env, callbackId, {
      text: '❌ Пока не вижу вашу подписку на канал. Подпишитесь и нажмите снова.',
      showAlert: true,
    });
    return;
  }

  // Активируем безлимит.
  const result = await activateSubscription(env, uuid);

  if (!result) {
    await answerCallbackQuery(env, callbackId, {
      text: '⚠️ Не удалось активировать. Попробуйте позже.',
      showAlert: true,
    });
    return;
  }

  // Запоминаем связку telegram_user ↔ uuid для /status.
  await linkTelegramUser(env, userId, uuid);

  // Убираем кнопки у сообщения (чтобы не нажимали повторно).
  if (chatId && messageId) {
    await editMessageReplyMarkup(env, chatId, messageId, null);
  }

  // Отвечаем на callback — короткое всплывающее подтверждение.
  await answerCallbackQuery(env, callbackId, {
    text: '✅ Подписка активирована!',
    showAlert: false,
  });

  // Отправляем отдельное сообщение с подробностями.
  if (chatId) {
    await sendMessage(
      env,
      chatId,
      `Готово! 🎉\n\n` +
        `Ваш безлимитный доступ к Web-Audit активирован.\n\n` +
        `Вернитесь на сайт ${SITE_URL} и нажмите «Обновить статус».`,
      { disableWebPagePreview: true }
    );
  }
}