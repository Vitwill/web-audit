// -----------------------------------------------------------------------------
// gemini — вызов Google Gemini через REST API.
// -----------------------------------------------------------------------------
//
// ЧТО ДЕЛАЕТ:
// Отправляет сформированный промпт в Gemini (модель gemini-2.5-flash) и
// получает на выходе JSON-объект AuditResult.
//
// ВАЖНО:
//   - Используем нативный REST, а НЕ пакет @google/genai.
//     Причина: SDK тянет google-auth-library (~500 KB) и не совместим
//     с новыми ключами формата AQ.* на Workers.
//   - Ключ передаём через заголовок x-goog-api-key. Это работает и с
//     ключами AIza*, и с новыми AQ.*.
//   - Если Gemini не ответил или вернул невалидный JSON — возвращаем null,
//     и вызывающий код (routes/audit.ts) подставит fallback.
//
// Используется в:
//   - worker/src/routes/audit.ts
// -----------------------------------------------------------------------------

import { AuditRequest, AuditResult, Env, PageSpeedMetrics } from '../types';
import { LINKS } from '../config/links';

// -----------------------------------------------------------------------------
// Модель и эндпоинт.
// -----------------------------------------------------------------------------
const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

// -----------------------------------------------------------------------------
// Таймаут на весь запрос (мс).
// Gemini обычно отвечает за 3–8 секунд; 25 — с запасом.
// -----------------------------------------------------------------------------
const GEMINI_TIMEOUT_MS = 25000;

// -----------------------------------------------------------------------------
// Список моделей для отката — если основная недоступна.
// -----------------------------------------------------------------------------
const GEMINI_FALLBACK_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-2.0-flash',
];

// -----------------------------------------------------------------------------
// Промпты.
// -----------------------------------------------------------------------------
function buildSystemPrompt(lang: 'ru' | 'en' | 'de'): string {
  const strictLanguageBlock =
    lang === 'en'
      ? `CRITICAL LANGUAGE REQUIREMENT:
The user selected ENGLISH.
The entire audit report, all summaries, statusLevel, detectedSiteType,
all critical errors (title, impact, description, fixAction), all blocks
(findings, recommendations, ctrAnalysis, identifiedIntent, bounceRateRisk),
all beforeAfter elements, and marketingBonus MUST BE WRITTEN IN NATURAL,
FLAWLESS ENGLISH.
Even if the analyzed site is in Russian, Chinese, or German, YOUR ENTIRE
AUDIT OUTPUT MUST BE IN ENGLISH! NO OTHER LANGUAGE!`
      : lang === 'de'
      ? `KRITISCHE SPRACHANFORDERUNG:
Der Benutzer hat DEUTSCH ausgewählt.
Der GESAMTE Audit-Bericht, alle Zusammenfassungen, statusLevel, detectedSiteType,
alle kritischen Fehler, alle Blöcke, alle Vorher/Nachher-Elemente und
Marketing-Texte MÜSSEN IN EINWANDFREIEM DEUTSCH verfasst sein.
Auch wenn die analysierte Website auf Englisch oder Russisch ist:
DIE AUSGABE MUSS AUSNAHMSLOS AUF DEUTSCH SEIN!`
      : `СТРОЖАЙШЕЕ ПРАВИЛО ЯЗЫКА:
Пользователь выбрал РУССКИЙ ЯЗЫК.
ВЕСЬ аудит — summary, statusLevel, detectedSiteType, criticalErrors[].title,
criticalErrors[].impact, criticalErrors[].description, criticalErrors[].fixAction,
blocks.*.findings, blocks.*.recommendations, beforeAfter[].element,
beforeAfter[].before, beforeAfter[].after, beforeAfter[].reason,
marketingBonus.*, rawMarkdown — ДОЛЖНЫ БЫТЬ СТРОГО НА РУССКОМ ЯЗЫКЕ!
ДАЖЕ ЕСЛИ АНАЛИЗИРУЕМЫЙ САЙТ НА АНГЛИЙСКОМ ЯЗЫКЕ
(например, wikipedia.org, apple.com, google.com), ТЫ ОБЯЗАН СФОРМИРОВАТЬ
ОТЧЕТ, ВЫВОДЫ И РЕКОМЕНДАЦИИ ИСКЛЮЧИТЕЛЬНО НА РУССКОМ ЯЗЫКЕ!`;

  return `Ты — ведущий профессиональный эксперт по поисковой оптимизации (SEO) и контент-маркетингу с 10-летним опытом.
Твоя задача — проводить глубокий, экспертный, но понятный для пользователя экспресс-аудит веб-страницы на основе переданных данных.

${strictLanguageBlock}

ВАЖНЕЙШЕЕ ПРАВИЛО ПО ТЕМАТИКЕ:
Определяй реальный тип сайта и тематику!
- Если это энциклопедия, вики или образовательный сайт: рекомендации ДОЛЖНЫ быть
  энциклопедическими, информационными и просветительскими. СТРОЖАЙШЕ ЗАПРЕЩЕНО
  советовать коммерческие слова вроде "купить", "доставка", "каталог товаров",
  "гарантия качества", "заказать" для энциклопедий, блогов или некоммерческих сайтов!
- Если это интернет-магазин: давай e-commerce рекомендации (цены, корзина, доставка).
- Если это B2B / SaaS: рекомендации по автоматизации, триалу и выгодам сервиса.

Оценивай сайт строго по следующим 4 ключевым блокам:
1. Технические показатели (Technical SEO) и Core Web Vitals.
2. Видимость и потенциал в выдаче (Rankings & Visibility).
3. Поведенческие факторы и интенты (User Intent & Behavior).
4. Качество контента и ссылки (Content Quality & Backlinks).

Telegram-канал эксперта: "${LINKS.telegram.handle}"
Ссылка на канал: "${LINKS.telegram.url}"
Название канала: "${LINKS.telegram.title}"`;
}

