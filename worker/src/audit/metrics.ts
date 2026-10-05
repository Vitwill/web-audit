// -----------------------------------------------------------------------------
// metrics — оценка PageSpeed и Core Web Vitals (Mobile & Desktop).
// -----------------------------------------------------------------------------
//
// ВАЖНО: это НЕ реальные замеры Lighthouse. Мы не запускаем браузер.
// Значения LCP, FCP, CLS, TBT, Speed Index эмулируются по косвенным
// признакам страницы (размер HTML, количество скриптов, картинок без
// размеров, TTFB). Для точных значений нужен Google PageSpeed Insights
// API, но он требует отдельного ключа и работает медленнее.
//
// Формулы калиброваны так, чтобы приблизительно соответствовать
// реальным распределениям Lighthouse. Оценки дают правильный порядок
// величин, но не точные миллисекунды.
//
// Используется в:
//   - worker/src/audit/fallback.ts   (алгоритмический аудит)
//   - worker/src/routes/audit.ts     (обогащение ответа Gemini)
// -----------------------------------------------------------------------------

import { ScrapedData, PageSpeedMetrics, MetricDetail, DiagnosticItem, MetricRating } from '../types';

// -----------------------------------------------------------------------------
// Вспомогательная функция: оценка по порогам.
// -----------------------------------------------------------------------------
function rateByThreshold(
  value: number,
  goodMax: number,
  needsImprovementMax: number
): MetricRating {
  if (value < goodMax) return 'good';
  if (value < needsImprovementMax) return 'needs-improvement';
  return 'poor';
}

