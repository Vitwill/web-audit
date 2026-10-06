import React from 'react';
import {
  PageSpeedMetrics,
  DevicePageSpeed,
  DeviceType,
  AnalyzedData,
  Language,
} from '../types/seo';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
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
  device,
  onDeviceChange,
  language = 'ru',
}) => {
  const activeMetrics: PageSpeedMetrics | undefined =
    devicePageSpeed && devicePageSpeed[device] ? devicePageSpeed[device] : pageSpeed;

  if (!activeMetrics) return null;

  // Цветовая градация по шкале Lighthouse
  const getScoreColor = (score: number): string => {
    if (score >= 90) return '#34c759'; // зелёный
    if (score >= 50) return '#ff9500'; // оранжевый
    return '#ff3b30'; // красный
  };

  const getRatingBadge = (rating: 'good' | 'needs-improvement' | 'poor') => {
    const labels = {
      good: language === 'en' ? 'Good' : language === 'de' ? 'Gut' : 'Хорошо',
      'needs-improvement':
        language === 'en' ? 'Needs work' : language === 'de' ? 'Verbessern' : 'Улучшить',
      poor: language === 'en' ? 'Poor' : language === 'de' ? 'Schlecht' : 'Плохо',
    };
    const colors = {
      good: { bg: 'bg-[#e8f8ee]', text: 'text-[#34c759]', icon: CheckCircle2 },
      'needs-improvement': { bg: 'bg-[#fff3e0]', text: 'text-[#ff9500]', icon: AlertTriangle },
      poor: { bg: 'bg-[#ffeceb]', text: 'text-[#ff3b30]', icon: XCircle },
    };
    const config = colors[rating];
    const Icon = config.icon;
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium ${config.bg} ${config.text}`}
      >
        <Icon className="w-3 h-3" />
        {labels[rating]}
      </span>
    );
  };

  const categories = [
    {
      title:
        language === 'en'
          ? 'Performance'
          : language === 'de'
          ? 'Leistung'
          : 'Производительность',
      score: activeMetrics.performanceScore,
    },
    {
      title:
        language === 'en'
          ? 'Accessibility'
          : language === 'de'
          ? 'Barrierefreiheit'
          : 'Доступность',
      score: activeMetrics.accessibilityScore,
    },
    {
      title:
        language === 'en'
          ? 'Best Practices'
          : language === 'de'
          ? 'Best Practices'
          : 'Практики',
      score: activeMetrics.bestPracticesScore,
    },
    {
      title: 'SEO',
      score: activeMetrics.seoScore,
    },
  ];

  const vitals = [
    { metric: activeMetrics.ttfb },
    { metric: activeMetrics.fcp },
    { metric: activeMetrics.lcp },
    { metric: activeMetrics.cls },
    { metric: activeMetrics.tbt },
    { metric: activeMetrics.speedIndex },
  ];

  const sectionTitle = 'PageSpeed & Core Web Vitals';

  const sectionSubtitle =
    language === 'en'
      ? 'Load speed, layout stability and responsiveness'
      : language === 'de'
      ? 'Ladegeschwindigkeit, Layout-Stabilität und Reaktionsfähigkeit'
      : 'Скорость загрузки, стабильность вёрстки и отзывчивость интерфейса';

  const vitalTitle =
    language === 'en'
      ? 'Core Web Vitals'
      : language === 'de'
      ? 'Core Web Vitals'
      : 'Ключевые метрики Core Web Vitals';

  const diagTitle =
    language === 'en'
      ? 'Diagnostics & recommendations'
      : language === 'de'
      ? 'Diagnose & Empfehlungen'
      : 'Диагностика и рекомендации по ускорению';

  const deviceLabels = {
    mobile:
      language === 'en' ? 'Mobile' : language === 'de' ? 'Mobil' : 'Смартфон (Mobile)',
    desktop:
      language === 'en'
        ? 'Desktop'
        : language === 'de'
        ? 'Desktop'
        : 'Компьютер (Desktop)',
  };

  return (
    <section className="max-w-4xl mx-auto">
      {/* ---------- Заголовок секции ---------- */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1d1d1f] mb-2">
            {sectionTitle}
          </h2>
          <p className="text-sm text-[#6e6e73]">{sectionSubtitle}</p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Переключатель Mobile/Desktop */}
          <div className="inline-flex p-1 bg-[#f5f5f7] rounded-full">
            <button
              type="button"
              onClick={() => onDeviceChange('mobile')}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-apple cursor-pointer ${
                device === 'mobile'
                  ? 'bg-white text-[#1d1d1f] shadow-sm'
                  : 'text-[#6e6e73] hover:text-[#1d1d1f]'
              }`}
            >
              {deviceLabels.mobile}
            </button>
            <button
              type="button"
              onClick={() => onDeviceChange('desktop')}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-apple cursor-pointer ${
                device === 'desktop'
                  ? 'bg-white text-[#1d1d1f] shadow-sm'
                  : 'text-[#6e6e73] hover:text-[#1d1d1f]'
              }`}
            >
              {deviceLabels.desktop}
            </button>
          </div>
        </div>
      </div>

      {/* ---------- 4 кольца категорий ---------- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {categories.map((cat, idx) => {
          const color = getScoreColor(cat.score);
          const radius = 34;
          const circumference = 2 * Math.PI * radius;
          const offset = circumference - (cat.score / 100) * circumference;

          return (
            <div
              key={idx}
              className="flex flex-col items-center p-6 bg-white rounded-3xl border border-[#e5e5e7] shadow-apple"
            >
              <div className="relative w-24 h-24 mb-4">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
                  <circle
                    cx="40"
                    cy="40"
                    r={radius}
                    stroke="#f0f0f2"
                    strokeWidth="5"
                    fill="transparent"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r={radius}
                    stroke={color}
                    strokeWidth="5"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-semibold text-[#1d1d1f]">
                    {cat.score}
                  </span>
                </div>
              </div>
              <span className="text-sm font-medium text-[#1d1d1f] text-center">
                {cat.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* ---------- Core Web Vitals ---------- */}
      <h3 className="text-xs font-medium uppercase tracking-widest text-[#86868b] mb-4">
        {vitalTitle}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-12">
        {vitals.map(({ metric }, idx) => (
          <div
            key={idx}
            className="p-5 bg-white rounded-2xl border border-[#e5e5e7] shadow-apple"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-[#6e6e73] uppercase tracking-wide">
                {metric.label}
              </span>
              {getRatingBadge(metric.rating)}
            </div>
            <div className="text-3xl font-semibold tracking-tight text-[#1d1d1f] mb-2">
              {metric.formatted}
            </div>
            <p className="text-xs text-[#6e6e73] leading-relaxed">{metric.description}</p>
          </div>
        ))}
      </div>

      {/* ---------- Диагностика ---------- */}
      <h3 className="text-xs font-medium uppercase tracking-widest text-[#86868b] mb-4">
        {diagTitle}
      </h3>

      <div className="space-y-2">
        {activeMetrics.diagnostics.map((diag, i) => {
          const isGood = diag.score === 'good';
          const isWarn = diag.score === 'warning';
          const Icon = isGood ? CheckCircle2 : isWarn ? AlertTriangle : XCircle;
          const color = isGood ? '#34c759' : isWarn ? '#ff9500' : '#ff3b30';

          return (
            <div
              key={i}
              className="p-5 bg-white rounded-2xl border border-[#e5e5e7] shadow-apple"
            >
              <div className="flex items-start gap-4">
                <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color }} />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="text-sm font-medium text-[#1d1d1f]">
                      {diag.title}
                    </span>
                    {diag.displayValue && (
                      <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-[#f5f5f7] text-[#6e6e73]">
                        {diag.displayValue}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#6e6e73] leading-relaxed">
                    {diag.description}
                  </p>
                  {diag.recommendation && (
                    <p className="text-xs text-[#0071e3] mt-2 leading-relaxed">
                      {diag.recommendation}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};