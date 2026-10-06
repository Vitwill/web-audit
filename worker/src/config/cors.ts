// -----------------------------------------------------------------------------
// CORS — заголовки для кросс-доменных запросов.
// -----------------------------------------------------------------------------
//
// Браузер блокирует fetch-запросы между разными доменами, если сервер
// не вернул заголовки Access-Control-Allow-*.
//
// У нас фронт живёт на vitwill.github.io, а API — на
// web-audit.my-scrapers-app.workers.dev. Это разные origin'ы, поэтому
// CORS обязателен.
//
// Правила:
//   - Разрешаем только origin из env.ALLOWED_ORIGIN (production).
//   - Плюс всегда разрешаем http://localhost:5173 (dev-сервер Vite).
//   - Разрешаем методы POST и OPTIONS.
//   - Разрешаем заголовки Content-Type и X-User-Id.
//   - Открываем для чтения X-Quota-* (остаток квоты для фронта).
// -----------------------------------------------------------------------------

import { Env } from '../types';

/**
 * Дополнительные origin'ы, разрешённые всегда (независимо от env).
 * Нужны в основном для локальной разработки.
 */
const ALLOWED_EXTRA_ORIGINS: string[] = [
  'http://localhost:5173', // Vite dev-сервер
  'http://localhost:4173', // Vite preview
  'http://127.0.0.1:5173',
];

/**
 * Возвращает набор CORS-заголовков для ответа.
 *
 * @param origin — значение заголовка `Origin` из входящего запроса
 *                 (может быть null, если запрос не кросс-доменный)
 * @param env    — переменные окружения Worker'а
 */
export function corsHeaders(
  origin: string | null,
  env: Env
): Record<string, string> {
  const allowedOrigins = [env.ALLOWED_ORIGIN, ...ALLOWED_EXTRA_ORIGINS];

  const isAllowed = origin !== null && allowedOrigins.includes(origin);

  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    // X-User-Id — для учёта квоты
    'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
    // X-Quota-* — для чтения остатка на фронте
    'Access-Control-Expose-Headers':
      'X-Quota-Remaining, X-Quota-Limit, X-Quota-Used, X-Quota-Subscription',
    'Access-Control-Max-Age': '86400', // 24 часа — браузер кэширует preflight
    Vary: 'Origin', // важно для кэширования CORS на CDN
  };

  if (isAllowed) {
    headers['Access-Control-Allow-Origin'] = origin;
  }

  return headers;
}