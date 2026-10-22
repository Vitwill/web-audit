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

  const getScoreColor = (score: number): string => {
    if (score >= 90) return '#1e5c2a';
    if (score >= 50) return '#C1440E';
    return '#8b1f29';
  };

  const getRatingBadge = (rating: 'good' | 'needs-improvement' | 'poor') => {
    const labels = {
      good: language === 'en' ? 'Good' : language === 'de' ? 'Gut' : 'Хорошо',
      'needs-improvement': language === 'en' ? 'Needs work' : language === 'de' ? 'Verbessern' : 'Улучшить',
      poor: language === 'en' ? 'Poor' : language === 'de' ? 'Schlecht' : 'Плохо',
    };
    
    const config = {
      good: { color: '#1e5c2a', icon: CheckCircle2 },
      'needs-improvement': { color: '#C1440E', icon: AlertTriangle },
      poor: { color: '#8b1f29', icon: XCircle },
    };
    
    const { color, icon: Icon } = config[rating];

    return (
      <span
        className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.1em] uppercase"
        style={{ color }}
      >
        <Icon className="w-3.5 h-3.5" />
        {labels[rating]}
      </span>
    );
  };

  const categories = [
    { title: language === 'en' ? 'Performance' : language === 'de' ? 'Leistung' : 'Производительность', score: activeMetrics.performanceScore },
    { title: language === 'en' ? 'Accessibility' : language === 'de' ? 'Barrierefreiheit' : 'Доступность', score: activeMetrics.accessibilityScore },
    { title: language === 'en' ? 'Best Practices' : language === 'de' ? 'Best Practices' : 'Практики', score: activeMetrics.bestPracticesScore },
    { title: 'SEO', score: activeMetrics.seoScore },
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
  const sectionSubtitle = language === 'en' ? 'Load speed, layout stability and responsiveness' : language === 'de' ? 'Ladegeschwindigkeit, Layout-Stabilität und Reaktionsfähigkeit' : 'Скорость загрузки, стабильность вёрстки и отзывчивость интерфейса';
  const vitalTitle = language === 'en' ? 'Core Web Vitals' : language === 'de' ? 'Core Web Vitals' : 'Ключевые метрики Core Web Vitals';
  const diagTitle = language === 'en' ? 'Diagnostics & recommendations' : language === 'de' ? 'Diagnose & Empfehlungen' : 'Диагностика и рекомендации по ускорению';

  return (
    <section className="max-w-4xl mx-auto">
      {/* ---------- Заголовок секции ---------- */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 pb-4 border-b border-[rgba(14,14,14,0.14)]">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-medium tracking-[-0.03em] text-[#0E0E0E] mb-2">
            {sectionTitle}
          </h2>
          <p className="font-mono text-[11px] tracking-[0.1em] uppercase text-[rgba(14,14,14,0.45)]">
            {sectionSubtitle}
          </p>
        </div>
      </div>

      {/* ---------- 4 кольца категорий ---------- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border border-[rgba(14,14,14,0.14)] mb-12">
        {categories.map((cat, idx) => {
          const color = getScoreColor(cat.score);
          const radius = 30;
          const circumference = 2 * Math.PI * radius;
          const offset = circumference - (cat.score / 100) * circumference;

          return (
            <div
              key={idx}
              className={`flex flex-col items-center p-6 bg-transparent ${
                idx !== 3 ? 'border-r border-b md:border-b-0 border-[rgba(14,14,14,0.14)]' : ''
              } ${idx < 2 ? 'border-b md:border-b-0 border-[rgba(14,14,14,0.14)]' : ''}`}
            >
              <div className="relative w-20 h-20 mb-4">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r={radius} stroke="#EFEBE3" strokeWidth="3" fill="transparent" />
                  <circle
                    cx="40" cy="40" r={radius}
                    stroke={color} strokeWidth="3"
                    strokeDasharray={circumference} strokeDashoffset={offset}
                    strokeLinecap="square" fill="transparent"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-display text-2xl font-medium tracking-tight" style={{ color }}>
                    {cat.score}
                  </span>
                </div>
              </div>
              <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-[rgba(14,14,14,0.68)] text-center">
                {cat.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* ---------- Core Web Vitals ---------- */}
      <h3 className="font-mono text-[11px] tracking-[0.16em] uppercase text-[rgba(14,14,14,0.45)] mb-4">
        {vitalTitle}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
        {vitals.map(({ metric }, idx) => (
          <div key={idx} className="p-5 bg-[#EFEBE3] rounded-sm border border-[rgba(14,14,14,0.14)]">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-[11px] text-[rgba(14,14,14,0.45)] uppercase tracking-wide">
                {metric.label}
              </span>
              {getRatingBadge(metric.rating)}
            </div>
            <div className="font-display text-[28px] leading-none font-medium tracking-tight text-[#0E0E0E] mb-2">
              {metric.formatted}
            </div>
            <p className="text-[13px] text-[rgba(14,14,14,0.68)] leading-relaxed">{metric.description}</p>
          </div>
        ))}
      </div>

      {/* ---------- Диагностика ---------- */}
      <h3 className="font-mono text-[11px] tracking-[0.16em] uppercase text-[rgba(14,14,14,0.45)] mb-4">
        {diagTitle}
      </h3>

      <div className="space-y-2">
        {activeMetrics.diagnostics.map((diag, i) => {
          const isGood = diag.score === 'good';
          const isWarn = diag.score === 'warning';
          const Icon = isGood ? CheckCircle2 : isWarn ? AlertTriangle : XCircle;
          const color = isGood ? '#1e5c2a' : isWarn ? '#C1440E' : '#8b1f29';

          return (
            <div key={i} className="p-5 bg-[#EFEBE3] rounded-sm border border-[rgba(14,14,14,0.14)]">
              <div className="flex items-start gap-4">
                <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color }} />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span className="text-[15px] font-medium text-[#0E0E0E]">
                      {diag.title}
                    </span>
                    {diag.displayValue && (
                      <span className="font-mono text-[11px] px-2 py-0.5 rounded-sm bg-[#F5F2EC] border border-[rgba(14,14,14,0.14)] text-[rgba(14,14,14,0.68)]">
                        {diag.displayValue}
                      </span>
                    )}
                  </div>
                  <p className="text-[13px] text-[rgba(14,14,14,0.68)] leading-relaxed">
                    {diag.description}
                  </p>
                  {diag.recommendation && (
                    <p className="text-[13px] text-[#C1440E] mt-2 leading-relaxed">
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