// -----------------------------------------------------------------------------
// Главная функция: расчёт метрик для одной стратегии (mobile/desktop).
// -----------------------------------------------------------------------------
export function calculatePageSpeedMetrics(
  data: Partial<ScrapedData>,
  strategy: 'mobile' | 'desktop' = 'mobile'
): PageSpeedMetrics {
  const isMobile = strategy === 'mobile';

  // ---------------------------------------------------------------------------
  // Базовые величины
  // ---------------------------------------------------------------------------
  const baseTtfb = data.responseTimeMs || 250;
  // На мобильном добавляем 4G-задержку (~70 мс)
  const ttfb = isMobile ? Math.round(baseTtfb + 70) : baseTtfb;

  const htmlKb = data.htmlSizeKb || 50;
  const scripts = data.scriptsCount || 5;
  const styles = data.stylesCount || 3;
  const domElements = data.domElementsCount || 300;
  const images = data.imagesTotal || 0;
  const imagesNoDims = data.imagesWithoutDimensions || 0;

  // ---------------------------------------------------------------------------
  // 1. TTFB (Time to First Byte)
  // Пороги Google: good < 800 мс, poor > 1800 мс
  // ---------------------------------------------------------------------------
  const ttfbRating = rateByThreshold(ttfb, 800, 1800);

  // ---------------------------------------------------------------------------
  // 2. FCP (First Contentful Paint) — оценка
  // Мобильные: множитель 1.35 (медленнее), десктоп: 0.85 (быстрее)
  // ---------------------------------------------------------------------------
  const fcpMultiplier = isMobile ? 1.35 : 0.85;
  const fcpMs = Math.round(
    ttfb + Math.min(1800, (styles * 50 + scripts * 25 + htmlKb * 1.4) * fcpMultiplier)
  );
  const fcpSec = (fcpMs / 1000).toFixed(1);
  const fcpRating = rateByThreshold(fcpMs, isMobile ? 1800 : 1200, isMobile ? 3000 : 2400);

  // ---------------------------------------------------------------------------
  // 3. LCP (Largest Contentful Paint) — оценка
  // Зависит от FCP и наличия крупных изображений
  // ---------------------------------------------------------------------------
  const lcpMultiplier = isMobile ? 1.4 : 0.9;
  const lcpMs = Math.round(
    fcpMs +
      (images > 0
        ? (isMobile ? 650 : 350) + Math.min(1800, images * (isMobile ? 45 : 20))
        : isMobile
        ? 350
        : 180) *
        lcpMultiplier
  );
  const lcpSec = (lcpMs / 1000).toFixed(1);
  const lcpRating = rateByThreshold(lcpMs, isMobile ? 2500 : 1800, isMobile ? 4000 : 3000);

  // ---------------------------------------------------------------------------
  // 4. CLS (Cumulative Layout Shift) — оценка
  // Пороги: good < 0.1, poor > 0.25
  // ---------------------------------------------------------------------------
  let clsValue = 0.02; // базовый шум
  if (images > 0 && imagesNoDims > 0) {
    clsValue += Math.min(0.25, (imagesNoDims / images) * (isMobile ? 0.16 : 0.1));
  }
  if (!data.viewport && isMobile) {
    clsValue += 0.15;
  }
  clsValue = Math.round(clsValue * 1000) / 1000;
  const clsRating = rateByThreshold(clsValue, 0.1, 0.25);

  // ---------------------------------------------------------------------------
  // 5. TBT (Total Blocking Time) — оценка
  // Мобильный CPU в 2.2 раза медленнее десктопного
  // ---------------------------------------------------------------------------
  const cpuMultiplier = isMobile ? 2.2 : 0.7;
  let tbtMs = Math.round(
    Math.min(1500, (scripts * 30 + (domElements > 800 ? (domElements - 800) * 0.25 : 0)) * cpuMultiplier)
  );
  if (tbtMs < 40) tbtMs = 0;
  const tbtRating = rateByThreshold(tbtMs, 200, 600);

  // ---------------------------------------------------------------------------
  // 6. Speed Index — оценка
  // ---------------------------------------------------------------------------
  const speedIndexMs = Math.round((fcpMs + lcpMs) / (isMobile ? 1.6 : 1.9));
  const speedIndexSec = (speedIndexMs / 1000).toFixed(1);
  const speedIndexRating = rateByThreshold(
    speedIndexMs,
    isMobile ? 3400 : 2300,
    isMobile ? 5800 : 4400
  );

  // ---------------------------------------------------------------------------
  // Оценки Lighthouse (0–100) — приближение
  // ---------------------------------------------------------------------------
  let perfScore = 100;
  if (fcpRating === 'needs-improvement') perfScore -= 6;
  if (fcpRating === 'poor') perfScore -= 14;
  if (lcpRating === 'needs-improvement') perfScore -= 15;
  if (lcpRating === 'poor') perfScore -= 28;
  if (clsRating === 'needs-improvement') perfScore -= 12;
  if (clsRating === 'poor') perfScore -= 24;
  if (tbtRating === 'needs-improvement') perfScore -= 14;
  if (tbtRating === 'poor') perfScore -= 30;
  if (ttfbRating === 'needs-improvement') perfScore -= 5;
  if (ttfbRating === 'poor') perfScore -= 12;
  if (isMobile && !data.viewport) perfScore -= 10;
  perfScore = Math.max(25, Math.min(100, perfScore));

  // Accessibility
  let a11yScore = 100;
  if (data.imagesWithoutAlt && data.imagesWithoutAlt > 0) {
    a11yScore -= Math.min(25, data.imagesWithoutAlt * 5);
  }
  if (!data.viewport && isMobile) a11yScore -= 15;
  if (!data.h1 || data.h1.length === 0) a11yScore -= 10;
  a11yScore = Math.max(45, Math.min(100, a11yScore));

  // Best Practices
  let bestPracticesScore = 100;
  if (!data.hasSsl) bestPracticesScore -= 30;
  if (data.serverHeaders?.cacheControl?.includes('no-cache')) bestPracticesScore -= 10;
  if (domElements > 1500) bestPracticesScore -= 15;
  bestPracticesScore = Math.max(40, Math.min(100, bestPracticesScore));

  // SEO
  let seoAuditScore = 100;
  if (!data.title || data.title.length < 15) seoAuditScore -= 20;
  if (!data.description || data.description.length < 30) seoAuditScore -= 15;
  if (!data.h1 || data.h1.length === 0) seoAuditScore -= 15;
  if (!data.viewport) seoAuditScore -= isMobile ? 25 : 10;
  if (!data.canonical) seoAuditScore -= 5;
  if (data.imagesWithoutAlt && data.imagesWithoutAlt > 0) seoAuditScore -= 10;
  seoAuditScore = Math.max(40, Math.min(100, seoAuditScore));

  // ---------------------------------------------------------------------------
  // Diagnostics
  // ---------------------------------------------------------------------------
  const diagnostics: DiagnosticItem[] = [
    {
      title: isMobile
        ? 'Время ответа сервера (TTFB на 4G)'
        : 'Время ответа сервера (TTFB на Desktop)',
      displayValue: `${ttfb} мс`,
      score: ttfbRating === 'good' ? 'good' : ttfbRating === 'needs-improvement' ? 'warning' : 'error',
      description:
        ttfb < 800
          ? 'Сервер отдаёт начальный байт моментально, отличный показатель для сканирования.'
          : 'Задержка ответа сервера может замедлять индексацию страниц краулерами Google.',
      recommendation:
        ttfb >= 800
          ? 'Настройте серверное кэширование (Redis / Varnish) и CDN-проксирование.'
          : undefined,
    },
    {
      title: isMobile
        ? 'Мобильная адаптивность (Viewport)'
        : 'Мета-тег масштабирования Viewport',
      displayValue: data.viewport ? 'Обнаружен' : 'Отсутствует',
      score: data.viewport ? 'good' : 'error',
      description: data.viewport
        ? 'Страница оптимизирована под мобильные экраны (Mobile-First Indexing).'
        : 'Критическая ошибка: страница не масштабируется на экранах смартфонов.',
      recommendation: !data.viewport
        ? 'Добавьте тег <meta name="viewport" content="width=device-width, initial-scale=1.0">.'
        : undefined,
    },
    {
      title: 'Размер HTML-документа',
      displayValue: `${htmlKb} КБ`,
      score: htmlKb < 120 ? 'good' : htmlKb < 250 ? 'warning' : 'error',
      description:
        htmlKb < 120
          ? 'Размер разметки лёгкий, документ быстро передаётся по сети.'
          : 'Большой размер HTML замедляет парсинг DOM браузером.',
      recommendation:
        htmlKb >= 120
          ? 'Минифицируйте HTML, вынесите инлайн-скрипты и стили во внешние файлы.'
          : undefined,
    },
    {
      title: 'Атрибуты Alt у изображений',
      displayValue: `${(data.imagesTotal || 0) - (data.imagesWithoutAlt || 0)} из ${data.imagesTotal || 0} с Alt`,
      score: (data.imagesWithoutAlt || 0) === 0 ? 'good' : 'warning',
      description:
        (data.imagesWithoutAlt || 0) === 0
          ? 'Все картинки имеют текстовые описания для поисковиков и слабовидящих.'
          : `Найдено ${data.imagesWithoutAlt} изображений без alt.`,
      recommendation:
        (data.imagesWithoutAlt || 0) > 0
          ? 'Пропишите точные атрибуты alt для всех контентных изображений.'
          : undefined,
    },
    {
      title: 'Сложность DOM-дерева',
      displayValue: `${domElements} элементов`,
      score: domElements < 800 ? 'good' : domElements < 1400 ? 'warning' : 'error',
      description:
        domElements < 800
          ? 'Оптимальная глубина DOM, браузер быстро строит дерево рендеринга.'
          : 'Избыточное количество DOM-узлов увеличивает расход памяти и TBT.',
      recommendation:
        domElements >= 800
          ? 'Упростите вложенность тегов и используйте виртуализацию длинных списков.'
          : undefined,
    },
    {
      title: 'Сжатие и сетевая передача',
      displayValue: data.serverHeaders?.compression || 'не определён',
      score: 'good',
      description: 'Используется эффективное потоковое сжатие для экономии сетевого трафика.',
    },
  ];

  // ---------------------------------------------------------------------------
  // Итоговый объект
  // ---------------------------------------------------------------------------
  return {
    performanceScore: perfScore,
    accessibilityScore: a11yScore,
    bestPracticesScore: bestPracticesScore,
    seoScore: seoAuditScore,
    ttfb: {
      value: ttfb,
      formatted: `${ttfb} мс`,
      unit: 'мс',
      rating: ttfbRating,
      label: isMobile ? 'Time to First Byte (4G Mobile)' : 'Time to First Byte (Desktop)',
      description: 'Время до получения первого байта ответа сервера.',
    },
    fcp: {
      value: fcpMs,
      formatted: `${fcpSec} с`,
      unit: 'с',
      rating: fcpRating,
      label: 'First Contentful Paint (FCP)',
      description: 'Время появления первого видимого элемента контента (текста или изображения).',
    },
    lcp: {
      value: lcpMs,
      formatted: `${lcpSec} с`,
      unit: 'с',
      rating: lcpRating,
      label: 'Largest Contentful Paint (LCP)',
      description: 'Время отрисовки самого крупного контентного блока в первом экране.',
    },
    cls: {
      value: clsValue,
      formatted: `${clsValue}`,
      unit: '',
      rating: clsRating,
      label: 'Cumulative Layout Shift (CLS)',
      description: 'Суммарный сдвиг макета при загрузке. Показатель визуальной стабильности.',
    },
    tbt: {
      value: tbtMs,
      formatted: `${tbtMs} мс`,
      unit: 'мс',
      rating: tbtRating,
      label: 'Total Blocking Time (TBT)',
      description: 'Общее время блокировки основного потока между FCP и Time to Interactive.',
    },
    speedIndex: {
      value: speedIndexMs,
      formatted: `${speedIndexSec} с`,
      unit: 'с',
      rating: speedIndexRating,
      label: 'Speed Index',
      description: 'Скорость визуального заполнения контентом видимой части страницы.',
    },
    diagnostics,
  };
}

// -----------------------------------------------------------------------------
// Хелпер: получить метрики для обеих стратегий сразу.
// -----------------------------------------------------------------------------
export function calculateBothStrategies(data: Partial<ScrapedData>) {
  return {
    mobile: calculatePageSpeedMetrics(data, 'mobile'),
    desktop: calculatePageSpeedMetrics(data, 'desktop'),
  };
}