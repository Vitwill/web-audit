import React from 'react';
import { PageSpeedMetrics, DevicePageSpeed, DeviceType, AnalyzedData, Language } from '../types/seo';
import { TRANSLATIONS } from '../data/translations';
import {
  Gauge,
  Zap,
  Activity,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ExternalLink,
  Server,
  Layers,
  FileCode2,
  Smartphone,
  Laptop,
} from 'lucide-react';

interface PageSpeedSectionProps {
  pageSpeed?: PageSpeedMetrics;
  devicePageSpeed?: DevicePageSpeed;
  analyzedData?: AnalyzedData;
  url?: string;
  device: DeviceType;
  onDeviceChange: (device: DeviceType) => void;
  language?: Language;
}

export const PageSpeedSection: React.FC<PageSpeedSectionProps> = ({
  pageSpeed,
  devicePageSpeed,
  analyzedData,
  url,
  device,
  onDeviceChange,
  language = 'ru',
}) => {
  const t = TRANSLATIONS[language];

  // Use active device metrics if available, otherwise fallback to pageSpeed
  const activeMetrics: PageSpeedMetrics | undefined =
    devicePageSpeed && devicePageSpeed[device]
      ? devicePageSpeed[device]
      : pageSpeed;

  if (!activeMetrics) return null;

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600 stroke-emerald-600';
    if (score >= 50) return 'text-amber-500 stroke-amber-500';
    return 'text-rose-600 stroke-rose-600';
  };

  const getRatingBadge = (rating: 'good' | 'needs-improvement' | 'poor') => {
    if (rating === 'good') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
          <CheckCircle2 className="w-3 h-3" />
          {t.pagespeed.good}
        </span>
      );
    }
    if (rating === 'needs-improvement') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
          <AlertTriangle className="w-3 h-3" />
          {t.pagespeed.needsImprovement}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
        <XCircle className="w-3 h-3" />
        {t.pagespeed.poor}
      </span>
    );
  };

  const targetUrl = url || analyzedData?.url;
  const officialPageSpeedLink = targetUrl
    ? `https://pagespeed.web.dev/analysis?url=${encodeURIComponent(targetUrl)}`
    : null;

  const lighthouseCategories = [
    {
      title: t.pagespeed.performance,
      score: activeMetrics.performanceScore,
      icon: Zap,
      desc: language === 'en' ? 'Rendering speed & Core Web Vitals' : language === 'de' ? 'Rendering-Speed & Web Vitals' : 'Скорость рендеринга и Core Web Vitals',
    },
    {
      title: t.pagespeed.accessibility,
      score: activeMetrics.accessibilityScore,
      icon: Activity,
      desc: language === 'en' ? 'Contrast, alt tags, and DOM hierarchy' : language === 'de' ? 'Kontrast, Alt-Tags und Hierarchie' : 'Контраст, Alt-теги и структура',
    },
    {
      title: t.pagespeed.bestPractices,
      score: activeMetrics.bestPracticesScore,
      icon: ShieldCheck,
      desc: language === 'en' ? 'HTTPS, doctype, and modern security' : language === 'de' ? 'HTTPS, Doctype und Sicherheitsstandards' : 'HTTPS, стандарты безопасности и Doctype',
    },
    {
      title: t.pagespeed.seo,
      score: activeMetrics.seoScore,
      icon: Gauge,
      desc: language === 'en' ? 'Viewport, meta tags, and indexing' : language === 'de' ? 'Viewport, Metadaten und Indexierung' : 'Viewport, мета-теги и краулинг',
    },
  ];

  const vitals = [
    { metric: activeMetrics.ttfb, icon: Server },
    { metric: activeMetrics.fcp, icon: Zap },
    { metric: activeMetrics.lcp, icon: Activity },
    { metric: activeMetrics.cls, icon: Layers },
    { metric: activeMetrics.tbt, icon: FileCode2 },
    { metric: activeMetrics.speedIndex, icon: Gauge },
  ];

  return (
    <div className="bg-white rounded-2xl border border-[#ded7cb] shadow-xs overflow-hidden mb-8">
      {/* Header Bar */}
      <div className="px-6 py-4 bg-[#fbf9f5] border-b border-[#ded7cb] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#2d2822] text-white rounded-xl shadow-xs">
            <Gauge className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-stone-900">
                {t.pagespeed.title}
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-stone-200 text-stone-800 uppercase">
                Lighthouse
              </span>
            </div>
            <p className="text-xs text-stone-600 font-medium">
              {t.pagespeed.subtitle}
            </p>
          </div>
        </div>

        {/* Device Switcher & Official Google Link */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center space-x-1 p-1 bg-[#f3efe6] rounded-xl border border-[#ded7cb]">
            <button
              type="button"
              onClick={() => onDeviceChange('mobile')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                device === 'mobile'
                  ? 'bg-white text-stone-900 shadow-2xs border border-[#ded7cb]'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
              <span>{t.inputPanel.mobile}</span>
            </button>
            <button
              type="button"
              onClick={() => onDeviceChange('desktop')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                device === 'desktop'
                  ? 'bg-white text-stone-900 shadow-2xs border border-[#ded7cb]'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Laptop className="w-3.5 h-3.5 text-indigo-600" />
              <span>{t.inputPanel.desktop}</span>
            </button>
          </div>

          {officialPageSpeedLink && (
            <a
              href={officialPageSpeedLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#ded7cb] text-stone-700 hover:text-stone-900 text-xs font-bold transition hover:bg-stone-50 shadow-2xs"
            >
              <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
              <span>Google PageSpeed Live</span>
            </a>
          )}
        </div>
      </div>

      <div className="p-6">
        {/* Device banner description */}
        <div className="p-3 mb-6 rounded-xl bg-[#faf8f5] border border-[#e5dfd5] text-xs text-stone-600 font-medium flex items-center justify-between">
          <span>{device === 'mobile' ? t.pagespeed.mobileNotice : t.pagespeed.desktopNotice}</span>
          <span className="font-bold text-stone-800">
            {language === 'en' ? 'Mode:' : language === 'de' ? 'Modus:' : 'Режим:'} {device === 'mobile' ? 'Mobile' : 'Desktop'}
          </span>
        </div>

        {/* 4 Lighthouse Category Score Gauges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {lighthouseCategories.map((cat, idx) => {
            const radius = 38;
            const circumference = 2 * Math.PI * radius;
            const strokeDashoffset = circumference - (cat.score / 100) * circumference;
            const Icon = cat.icon;

            return (
              <div
                key={idx}
                className="p-4 rounded-xl border border-[#e5dfd5] bg-[#faf8f5] flex flex-col items-center text-center shadow-2xs"
              >
                <div className="relative w-24 h-24 mb-3">
                  <svg className="w-full h-full -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r={radius}
                      className="stroke-[#eae4d9]"
                      strokeWidth="7"
                      fill="transparent"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r={radius}
                      className={getScoreColor(cat.score)}
                      strokeWidth="7"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      fill="transparent"
                      style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-stone-900">{cat.score}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 mb-1">
                  <Icon className="w-4 h-4 text-stone-500" />
                  <span className="text-sm font-bold text-stone-900">{cat.title}</span>
                </div>
                <span className="text-xs text-stone-500 leading-tight">{cat.desc}</span>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 text-xs text-stone-600 mb-8 pb-4 border-b border-[#ece7de]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>90–100 ({t.pagespeed.good})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>50–89 ({t.pagespeed.needsImprovement})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>0–49 ({t.pagespeed.poor})</span>
          </div>
        </div>

        {/* Core Web Vitals Metrics Grid */}
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
            {t.pagespeed.vitalsTitle} ({device === 'mobile' ? 'Mobile' : 'Desktop'})
          </h4>
          <span className="text-[11px] text-stone-500">
            Google Core Web Vitals
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {vitals.map(({ metric, icon: Icon }, idx) => {
            return (
              <div
                key={idx}
                className="p-4 rounded-xl border border-[#e5dfd5] bg-[#faf8f5] hover:border-stone-400 transition-colors shadow-2xs"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-white border border-[#ded7cb] text-stone-700">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-stone-800 block">
                        {metric.label}
                      </span>
                    </div>
                  </div>
                  {getRatingBadge(metric.rating)}
                </div>

                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-2xl font-black text-stone-900 tracking-tight">
                    {metric.formatted}
                  </span>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">
                  {metric.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Technical Diagnostics */}
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
          {t.pagespeed.diagnosticsTitle}
        </h4>
        <div className="space-y-2.5">
          {activeMetrics.diagnostics.map((diag, i) => {
            const isGood = diag.score === 'good';
            const isWarn = diag.score === 'warning';
            return (
              <div
                key={i}
                className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isGood
                    ? 'bg-[#faf8f5] border-[#e5dfd5]'
                    : isWarn
                    ? 'bg-amber-50/60 border-amber-200'
                    : 'bg-rose-50/60 border-rose-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {isGood ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : isWarn ? (
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-600" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-stone-900">{diag.title}</span>
                      {diag.displayValue && (
                        <span className="text-xs px-2 py-0.5 rounded bg-white border border-[#ded7cb] font-mono text-stone-800 font-bold">
                          {diag.displayValue}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-600 mt-0.5">{diag.description}</p>
                    {diag.recommendation && (
                      <p className="text-xs text-indigo-900 font-semibold mt-1">
                        💡 {language === 'en' ? 'Recommendation:' : language === 'de' ? 'Empfehlung:' : 'Рекомендация:'} {diag.recommendation}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
