// -----------------------------------------------------------------------------
// routes/audit — обработчик POST /api/audit.
// -----------------------------------------------------------------------------
//
// ЧТО ДЕЛАЕТ:
//   1. Rate limit по IP.
//   2. Скачивает страницу (если URL) или использует переданный HTML.
//   3. Парсит HTML через cheerio.
//   4. Считает PageSpeed метрики (mobile + desktop).
//   5. Пытается вызвать Gemini для «умного» аудита.
//   6. Если Gemini не ответил — использует алгоритмический fallback.
//   7. Обогащает результат PageSpeed-метриками.
//   8. Возвращает { success, analyzedData, audit }.
//
// ВАЖНО:
//   Пользователь ВСЕГДА получает ответ, даже если Gemini недоступен.
//   Fallback даёт менее «умные» рекомендации, но полностью рабочий аудит.
// -----------------------------------------------------------------------------

import { Env, AuditRequest, AuditResponse, ScrapedData, AuditResult } from '../types';
import { fetchPage } from '../scraper/fetchPage';
import { parseHtmlData } from '../scraper/parseHtmlData';
import { calculatePageSpeedMetrics } from '../audit/metrics';
import { generateFallbackAudit } from '../audit/fallback';
import { generateGeminiAudit } from '../audit/gemini';
import { checkRateLimit, rateLimitResponse } from '../security/rateLimit';

// -----------------------------------------------------------------------------
// Вспомогательная функция: JSON-ответ.
// -----------------------------------------------------------------------------
function jsonResponse(data: unknown, status: number = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

// -----------------------------------------------------------------------------
// Нормализация языка.
// -----------------------------------------------------------------------------
function normalizeLang(v: unknown): 'ru' | 'en' | 'de' {
  if (v === 'en' || v === 'de') return v;
  return 'ru';
}

// -----------------------------------------------------------------------------
// Применение PageSpeed-метрик к результату.
// -----------------------------------------------------------------------------
function applyPageSpeed(
  audit: AuditResult,
  analyzedData: Partial<ScrapedData>
): AuditResult {
  const mobile = calculatePageSpeedMetrics(analyzedData, 'mobile');
  const desktop = calculatePageSpeedMetrics(analyzedData, 'desktop');

  return {
    ...audit,
    pageSpeed: mobile,
    devicePageSpeed: { mobile, desktop },
  };
}

// -----------------------------------------------------------------------------
// Обработчик.
// -----------------------------------------------------------------------------
export async function handleAudit(
  request: Request,
  env: Env,
  _ctx: ExecutionContext
): Promise<Response> {
  // 1. Метод
  if (request.method !== 'POST') {
    return jsonResponse(
      { success: false, error: 'Method Not Allowed. Use POST with JSON body.' },
      405
    );
  }

  // 2. Rate limit
  const rl = await checkRateLimit(request, env);
  if (!rl.allowed) {
    return rateLimitResponse(rl);
  }

  // 3. Парсинг тела
  let body: AuditRequest;
  try {
    body = (await request.json()) as AuditRequest;
  } catch {
    return jsonResponse({ success: false, error: 'Invalid JSON body' }, 400);
  }

  const url = body.url?.trim() || '';
  const htmlInput = body.html?.trim() || '';
  const targetKeywords = body.targetKeywords?.trim() || '';
  const lang = normalizeLang(body.lang);

  // 4. Определяем источник данных для парсинга
  let analyzedData: Partial<ScrapedData> = {};

  if (htmlInput.length > 0) {
    // Вариант А: передан HTML вручную
    analyzedData = parseHtmlData(
      htmlInput,
      url || 'https://local-page.dev',
      undefined,
      body.responseTimeMs || 180
    );
  } else if (url) {
    // Вариант Б: скачиваем страницу
    const fetchResult = await fetchPage(url);

    if (!fetchResult.ok) {
      // Бот-защита
      if (fetchResult.blockedByBotProtection) {
        return jsonResponse(
          {
            success: false,
            error: fetchResult.error,
            blockedByBotProtection: true,
            statusCode: fetchResult.statusCode,
            message:
              'Для анализа защищённого сайта перейдите во вкладку «Исходный HTML», нажмите на странице в браузере Ctrl+U (Просмотр кода), скопируйте HTML и вставьте сюда.',
          },
          403
        );
      }

      return jsonResponse(
        {
          success: false,
          error: fetchResult.error || 'Не удалось загрузить сайт',
          statusCode: fetchResult.statusCode,
        },
        422
      );
    }

    analyzedData = parseHtmlData(
      fetchResult.html,
      fetchResult.finalUrl,
      fetchResult.headers,
      fetchResult.responseTimeMs
    );
    analyzedData.statusCode = fetchResult.statusCode;
    analyzedData.statusMessage = fetchResult.statusMessage;
  } else {
    return jsonResponse(
      { success: false, error: 'Нужно передать либо url, либо html' },
      400
    );
  }

  // 5. Переопределяем поля, если пользователь передал их вручную
  if (body.title) analyzedData.title = body.title;
  if (body.description) analyzedData.description = body.description;
  if (typeof body.hasSsl === 'boolean') analyzedData.hasSsl = body.hasSsl;
  if (body.viewport) analyzedData.viewport = body.viewport;
  if (body.robots) analyzedData.robots = body.robots;

  // 6. PageSpeed-метрики (нужны для промпта Gemini и финального ответа)
  const mobilePageSpeed = calculatePageSpeedMetrics(analyzedData, 'mobile');

  // 7. Пытаемся вызвать Gemini
  let auditResult: AuditResult | null = null;

  try {
    auditResult = await generateGeminiAudit(
      analyzedData,
      mobilePageSpeed,
      targetKeywords,
      lang,
      env
    );
  } catch (err: any) {
    console.error('[audit] Gemini call threw:', err?.message || err);
    auditResult = null;
  }

  // 8. Fallback, если Gemini не ответил
  if (!auditResult) {
    auditResult = generateFallbackAudit(analyzedData, targetKeywords, lang);
  } else {
    // 9. Обогащаем результат PageSpeed-метриками (Gemini их не считает)
    auditResult = applyPageSpeed(auditResult, analyzedData);
    auditResult.detectedSiteType = analyzedData.detectedSiteType;
    auditResult.language = lang;
  }

  // 10. Финальный ответ
  const response: AuditResponse = {
    success: true,
    analyzedData: analyzedData as ScrapedData,
    audit: auditResult,
  };

  return jsonResponse(response, 200);
}