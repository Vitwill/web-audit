// -----------------------------------------------------------------------------
// parseHtmlData — парсинг HTML и извлечение SEO-показателей.
// -----------------------------------------------------------------------------
//
// ЧТО ИЗВЛЕКАЕТ:
//   - title, description, canonical, robots, viewport
//   - заголовки H1, H2, H3
//   - количество изображений и сколько из них без alt/размеров
//   - количество внутренних / внешних ссылок
//   - Open Graph теги
//   - размер HTML в КБ
//   - количество скриптов, стилей, DOM-элементов
//   - количество слов в body (без script/style/nav/footer)
//
// УЛУЧШЕНИЯ ПО СРАВНЕНИЮ СО СТАРЫМ server.ts:
//   - detectSiteType вынесен в отдельный модуль audit/detectSiteType.ts
//   - длины строк считаются через code points (корректно для эмодзи)
//   - compression определяется честно (без фейковых "gzip / brotli")
//   - __dirname и Node-API заменены на Web API (Workers)
// -----------------------------------------------------------------------------

import * as cheerio from 'cheerio';
import { ScrapedData } from '../types';
import { detectSiteType } from '../audit/detectSiteType';

// -----------------------------------------------------------------------------
// Подсчёт символов через code points.
// Для SEO-длин это корректнее, чем .length (UTF-16 code units).
// -----------------------------------------------------------------------------
function charCount(s: string): number {
  return [...s].length;
}

// -----------------------------------------------------------------------------
// Определение сжатия из response headers.
// Возвращает реальное значение Content-Encoding или "не определён".
// -----------------------------------------------------------------------------
function getCompressionInfo(headers?: Headers): string {
  if (!headers) return 'не определён';
  const enc = headers.get('content-encoding');
  if (!enc) return 'не определён';
  return enc.toLowerCase();
}

// -----------------------------------------------------------------------------
// Главная функция: парсинг HTML.
// -----------------------------------------------------------------------------
export function parseHtmlData(
  html: string,
  pageUrl: string = '',
  responseHeaders?: Headers,
  ttfbMs: number = 0
): ScrapedData {
  const $ = cheerio.load(html);

  // ---------------------------------------------------------------------------
  // Мета-теги
  // ---------------------------------------------------------------------------
  const title =
    $('title').first().text().trim() ||
    $('meta[property="og:title"]').attr('content')?.trim() ||
    '';

  const description =
    $('meta[name="description"]').attr('content')?.trim() ||
    $('meta[property="og:description"]').attr('content')?.trim() ||
    '';

  const canonical = $('link[rel="canonical"]').attr('href')?.trim() || '';
  const robots = $('meta[name="robots"]').attr('content')?.trim() || '';
  const viewport = $('meta[name="viewport"]').attr('content')?.trim() || '';

  // ---------------------------------------------------------------------------
  // Заголовки H1-H3
  // ---------------------------------------------------------------------------
  const h1: string[] = [];
  $('h1').each((_, el) => {
    const text = $(el).text().trim().replace(/\s+/g, ' ');
    if (text) h1.push(text);
  });

  const h2: string[] = [];
  $('h2').slice(0, 15).each((_, el) => {
    const text = $(el).text().trim().replace(/\s+/g, ' ');
    if (text) h2.push(text);
  });

  const h3: string[] = [];
  $('h3').slice(0, 15).each((_, el) => {
    const text = $(el).text().trim().replace(/\s+/g, ' ');
    if (text) h3.push(text);
  });

  // ---------------------------------------------------------------------------
  // Изображения
  // ---------------------------------------------------------------------------
  const totalImgs = $('img');
  let imagesWithoutAlt = 0;
  let imagesWithoutDimensions = 0;

  totalImgs.each((_, el) => {
    const alt = $(el).attr('alt');
    if (!alt || alt.trim() === '') imagesWithoutAlt++;

    const width = $(el).attr('width');
    const height = $(el).attr('height');
    if (!width || !height) imagesWithoutDimensions++;
  });

  // ---------------------------------------------------------------------------
  // Скрипты, стили, DOM
  // ---------------------------------------------------------------------------
  const scriptsCount = $('script').length;
  const stylesCount = $('link[rel="stylesheet"]').length + $('style').length;
  const domElementsCount = $('*').length;

  // ---------------------------------------------------------------------------
  // Ссылки (внутренние и внешние)
  // ---------------------------------------------------------------------------
  let internalLinksCount = 0;
  let externalLinksCount = 0;
  let host = '';

  try {
    if (pageUrl) host = new URL(pageUrl).hostname;
  } catch {
    // ignore
  }

  $('a[href]').each((_, el) => {
    const href = $(el).attr('href')?.trim();
    if (
      !href ||
      href.startsWith('#') ||
      href.startsWith('javascript:') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:')
    ) {
      return;
    }

    if (href.startsWith('/') || (host && href.includes(host))) {
      internalLinksCount++;
    } else if (href.startsWith('http://') || href.startsWith('https://')) {
      externalLinksCount++;
    }
  });

  // ---------------------------------------------------------------------------
  // Текст body (без script, style, nav, footer, header, svg)
  // ---------------------------------------------------------------------------
  const clone = $('body').clone();
  clone.find('script, style, noscript, svg, nav, footer, header').remove();
  const bodyText = clone.text().replace(/\s+/g, ' ').trim();
  const words = bodyText ? bodyText.split(/\s+/).filter((w) => w.length > 1) : [];

  // ---------------------------------------------------------------------------
  // Размер HTML
  // ---------------------------------------------------------------------------
  const htmlSizeKb = Math.round((new TextEncoder().encode(html).length / 1024) * 10) / 10;

  // ---------------------------------------------------------------------------
  // Заголовки ответа
  // ---------------------------------------------------------------------------
  const compression = getCompressionInfo(responseHeaders);
  const cacheControl = responseHeaders?.get('cache-control') || 'не указан';
  const serverHeader = responseHeaders?.get('server') || '';

  // ---------------------------------------------------------------------------
  // Определение типа сайта
  // (импортируется из audit/detectSiteType.ts)
  // ---------------------------------------------------------------------------
  const siteType = detectSiteType(
    pageUrl,
    title,
    description,
    [...h1, ...h2],
    bodyText.slice(0, 1500)
  );

  // ---------------------------------------------------------------------------
  // Результат
  // ---------------------------------------------------------------------------
  return {
    url: pageUrl,
    hasSsl: pageUrl.toLowerCase().startsWith('https://'),
    responseTimeMs: ttfbMs,
    htmlSizeKb,
    scriptsCount,
    stylesCount,
    domElementsCount,
    detectedSiteType: siteType,
    title,
    titleLength: charCount(title),
    description,
    descriptionLength: charCount(description),
    canonical,
    robots,
    viewport,
    h1,
    h2,
    h3,
    wordCount: words.length,
    contentSnippet: bodyText.slice(0, 3000),
    imagesTotal: totalImgs.length,
    imagesWithoutAlt,
    imagesWithoutDimensions,
    internalLinksCount,
    externalLinksCount,
    openGraph: {
      title: $('meta[property="og:title"]').attr('content')?.trim(),
      description: $('meta[property="og:description"]').attr('content')?.trim(),
      image: $('meta[property="og:image"]').attr('content')?.trim(),
    },
    serverHeaders: {
      compression,
      cacheControl,
      server: serverHeader,
    },
  };
}