// -----------------------------------------------------------------------------
// web-audit Worker — центральные типы.
// -----------------------------------------------------------------------------
//
// Здесь собраны все TypeScript-интерфейсы, используемые в Worker'е:
//   - Env                    — переменные окружения (KV, secrets, vars)
//   - ScrapedData            — результат парсинга HTML
//   - AnalyzedData (alias)   — то же, что ScrapedData, для совместимости с фронтом
//   - PageSpeedMetrics       — метрики Core Web Vitals + оценки Lighthouse
//   - AuditResult            — итоговый результат аудита, который уходит фронту
//   - AuditRequest           — тело POST /api/audit
//   - AuditResponse          — тело ответа /api/audit
//   - ScrapeRequest          — тело POST /api/scrape
//   - Env                    — environment bindings из wrangler.toml
// -----------------------------------------------------------------------------

/**
 * Переменные окружения и bindings Cloudflare Worker.
 *
 * Соответствует содержимому `wrangler.toml`:
 *   [vars]
 *     ALLOWED_ORIGIN = "..."
 *     ENVIRONMENT    = "..."
 *   [[kv_namespaces]]
 *     binding = "RATE_LIMIT"
 *
 * И секретам, заданным через `wrangler secret put`:
 *     GEMINI_API_KEY
 */
export interface Env {
  // [vars]
  ALLOWED_ORIGIN: string;
  ENVIRONMENT: 'production' | 'development';

  // Secrets (wrangler secret put)
  GEMINI_API_KEY: string;

  // KV bindings
  RATE_LIMIT: KVNamespace;
}

// -----------------------------------------------------------------------------
// ScrapedData — результат парсинга HTML.
// -----------------------------------------------------------------------------
// Структура повторяет то, что раньше возвращал Express-эндпоинт /api/scrape
// в файле `server.ts`. Сохранена для совместимости с фронтендом.
// -----------------------------------------------------------------------------

export interface ScrapedData {
  url: string;
  statusCode?: number;
  statusMessage?: string;
  blockedByBotProtection?: boolean;

  hasSsl: boolean;
  responseTimeMs?: number;
  htmlSizeKb?: number;
  scriptsCount?: number;
  stylesCount?: number;
  domElementsCount?: number;
  detectedSiteType?: string;

  title: string;
  titleLength: number;
  description: string;
  descriptionLength: number;
  canonical: string;
  robots: string;
  viewport: string;

  h1: string[];
  h2: string[];
  h3: string[];

  wordCount: number;
  contentSnippet: string;

  imagesTotal: number;
  imagesWithoutAlt: number;
  imagesWithoutDimensions: number;

  internalLinksCount: number;
  externalLinksCount: number;

  openGraph: {
    title?: string;
    description?: string;
    image?: string;
  };

  serverHeaders?: {
    compression?: string;
    cacheControl?: string;
    server?: string;
  };
}

/** Псевдоним для совместимости с кодом фронтенда. */
export type AnalyzedData = ScrapedData;

// -----------------------------------------------------------------------------
// PageSpeed & Core Web Vitals.
// -----------------------------------------------------------------------------

export type MetricRating = 'good' | 'needs-improvement' | 'poor';

export interface MetricDetail {
  value: number;
  formatted: string;
  unit: string;
  rating: MetricRating;
  label: string;
  description: string;
}

export interface DiagnosticItem {
  title: string;
  displayValue?: string;
  score: 'good' | 'warning' | 'error';
  description: string;
  recommendation?: string;
}

export interface PageSpeedMetrics {
  performanceScore: number;
  accessibilityScore: number;
  bestPracticesScore: number;
  seoScore: number;
  ttfb: MetricDetail;
  fcp: MetricDetail;
  lcp: MetricDetail;
  cls: MetricDetail;
  tbt: MetricDetail;
  speedIndex: MetricDetail;
  diagnostics: DiagnosticItem[];
}

export interface DevicePageSpeed {
  mobile: PageSpeedMetrics;
  desktop: PageSpeedMetrics;
}

// -----------------------------------------------------------------------------
// AuditResult — итоговый результат аудита.
// -----------------------------------------------------------------------------

export interface AuditScores {
  technical: number;
  visibility: number;
  intent: number;
  content: number;
}

export interface CriticalError {
  title: string;
  impact: string;
  description: string;
  fixAction: string;
}

export interface AuditBlockTechnical {
  score: number;
  status: string;
  findings: string[];
  recommendations: string[];
}

export interface AuditBlockVisibility {
  score: number;
  status: string;
  detectedKeywords?: string[];
  ctrAnalysis?: string;
  findings: string[];
  recommendations: string[];
}

export interface AuditBlockIntent {
  score: number;
  status: string;
  identifiedIntent: string;
  bounceRateRisk: string;
  findings: string[];
  recommendations: string[];
}

export interface AuditBlockContent {
  score: number;
  status: string;
  keywordStuffingRisk?: string;
  internalLinkingStatus?: string;
  cannibalizationRisk?: string;
  findings: string[];
  recommendations: string[];
}

export interface BeforeAfterItem {
  element: string;
  before: string;
  after: string;
  reason: string;
  beforeCharCount?: number;
  afterCharCount?: number;
}

export interface SerpPreview {
  displayUrl: string;
  currentTitle: string;
  currentDesc: string;
  optimizedTitle: string;
  optimizedDesc: string;
}

export interface MarketingBonus {
  title: string;
  bonusText: string;
  telegramChannel: string;
  telegramUrl: string;
  ctaOffer: string;
}

export interface AuditResult {
  overallScore: number;
  statusLevel: string;
  summary: string;
  detectedSiteType?: string;
  language?: string;
  scores: AuditScores;
  criticalErrors: CriticalError[];
  blocks: {
    technical: AuditBlockTechnical;
    visibility: AuditBlockVisibility;
    intent: AuditBlockIntent;
    contentAndLinks: AuditBlockContent;
  };
  beforeAfter: BeforeAfterItem[];
  serpPreview: SerpPreview;
  marketingBonus: MarketingBonus;
  pageSpeed?: PageSpeedMetrics;
  devicePageSpeed?: DevicePageSpeed;
  rawMarkdown: string;
}

// -----------------------------------------------------------------------------
// DTO для HTTP-запросов / ответов.
// -----------------------------------------------------------------------------

export interface ScrapeRequest {
  url: string;
}

export interface AuditRequest {
  url?: string;
  html?: string;
  title?: string;
  description?: string;
  h1?: string | string[];
  h2List?: string[];
  h3List?: string[];
  contentText?: string;
  robots?: string;
  viewport?: string;
  hasSsl?: boolean;
  canonical?: string;
  imagesTotal?: number;
  imagesWithoutAlt?: number;
  imagesWithoutDimensions?: number;
  internalLinksCount?: number;
  externalLinksCount?: number;
  responseTimeMs?: number;
  targetKeywords?: string;
  device?: 'mobile' | 'desktop';
  lang?: 'ru' | 'en' | 'de';
}

export interface AuditResponse {
  success: boolean;
  analyzedData?: ScrapedData;
  audit?: AuditResult;
  error?: string;
  warning?: string;
}

// -----------------------------------------------------------------------------
// Rate limiting.
// -----------------------------------------------------------------------------

export interface RateLimitEntry {
  count: number;
  resetAt: number;
}