function buildUserPrompt(
  data: any,
  pageSpeed: PageSpeedMetrics,
  targetKeywords: string,
  lang: 'ru' | 'en' | 'de'
): string {
  const langLabel = lang === 'en' ? 'ENGLISH' : lang === 'de' ? 'DEUTSCH' : 'РУССКИЙ';

  return `Проведи экспресс-аудит веб-страницы.
ВНИМАНИЕ: Язык отчета СТРОГО ${langLabel}! Все тексты и рекомендации пиши исключительно на этом языке!

URL: ${data.url || 'Не указан / Локальная страница'}
Определенный тип ресурса: ${data.detectedSiteType || 'Не определён'}
SSL (HTTPS): ${data.hasSsl ? 'Подключен (HTTPS)' : 'ОТСУТСТВУЕТ (HTTP)'}
Время ответа сервера (TTFB): ${pageSpeed.ttfb.formatted}
Метрики скорости: FCP = ${pageSpeed.fcp.formatted}, LCP = ${pageSpeed.lcp.formatted}, CLS = ${pageSpeed.cls.formatted}, TBT = ${pageSpeed.tbt.formatted}
Тег Title: "${data.title || ''}" (${data.titleLength || 0} симв.)
Тег Description: "${data.description || ''}" (${data.descriptionLength || 0} симв.)
Мета-тег robots: "${data.robots || 'Не задан (index, follow)'}"
Мета-тег viewport: "${data.viewport || 'Не найден'}"
Канонический URL (canonical): "${data.canonical || 'Не указан'}"
Заголовки H1 (${(data.h1 || []).length} шт.): ${JSON.stringify(data.h1 || [])}
Заголовки H2 (${(data.h2 || []).length} шт.): ${JSON.stringify((data.h2 || []).slice(0, 10))}
Заголовки H3 (${(data.h3 || []).length} шт.): ${JSON.stringify((data.h3 || []).slice(0, 10))}
Изображения: всего ${data.imagesTotal || 0}, без alt: ${data.imagesWithoutAlt || 0}
Внутренние ссылки: ${data.internalLinksCount || 0}, внешние: ${data.externalLinksCount || 0}
Количество слов на странице: ~${data.wordCount || 0}
Целевые ключевые запросы: ${targetKeywords || 'Определи автоматически по тематике ресурса'}

Фрагмент текста со страницы:
"""${(data.contentSnippet || 'Текстовый контент пуст').slice(0, 2500)}"""

Сформируй аудит в формате JSON согласно схеме. Обязательно подбери точные «Было / Стало» с учетом тематики сайта.`;
}

