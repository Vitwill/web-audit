export type DeviceType = 'mobile' | 'desktop';
export type Language = 'ru' | 'en' | 'de';

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

export interface MetricDetail {
  value: number;
  formatted: string;
  unit: string;
  rating: 'good' | 'needs-improvement' | 'poor';
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
  language?: Language;
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

export interface AnalyzedData {
  url?: string;
  hasSsl?: boolean;
  statusCode?: number;
  statusMessage?: string;
  blockedByBotProtection?: boolean;
  responseTimeMs?: number;
  htmlSizeKb?: number;
  scriptsCount?: number;
  stylesCount?: number;
  domElementsCount?: number;
  detectedSiteType?: string;
  title?: string;
  titleLength?: number;
  description?: string;
  descriptionLength?: number;
  canonical?: string;
  robots?: string;
  viewport?: string;
  h1?: string[];
  h2?: string[];
  h3?: string[];
  wordCount?: number;
  imagesTotal?: number;
  imagesWithoutAlt?: number;
  imagesWithoutDimensions?: number;
  internalLinksCount?: number;
  externalLinksCount?: number;
  contentSnippet?: string;
  serverHeaders?: {
    compression?: string;
    cacheControl?: string;
    server?: string;
  };
}

export interface AuditResponse {
  success: boolean;
  analyzedData?: AnalyzedData;
  audit?: AuditResult;
  error?: string;
  warning?: string;
}
