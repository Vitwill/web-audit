// -----------------------------------------------------------------------------
// web-audit Worker — точка входа.
// -----------------------------------------------------------------------------
//
// Этот файл — «роутер»: он принимает HTTP-запросы и передаёт их нужному
// обработчику. Вся реальная логика — в модулях `routes/`, `scraper/`,
// `audit/` и т.д.
//
// Соглашения:
//   - Все API-эндпоинты живут под /api/*.
//   - Поддерживаем только POST (кроме OPTIONS preflight).
//   - CORS разрешён только для ALLOWED_ORIGIN из env.
//   - Любая необработанная ошибка превращается в 500 с общим текстом
//     (детали уходят в console.error, не в ответ).
// -----------------------------------------------------------------------------

import { Env } from './types';
import { corsHeaders } from './config/cors';
import { handleScrape } from './routes/scrape';
import { handleAudit } from './routes/audit';

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin');

    // ---------------------------------------------------------------------
    // 1. CORS preflight (OPTIONS).
    // Браузер перед POST на другой домен сначала отправляет OPTIONS,
    // ожидая получить заголовки Access-Control-Allow-*.
    // ---------------------------------------------------------------------
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(origin, env),
      });
    }

    try {
      // -------------------------------------------------------------------
      // 2. Роутинг.
      // -------------------------------------------------------------------
      let response: Response;

      switch (url.pathname) {
        case '/api/scrape':
          response = await handleScrape(request, env);
          break;

        case '/api/audit':
          response = await handleAudit(request, env, ctx);
          break;

        case '/':
        case '/health':
          // Простой health-check, чтобы можно было быстро проверить,
          // что Worker жив.
          response = new Response(
            JSON.stringify({
              ok: true,
              service: 'web-audit',
              version: '0.1.0',
              time: new Date().toISOString(),
            }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json; charset=utf-8' },
            }
          );
          break;

        default:
          response = new Response(
            JSON.stringify({ error: 'Not Found', path: url.pathname }),
            {
              status: 404,
              headers: { 'Content-Type': 'application/json; charset=utf-8' },
            }
          );
      }

      // -------------------------------------------------------------------
      // 3. Добавляем CORS-заголовки к любому ответу.
      // -------------------------------------------------------------------
      const headers = new Headers(response.headers);
      const cors = corsHeaders(origin, env);
      for (const [key, value] of Object.entries(cors)) {
        headers.set(key, value);
      }

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    } catch (err: any) {
      // -------------------------------------------------------------------
      // 4. Перехват любых неожиданных ошибок.
      // Детали пишем в лог (видно через `wrangler tail`), клиенту
      // отдаём общее сообщение, чтобы не утекала внутренняя информация.
      // -------------------------------------------------------------------
      console.error('[web-audit] Unhandled error:', err?.stack || err);

      return new Response(
        JSON.stringify({
          error: 'Internal Server Error',
          message: 'Не удалось обработать запрос. Попробуйте позже.',
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            ...corsHeaders(origin, env),
          },
        }
      );
    }
  },
};