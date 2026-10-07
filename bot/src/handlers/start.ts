// -----------------------------------------------------------------------------
// handlers/start — обработчик команды /start.
// -----------------------------------------------------------------------------
//
// ЧТО ДЕЛАЕТ:
//   Обрабатывает команду /start от пользователя в личке бота.
//   Формат: /start            — без UUID (приветствие)
//           /start <uuid>     — с UUID (активация подписки)
//
// ЛОГИКА (Вариант A):
//   1. Если UUID не передан — показываем приветствие с инструкцией.
//   2. Если UUID невалидный — та же подсказка.
//   3. Если подписка уже активна — напоминаем и запоминаем связку tg↔uuid.
//   4. Если пользователь подписан — активируем, запоминаем связку tg↔uuid.
//   5. Если не подписан — показываем кнопки «Подписаться» и «Я подписался».
// -----------------------------------------------------------------------------

import { sendMessage, sendMessageWithKeyboard, isUserSubscribed } from '../telegram';
import type { TelegramMessage, InlineKeyboardMarkup } from '../telegram';
import {
  activateSubscription,
  isSubscriptionActive,
  linkTelegramUser,
} from '../quota';
import type { Env } from '../index';

const SITE_URL = 'https://vitwill.github.io/web-audit/';
const CHANNEL_URL = 'https://t.me/sites_ai_tasks';

// -----------------------------------------------------------------------------
// Извлечение UUID из текста /start <uuid>.
// -----------------------------------------------------------------------------
function extractUuid(text: string): string | null {
  const parts = text.trim().split(/\s+/);
  if (parts.length < 2) return null;

  const uuid = parts[1].trim();
  if (uuid.length < 16 || uuid.length > 64) return null;
  if (!/^[a-zA-Z0-9-]+$/.test(uuid)) return null;

  return uuid;
}

// -----------------------------------------------------------------------------
// Главная функция.
// -----------------------------------------------------------------------------
export async function handleStart(
  message: TelegramMessage,
  env: Env
): Promise<void> {
  const chatId = message.chat.id;
  const text = message.text || '';
  const userId = message.from?.id;

  if (!userId) {
    console.warn('[start] no user id in message');
    return;
  }

  // Сценарий 1: /start без UUID.
  const uuid = extractUuid(text);
  if (!uuid) {
    await sendMessage(
      env,
      chatId,
      `Привет! Это бот сервиса Web-Audit.\n\n` +
        `Сервис делает экспресс-аудит сайтов: SEO, Core Web Vitals, ` +
        `структура и контент за 30 секунд.\n\n` +
        `Чтобы активировать безлимит, вернитесь на сайт ${SITE_URL} ` +
        `и нажмите кнопку «Оформить подписку».`,
      { disableWebPagePreview: true }
    );
    return;
  }

  // Подписка уже активна?
  const alreadyActive = await isSubscriptionActive(env, uuid);
  if (alreadyActive) {
    await linkTelegramUser(env, userId, uuid);
    await sendMessage(
      env,
      chatId,
      `✅ Ваша подписка уже активна.\n\n` +
        `Можете пользоваться сервисом без ограничений: ${SITE_URL}`,
      { disableWebPagePreview: true }
    );
    return;
  }

  // Проверяем подписку на канал.
  const subscribed = await isUserSubscribed(env, env.CHANNEL_ID, userId);

  // Сценарий 2: пользователь подписан — активируем сразу.
  if (subscribed) {
    const result = await activateSubscription(env, uuid);

    if (!result) {
      await sendMessage(
        env,
        chatId,
        `⚠️ Не удалось активировать подписку. Попробуйте позже или напишите в поддержку.`
      );
      return;
    }

    await linkTelegramUser(env, userId, uuid);

    await sendMessage(
      env,
      chatId,
      `Готово! 🎉\n\n` +
        `Ваш безлимитный доступ к Web-Audit активирован.\n\n` +
        `Вернитесь на сайт ${SITE_URL} и нажмите «Обновить статус».`,
      { disableWebPagePreview: true }
    );
    return;
  }

  // Сценарий 3: пользователь НЕ подписан — показываем кнопки.
  const keyboard: InlineKeyboardMarkup = {
    inline_keyboard: [
      [
        {
          text: '📢 Подписаться на канал',
          url: CHANNEL_URL,
        },
      ],
      [
        {
          text: '✅ Я подписался',
          callback_data: `check_subscription:${uuid}`,
        },
      ],
    ],
  };

  await sendMessageWithKeyboard(
    env,
    chatId,
    `Привет!\n\n` +
      `Для активации безлимита подпишитесь на канал @sites_ai_tasks.\n\n` +
      `После подписки нажмите кнопку «Я подписался» ниже.`,
    keyboard,
    { disableWebPagePreview: true }
  );
}