// -----------------------------------------------------------------------------
// Response Schema — заставляет Gemini вернуть строго нужную структуру.
// -----------------------------------------------------------------------------
function buildResponseSchema() {
  return {
    type: 'object',
    properties: {
      overallScore: { type: 'integer' },
      statusLevel: { type: 'string' },
      summary: { type: 'string' },
      scores: {
        type: 'object',
        properties: {
          technical: { type: 'integer' },
          visibility: { type: 'integer' },
          intent: { type: 'integer' },
          content: { type: 'integer' },
        },
        required: ['technical', 'visibility', 'intent', 'content'],
      },
      criticalErrors: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            impact: { type: 'string' },
            description: { type: 'string' },
            fixAction: { type: 'string' },
          },
          required: ['title', 'impact', 'description', 'fixAction'],
        },
      },
      blocks: {
        type: 'object',
        properties: {
          technical: {
            type: 'object',
            properties: {
              score: { type: 'integer' },
              status: { type: 'string' },
              findings: { type: 'array', items: { type: 'string' } },
              recommendations: { type: 'array', items: { type: 'string' } },
            },
            required: ['score', 'status', 'findings', 'recommendations'],
          },
          visibility: {
            type: 'object',
            properties: {
              score: { type: 'integer' },
              status: { type: 'string' },
              detectedKeywords: { type: 'array', items: { type: 'string' } },
              ctrAnalysis: { type: 'string' },
              findings: { type: 'array', items: { type: 'string' } },
              recommendations: { type: 'array', items: { type: 'string' } },
            },
            required: ['score', 'status', 'findings', 'recommendations'],
          },
          intent: {
            type: 'object',
            properties: {
              score: { type: 'integer' },
              status: { type: 'string' },
              identifiedIntent: { type: 'string' },
              bounceRateRisk: { type: 'string' },
              findings: { type: 'array', items: { type: 'string' } },
              recommendations: { type: 'array', items: { type: 'string' } },
            },
            required: ['score', 'status', 'identifiedIntent', 'findings', 'recommendations'],
          },
          contentAndLinks: {
            type: 'object',
            properties: {
              score: { type: 'integer' },
              status: { type: 'string' },
              keywordStuffingRisk: { type: 'string' },
              internalLinkingStatus: { type: 'string' },
              cannibalizationRisk: { type: 'string' },
              findings: { type: 'array', items: { type: 'string' } },
              recommendations: { type: 'array', items: { type: 'string' } },
            },
            required: ['score', 'status', 'findings', 'recommendations'],
          },
        },
        required: ['technical', 'visibility', 'intent', 'contentAndLinks'],
      },
      beforeAfter: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            element: { type: 'string' },
            before: { type: 'string' },
            after: { type: 'string' },
            reason: { type: 'string' },
            beforeCharCount: { type: 'integer' },
            afterCharCount: { type: 'integer' },
          },
          required: ['element', 'before', 'after', 'reason'],
        },
      },
      serpPreview: {
        type: 'object',
        properties: {
          displayUrl: { type: 'string' },
          currentTitle: { type: 'string' },
          currentDesc: { type: 'string' },
          optimizedTitle: { type: 'string' },
          optimizedDesc: { type: 'string' },
        },
        required: [
          'displayUrl',
          'currentTitle',
          'currentDesc',
          'optimizedTitle',
          'optimizedDesc',
        ],
      },
      marketingBonus: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          bonusText: { type: 'string' },
          telegramChannel: { type: 'string' },
          telegramUrl: { type: 'string' },
          ctaOffer: { type: 'string' },
        },
        required: ['title', 'bonusText', 'telegramChannel', 'telegramUrl', 'ctaOffer'],
      },
      rawMarkdown: { type: 'string' },
    },
    required: [
      'overallScore',
      'statusLevel',
      'summary',
      'scores',
      'criticalErrors',
      'blocks',
      'beforeAfter',
      'serpPreview',
      'marketingBonus',
      'rawMarkdown',
    ],
  };
}

// -----------------------------------------------------------------------------
// Внутренний вызов одной модели.
// -----------------------------------------------------------------------------
async function callGeminiModel(
  modelName: string,
  apiKey: string,
  systemPrompt: string,
  userPrompt: string,
  responseSchema: any
): Promise<AuditResult | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), GEMINI_TIMEOUT_MS);

  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`;

    const body = {
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
      contents: [
        {
          role: 'user',
          parts: [{ text: userPrompt }],
        },
      ],
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema,
        temperature: 0.7,
        maxOutputTokens: 8192,
      },
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Работает и с AIza*, и с AQ.* ключами
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      console.error(
        `[gemini] Model ${modelName} failed: HTTP ${response.status}. ${errText.slice(0, 300)}`
      );
      return null;
    }

    const json = (await response.json()) as any;

    // Извлекаем текст из ответа Gemini
    const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      console.error(`[gemini] Model ${modelName}: empty response`);
      return null;
    }

    // Парсим JSON
    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch {
      console.error(`[gemini] Model ${modelName}: invalid JSON`);
      return null;
    }

    return parsed as AuditResult;
  } catch (err: any) {
    const isAbort = err?.name === 'AbortError';
    console.error(
      `[gemini] Model ${modelName} error: ${isAbort ? 'timeout' : err?.message || 'unknown'}`
    );
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

// -----------------------------------------------------------------------------
// Публичная функция: вызов Gemini с откатом по моделям.
// -----------------------------------------------------------------------------
export async function generateGeminiAudit(
  analyzedData: any,
  pageSpeed: PageSpeedMetrics,
  targetKeywords: string,
  lang: 'ru' | 'en' | 'de',
  env: Env
): Promise<AuditResult | null> {
  if (!env.GEMINI_API_KEY) {
    console.warn('[gemini] GEMINI_API_KEY not set, skipping Gemini call');
    return null;
  }

  const systemPrompt = buildSystemPrompt(lang);
  const userPrompt = buildUserPrompt(analyzedData, pageSpeed, targetKeywords, lang);
  const responseSchema = buildResponseSchema();

  for (const modelName of GEMINI_FALLBACK_MODELS) {
    const result = await callGeminiModel(
      modelName,
      env.GEMINI_API_KEY,
      systemPrompt,
      userPrompt,
      responseSchema
    );
    if (result) {
      // Обогащаем результат PageSpeed-метриками (их LLM не считает)
      return result;
    }
  }

  console.error('[gemini] All models failed');
  return null;
}