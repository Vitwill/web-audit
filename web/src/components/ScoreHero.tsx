import React from 'react';
import { AuditResult, DeviceType, Language } from '../types/seo';
import { Smartphone, Laptop, ArrowUpRight } from 'lucide-react';

interface ScoreHeroProps {
  audit: AuditResult;
  url?: string;
  onSelectTab: (tabIndex: number) => void;
  device?: DeviceType;
  onDeviceChange?: (device: DeviceType) => void;
  language?: Language;
}

export const ScoreHero: React.FC<ScoreHeroProps> = ({
  audit,
  url,
  onSelectTab,
  device = 'mobile',
  onDeviceChange,
  language = 'ru',
}) => {
  const { overallScore, statusLevel, summary, scores, detectedSiteType, devicePageSpeed, pageSpeed } = audit;

  const currentDevicePageSpeed =
    devicePageSpeed && devicePageSpeed[device] ? devicePageSpeed[device] : pageSpeed;

  // Цветовая градация в стиле портфолио (глубокие, приглушенные тона)
  const getScoreColor = (score: number) => {
    if (score >= 90) return { hex: '#1e5c2a', label: language === 'en' ? 'Excellent' : language === 'de' ? 'Hervorragend' : 'Отлично' }; // Глубокий зеленый
    if (score >= 75) return { hex: '#0E0E0E', label: language === 'en' ? 'Good' : language === 'de' ? 'Gut' : 'Хорошо' }; // Черный (как база)
    if (score >= 50) return { hex: '#C1440E', label: language === 'en' ? 'Needs Attention' : language === 'de' ? 'Optimierungsbedarf' : 'Требует внимания' }; // Акцентный оранжевый
    return { hex: '#8b1f29', label: language === 'en' ? 'Critical' : language === 'de' ? 'Kritisch' : 'Критично' }; // Темно-красный
  };

  const mainColor = getScoreColor(overallScore);

  const getLocalizedStatus = (status: string): string => {
    const s = (status || '').toLowerCase();
    if (s.includes('отлич') || s.includes('excel') || s.includes('hervor')) return getScoreColor(95).label;
    if (s.includes('хорош') || s.includes('good') || s.includes('gut')) return getScoreColor(80).label;
    if (s.includes('вниман') || s.includes('доработ') || s.includes('warn') || s.includes('need') || s.includes('optimier')) return getScoreColor(60).label;
    if (s.includes('критич') || s.includes('crit')) return getScoreColor(30).label;
    return status;
  };

  const pillarCards = [
    {
      id: 0,
      title: language === 'en' ? 'Technical SEO' : language === 'de' ? 'Technisches SEO' : 'Техническое SEO',
      score: scores.technical,
    },
    {
      id: 1,
      title: language === 'en' ? 'Visibility & CTR' : language === 'de' ? 'Sichtbarkeit & CTR' : 'Видимость & CTR',
      score: scores.visibility,
    },
    {
      id: 2,
      title: language === 'en' ? 'Search Intent' : language === 'de' ? 'Suchintention' : 'Поисковый интент',
      score: scores.intent,
    },
    {
      id: 3,
      title: language === 'en' ? 'Content & Links' : language === 'de' ? 'Inhalt & Links' : 'Контент & Ссылки',
      score: scores.content,
    },
  ];

  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  const assessmentTitle =
    language === 'en' ? 'Expert assessment' : language === 'de' ? 'Expertenbewertung' : 'Экспертное заключение';

  return (
    <section className="max-w-4xl mx-auto">
      {/* ---------- URL + переключатель устройства ---------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-4 border-b border-[rgba(14,14,14,0.14)]">
        {url && (
          <div className="font-mono text-[13px] text-[rgba(14,14,14,0.68)] truncate max-w-md">
            {url}
          </div>
        )}
        {onDeviceChange && (
          <div className="inline-flex bg-[#EFEBE3] border border-[rgba(14,14,14,0.22)] rounded-sm p-1 shrink-0">
            <button
              type="button"
              onClick={() => onDeviceChange('mobile')}
              className={`px-4 py-1.5 font-mono text-[11px] tracking-[0.1em] uppercase rounded-sm transition-all cursor-pointer flex items-center gap-1.5 ${
                device === 'mobile'
                  ? 'bg-[#0E0E0E] text-[#F5F2EC]'
                  : 'text-[rgba(14,14,14,0.68)] hover:text-[#0E0E0E]'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              {language === 'en' ? 'Mobile' : language === 'de' ? 'Mobil' : 'Смартфон'}
            </button>
            <button
              type="button"
              onClick={() => onDeviceChange('desktop')}
              className={`px-4 py-1.5 font-mono text-[11px] tracking-[0.1em] uppercase rounded-sm transition-all cursor-pointer flex items-center gap-1.5 ${
                device === 'desktop'
                  ? 'bg-[#0E0E0E] text-[#F5F2EC]'
                  : 'text-[rgba(14,14,14,0.68)] hover:text-[#0E0E0E]'
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
              {language === 'en' ? 'Desktop' : language === 'de' ? 'Desktop' : 'Компьютер'}
            </button>
          </div>
        )}
      </div>

      {/* ---------- Большое кольцо + оценка ---------- */}
      <div className="flex flex-col items-center mb-12">
        <div className="relative w-48 h-48 flex items-center justify-center mb-6">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r={radius}
              stroke="#EFEBE3"
              strokeWidth="4"
              fill="transparent"
            />
            <circle
              cx="100"
              cy="100"
              r={radius}
              stroke={mainColor.hex}
              strokeWidth="4"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="square"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className="font-display text-[64px] leading-none font-medium tracking-[-0.04em]"
              style={{ color: mainColor.hex }}
            >
              {overallScore}
            </span>
            <span className="font-mono text-[10px] tracking-[0.2em] text-[rgba(14,14,14,0.45)] mt-2 uppercase">
              / 100
            </span>
          </div>
        </div>

        <div
          className="font-mono text-[12px] tracking-[0.16em] uppercase mb-2"
          style={{ color: mainColor.hex }}
        >
          {statusLevel ? getLocalizedStatus(statusLevel) : mainColor.label}
        </div>

        {detectedSiteType && (
          <div className="font-mono text-[11px] text-[rgba(14,14,14,0.45)]">
            {detectedSiteType}
          </div>
        )}
      </div>

      {/* ---------- Саммари ---------- */}
      <div className="max-w-2xl mx-auto text-center mb-14 pb-10 border-b border-[rgba(14,14,14,0.14)]">
        <h2 className="font-serif italic text-xl text-[#C1440E] mb-4">
          {assessmentTitle}
        </h2>
        <p className="text-[16px] leading-relaxed text-[rgba(14,14,14,0.68)]">
          {summary}
        </p>
      </div>

      {/* ---------- 4 блока по горизонтали ---------- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 border border-[rgba(14,14,14,0.14)]">
        {pillarCards.map((pillar, i) => {
          const color = getScoreColor(pillar.score);
          return (
            <button
              key={pillar.id}
              onClick={() => onSelectTab(pillar.id)}
              className={`group text-left p-6 bg-transparent hover:bg-[#EFEBE3] transition-all cursor-pointer ${
                i !== 3 ? 'border-r border-b lg:border-b-0 border-[rgba(14,14,14,0.14)]' : ''
              } ${i < 2 ? 'border-b lg:border-b-0 border-[rgba(14,14,14,0.14)]' : ''}`}
            >
              <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-[rgba(14,14,14,0.45)] mb-6">
                {pillar.title}
              </div>
              <div className="flex items-end justify-between">
                <span
                  className="font-display text-[32px] leading-none font-medium tracking-[-0.03em]"
                  style={{ color: color.hex }}
                >
                  {pillar.score}
                  <span className="text-[16px] text-[rgba(14,14,14,0.45)] font-normal ml-1">%</span>
                </span>
                <ArrowUpRight className="w-5 h-5 text-[rgba(14,14,14,0.22)] group-hover:text-[#C1440E] transition-colors" />
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
