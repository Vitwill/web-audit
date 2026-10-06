import React from 'react';
import { AuditResult, DeviceType, Language } from '../types/seo';

interface FourPillarsDetailProps {
  audit: AuditResult;
  activeTab: number;
  setActiveTab: (tab: number) => void;
  device?: DeviceType;
  language?: Language;
}

export const FourPillarsDetail: React.FC<FourPillarsDetailProps> = ({
  audit,
  activeTab,
  setActiveTab,
  device = 'mobile',
  language = 'ru',
}) => {
  const { blocks, scores, pageSpeed, devicePageSpeed } = audit;

  const currentDevicePageSpeed =
    devicePageSpeed && devicePageSpeed[device] ? devicePageSpeed[device] : pageSpeed;

  // Локализация
  const t = {
    sectionTitle:
      language === 'en'
        ? 'Detailed breakdown'
        : language === 'de'
        ? 'Detaillierte Analyse'
        : 'Детальный разбор по 4 направлениям',
    sectionSubtitle:
      language === 'en'
        ? 'In-depth analysis of ranking factors with actionable recommendations'
        : language === 'de'
        ? 'Fundierte Bewertung aller Rankingfaktoren mit konkreten Empfehlungen'
        : 'Глубокий анализ факторов ранжирования с практическими рекомендациями',
    tabTech: language === 'en' ? 'Technical SEO' : language === 'de' ? 'Technisches SEO' : 'Техническое SEO',
    tabVisibility: language === 'en' ? 'Visibility & CTR' : language === 'de' ? 'Sichtbarkeit & CTR' : 'Видимость & CTR',
    tabIntent: language === 'en' ? 'Search Intent' : language === 'de' ? 'Suchintention' : 'Поисковый интент',
    tabContent: language === 'en' ? 'Content & Links' : language === 'de' ? 'Inhalt & Links' : 'Контент & Ссылки',
    findings: language === 'en' ? 'Findings' : language === 'de' ? 'Ergebnisse' : 'Выявленные факты',
    recommendations: language === 'en' ? 'Action plan' : language === 'de' ? 'Maßnahmenplan' : 'План внедрения',
    detectedIntent: language === 'en' ? 'Detected intent' : language === 'de' ? 'Erkannte Suchintention' : 'Определённый интент',
    bounceRisk: language === 'en' ? 'Bounce rate risk' : language === 'de' ? 'Absprungrisiko' : 'Риск отказов',
    keywordDensity: language === 'en' ? 'Keyword density' : language === 'de' ? 'Keyword-Dichte' : 'Плотность ключей',
    internalLinks: language === 'en' ? 'Internal links' : language === 'de' ? 'Interne Links' : 'Внутренние ссылки',
    ctrAnalysis: language === 'en' ? 'CTR analysis' : language === 'de' ? 'CTR-Analyse' : 'Анализ кликабельности',
    detectedKeywords: language === 'en' ? 'Detected keywords' : language === 'de' ? 'Erkannte Keywords' : 'Определённые ключевые маркеры',
    showMore: language === 'en' ? 'Show details' : language === 'de' ? 'Details anzeigen' : 'Смотреть графики',
    status: language === 'en' ? 'Status' : language === 'de' ? 'Status' : 'Статус',
    mobile: language === 'en' ? 'Mobile' : language === 'de' ? 'Mobil' : 'Смартфон',
    desktop: language === 'en' ? 'Desktop' : language === 'de' ? 'Desktop' : 'Компьютер',
  };

  const tabs = [
    { id: 0, title: t.tabTech, score: scores.technical, block: blocks.technical },
    { id: 1, title: t.tabVisibility, score: scores.visibility, block: blocks.visibility },
    { id: 2, title: t.tabIntent, score: scores.intent, block: blocks.intent },
    { id: 3, title: t.tabContent, score: scores.content, block: blocks.contentAndLinks },
  ];

  const getScoreColor = (score: number): string => {
    if (score >= 75) return '#34c759';
    if (score >= 50) return '#ff9500';
    return '#ff3b30';
  };

  const currentTab = tabs[activeTab];
  const currentBlock = currentTab.block;

  return (
    <section className="max-w-4xl mx-auto">
      {/* ---------- Заголовок секции ---------- */}
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1d1d1f] mb-2">
          {t.sectionTitle}
        </h2>
        <p className="text-sm text-[#6e6e73]">{t.sectionSubtitle}</p>
      </div>

      {/* ---------- Табы ---------- */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-6 -mx-1 px-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const color = getScoreColor(tab.score);
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-apple cursor-pointer ${
                isActive
                  ? 'bg-[#1d1d1f] text-white'
                  : 'bg-[#f5f5f7] text-[#1d1d1f]/70 hover:text-[#1d1d1f]'
              }`}
            >
              <span>{tab.title}</span>
              <span
                className="text-xs font-semibold"
                style={{ color: isActive ? 'rgba(255,255,255,0.85)' : color }}
              >
                {tab.score}%
              </span>
            </button>
          );
        })}
      </div>

      {/* ---------- Содержимое активного таба ---------- */}
      <div className="space-y-4">
        {/* Специфичные для таба метаданные */}
        {activeTab === 0 && currentDevicePageSpeed && (
          <div className="p-5 bg-[#f5f5f7] rounded-2xl">
            <div className="text-xs font-medium uppercase tracking-widest text-[#86868b] mb-2">
              PageSpeed ({device === 'mobile' ? t.mobile : t.desktop})
            </div>
            <p className="text-sm text-[#1d1d1f] leading-relaxed">
              TTFB: <strong>{currentDevicePageSpeed.ttfb.formatted}</strong> · FCP:{' '}
              <strong>{currentDevicePageSpeed.fcp.formatted}</strong> · LCP:{' '}
              <strong>{currentDevicePageSpeed.lcp.formatted}</strong> · CLS:{' '}
              <strong>{currentDevicePageSpeed.cls.formatted}</strong>
            </p>
            <button
              onClick={() => {
                const el = document.getElementById('pagespeed-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="mt-3 text-xs font-medium text-[#0071e3] hover:text-[#0077ed] transition-apple cursor-pointer"
            >
              {t.showMore} →
            </button>
          </div>
        )}

        {activeTab === 1 && blocks.visibility.detectedKeywords && blocks.visibility.detectedKeywords.length > 0 && (
          <div className="p-5 bg-white rounded-2xl border border-[#e5e5e7] shadow-apple">
            <div className="text-xs font-medium uppercase tracking-widest text-[#86868b] mb-3">
              {t.detectedKeywords}
            </div>
            <div className="flex flex-wrap gap-2">
              {blocks.visibility.detectedKeywords.map((kw, i) => (
                <span
                  key={i}
                  className="text-xs font-mono px-2.5 py-1 rounded-md bg-[#f5f5f7] text-[#1d1d1f]"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>
        )}

        {activeTab === 1 && blocks.visibility.ctrAnalysis && (
          <div className="p-5 bg-white rounded-2xl border border-[#e5e5e7] shadow-apple">
            <div className="text-xs font-medium uppercase tracking-widest text-[#86868b] mb-2">
              {t.ctrAnalysis}
            </div>
            <p className="text-sm text-[#1d1d1f] leading-relaxed">{blocks.visibility.ctrAnalysis}</p>
          </div>
        )}

        {activeTab === 2 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 bg-white rounded-2xl border border-[#e5e5e7] shadow-apple">
              <div className="text-xs font-medium uppercase tracking-widest text-[#86868b] mb-2">
                {t.detectedIntent}
              </div>
              <p className="text-sm font-medium text-[#1d1d1f]">
                {blocks.intent.identifiedIntent}
              </p>
            </div>
            <div className="p-5 bg-white rounded-2xl border border-[#e5e5e7] shadow-apple">
              <div className="text-xs font-medium uppercase tracking-widest text-[#86868b] mb-2">
                {t.bounceRisk}
              </div>
              <p className="text-sm font-medium text-[#1d1d1f]">
                {blocks.intent.bounceRateRisk}
              </p>
            </div>
          </div>
        )}

        {activeTab === 3 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {blocks.contentAndLinks.keywordStuffingRisk && (
              <div className="p-5 bg-white rounded-2xl border border-[#e5e5e7] shadow-apple">
                <div className="text-xs font-medium uppercase tracking-widest text-[#86868b] mb-2">
                  {t.keywordDensity}
                </div>
                <p className="text-sm font-medium text-[#1d1d1f]">
                  {blocks.contentAndLinks.keywordStuffingRisk}
                </p>
              </div>
            )}
            {blocks.contentAndLinks.internalLinkingStatus && (
              <div className="p-5 bg-white rounded-2xl border border-[#e5e5e7] shadow-apple">
                <div className="text-xs font-medium uppercase tracking-widest text-[#86868b] mb-2">
                  {t.internalLinks}
                </div>
                <p className="text-sm font-medium text-[#1d1d1f]">
                  {blocks.contentAndLinks.internalLinkingStatus}
                </p>
              </div>
            )}
          </div>
        )}

        {/* ---------- Findings + Recommendations ---------- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Findings */}
          <div className="p-6 bg-white rounded-3xl border border-[#e5e5e7] shadow-apple">
            <h4 className="text-xs font-medium uppercase tracking-widest text-[#86868b] mb-4">
              {t.findings}
            </h4>
            <ul className="space-y-3">
              {currentBlock.findings.map((finding, idx) => (
                <li
                  key={idx}
                  className="text-sm text-[#1d1d1f] leading-relaxed flex items-start gap-3"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d2d2d7] shrink-0 mt-2" />
                  <span>{finding}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recommendations */}
          <div className="p-6 bg-white rounded-3xl border border-[#e5e5e7] shadow-apple">
            <h4 className="text-xs font-medium uppercase tracking-widest text-[#86868b] mb-4">
              {t.recommendations}
            </h4>
            <ul className="space-y-3">
              {currentBlock.recommendations.map((rec, idx) => (
                <li
                  key={idx}
                  className="text-sm text-[#1d1d1f] leading-relaxed flex items-start gap-3"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0071e3] shrink-0 mt-2" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};