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

  // Цветовая градация по оценке (мягкая, «яблочная»)
  const getScoreColor = (score: number) => {
    if (score >= 90) return { hex: '#34c759', label: language === 'en' ? 'Excellent' : language === 'de' ? 'Hervorragend' : 'Отлично' };
    if (score >= 75) return { hex: '#0071e3', label: language === 'en' ? 'Good' : language === 'de' ? 'Gut' : 'Хорошо' };
    if (score >= 50) return { hex: '#ff9500', label: language === 'en' ? 'Needs Attention' : language === 'de' ? 'Optimierungsbedarf' : 'Требует внимания' };
    return { hex: '#ff3b30', label: language === 'en' ? 'Critical' : language === 'de' ? 'Kritisch' : 'Критично' };
  };

  const mainColor = getScoreColor(overallScore);

  // Локализованный статус от LLM
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

  // Кольцо прогресса
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  const assessmentTitle =
    language === 'en' ? 'Expert assessment' : language === 'de' ? 'Expertenbewertung' : 'Экспертное заключение';

  return (
    <section className="max-w-4xl mx-auto">
      {/* ---------- URL + переключатель устройства ---------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
        {url && (
          <div className="text-sm font-mono text-[#6e6e73] truncate max-w-md">
            {url}
          </div>
        )}
        {onDeviceChange && (
          <div className="inline-flex p-1 bg-[#f5f5f7] rounded-full shrink-0">
            <button
              type="button"
              onClick={() => onDeviceChange('mobile')}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-apple cursor-pointer flex items-center gap-1.5 ${
                device === 'mobile'
                  ? 'bg-white text-[#1d1d1f] shadow-sm'
                  : 'text-[#6e6e73] hover:text-[#1d1d1f]'
              }`}
            >
              <Smartphone className="w-3 h-3" />
              {language === 'en' ? 'Mobile' : language === 'de' ? 'Mobil' : 'Смартфон'}
            </button>
            <button
              type="button"
              onClick={() => onDeviceChange('desktop')}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-apple cursor-pointer flex items-center gap-1.5 ${
                device === 'desktop'
                  ? 'bg-white text-[#1d1d1f] shadow-sm'
                  : 'text-[#6e6e73] hover:text-[#1d1d1f]'
              }`}
            >
              <Laptop className="w-3 h-3" />
              {language === 'en' ? 'Desktop' : language === 'de' ? 'Desktop' : 'Компьютер'}
            </button>
          </div>
        )}
      </div>

      {/* ---------- Большое кольцо + оценка ---------- */}
      <div className="flex flex-col items-center mb-10">
        <div className="relative w-48 h-48 flex items-center justify-center mb-6">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
            {/* Фон кольца */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              stroke="#f0f0f2"
              strokeWidth="8"
              fill="transparent"
            />
            {/* Прогресс */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              stroke={mainColor.hex}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Цифра внутри */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className="text-6xl font-semibold tracking-tight"
              style={{ color: mainColor.hex }}
            >
              {overallScore}
            </span>
            <span className="text-xs text-[#86868b] mt-1 tracking-wide uppercase">
              / 100
            </span>
          </div>
        </div>

        {/* Статус под кольцом */}
        <div
          className="text-sm font-medium mb-2"
          style={{ color: mainColor.hex }}
        >
          {statusLevel ? getLocalizedStatus(statusLevel) : mainColor.label}
        </div>

        {/* Тип сайта */}
        {detectedSiteType && (
          <div className="text-xs text-[#86868b]">
            {detectedSiteType}
          </div>
        )}
      </div>

      {/* ---------- Саммари ---------- */}
      <div className="max-w-2xl mx-auto text-center mb-12">
        <h2 className="text-xs font-medium uppercase tracking-widest text-[#86868b] mb-3">
          {assessmentTitle}
        </h2>
        <p className="text-base sm:text-lg leading-relaxed text-[#1d1d1f]">
          {summary}
        </p>
      </div>

      {/* ---------- 4 блока по горизонтали ---------- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {pillarCards.map((pillar) => {
          const color = getScoreColor(pillar.score);
          return (
            <button
              key={pillar.id}
              onClick={() => onSelectTab(pillar.id)}
              className="group text-left p-5 bg-white rounded-2xl border border-[#e5e5e7] hover:border-[#d2d2d7] transition-apple cursor-pointer shadow-apple"
            >
              <div className="text-xs text-[#6e6e73] font-medium mb-3">
                {pillar.title}
              </div>
              <div className="flex items-end justify-between">
                <span
                  className="text-3xl font-semibold tracking-tight"
                  style={{ color: color.hex }}
                >
                  {pillar.score}
                  <span className="text-base text-[#86868b] font-normal ml-0.5">%</span>
                </span>
                <ArrowUpRight className="w-4 h-4 text-[#d2d2d7] group-hover:text-[#0071e3] transition-apple" />
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};