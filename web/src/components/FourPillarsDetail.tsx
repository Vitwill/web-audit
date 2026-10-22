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

  const t = {
    sectionTitle: language === 'en' ? 'Detailed breakdown' : language === 'de' ? 'Detaillierte Analyse' : 'Детальный разбор по 4 направлениям',
    sectionSubtitle: language === 'en' ? 'In-depth analysis of ranking factors with actionable recommendations' : language === 'de' ? 'Fundierte Bewertung aller Rankingfaktoren mit konkreten Empfehlungen' : 'Глубокий анализ факторов ранжирования с практическими рекомендациями',
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
    if (score >= 75) return '#1e5c2a';
    if (score >= 50) return '#C1440E';
    return '#8b1f29';
  };

  const currentTab = tabs[activeTab];
  const currentBlock = currentTab.block;

  return (
    <section className="max-w-4xl mx-auto">
      {/* ---------- Заголовок секции ---------- */}
      <div className="mb-10 pb-4 border-b border-[rgba(14,14,14,0.14)]">
        <h2 className="font-display text-2xl sm:text-3xl font-medium tracking-[-0.03em] text-[#0E0E0E] mb-2">
          {t.sectionTitle}
        </h2>
        <p className="font-mono text-[11px] tracking-[0.1em] uppercase text-[rgba(14,14,14,0.45)]">{t.sectionSubtitle}</p>
      </div>

      {/* ---------- Табы ---------- */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-8 -mx-1 px-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const color = getScoreColor(tab.score);
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-sm font-mono text-[11px] tracking-[0.1em] uppercase transition-colors cursor-pointer border ${
                isActive
                  ? 'bg-[#0E0E0E] text-[#F5F2EC] border-[#0E0E0E]'
                  : 'bg-transparent text-[rgba(14,14,14,0.68)] border-[rgba(14,14,14,0.22)] hover:border-[#0E0E0E] hover:text-[#0E0E0E]'
              }`}
            >
              <span>{tab.title}</span>
              <span
                className="text-[10px] font-bold"
                style={{ color: isActive ? 'rgba(245,242,236,0.85)' : color }}
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
          <div className="p-6 bg-[#EFEBE3] rounded-sm border border-[rgba(14,14,14,0.14)]">
            <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-[rgba(14,14,14,0.45)] mb-3">
              PageSpeed ({device === 'mobile' ? t.mobile : t.desktop})
            </div>
            <p className="font-mono text-[13px] text-[#0E0E0E] leading-relaxed">
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
              className="mt-4 font-mono text-[11px] tracking-[0.1em] uppercase text-[#C1440E] hover:text-[#0E0E0E] transition-colors cursor-pointer"
            >
              {t.showMore} →
            </button>
          </div>
        )}

        {activeTab === 1 && blocks.visibility.detectedKeywords && blocks.visibility.detectedKeywords.length > 0 && (
          <div className="p-6 bg-[#EFEBE3] rounded-sm border border-[rgba(14,14,14,0.14)]">
            <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-[rgba(14,14,14,0.45)] mb-4">
              {t.detectedKeywords}
            </div>
            <div className="flex flex-wrap gap-2">
              {blocks.visibility.detectedKeywords.map((kw, i) => (
                <span
                  key={i}
                  className="font-mono text-[11px] px-3 py-1.5 rounded-sm bg-[#F5F2EC] border border-[rgba(14,14,14,0.14)] text-[#0E0E0E]"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>
        )}

        {activeTab === 1 && blocks.visibility.ctrAnalysis && (
          <div className="p-6 bg-[#EFEBE3] rounded-sm border border-[rgba(14,14,14,0.14)]">
            <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-[rgba(14,14,14,0.45)] mb-3">
              {t.ctrAnalysis}
            </div>
            <p className="text-[14px] text-[rgba(14,14,14,0.68)] leading-relaxed">{blocks.visibility.ctrAnalysis}</p>
          </div>
        )}

        {activeTab === 2 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-6 bg-[#EFEBE3] rounded-sm border border-[rgba(14,14,14,0.14)]">
              <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-[rgba(14,14,14,0.45)] mb-3">
                {t.detectedIntent}
              </div>
              <p className="text-[15px] font-medium text-[#0E0E0E]">
                {blocks.intent.identifiedIntent}
              </p>
            </div>
            <div className="p-6 bg-[#EFEBE3] rounded-sm border border-[rgba(14,14,14,0.14)]">
              <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-[rgba(14,14,14,0.45)] mb-3">
                {t.bounceRisk}
              </div>
              <p className="text-[15px] font-medium text-[#0E0E0E]">
                {blocks.intent.bounceRateRisk}
              </p>
            </div>
          </div>
        )}

        {activeTab === 3 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {blocks.contentAndLinks.keywordStuffingRisk && (
              <div className="p-6 bg-[#EFEBE3] rounded-sm border border-[rgba(14,14,14,0.14)]">
                <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-[rgba(14,14,14,0.45)] mb-3">
                  {t.keywordDensity}
                </div>
                <p className="text-[15px] font-medium text-[#0E0E0E]">
                  {blocks.contentAndLinks.keywordStuffingRisk}
                </p>
              </div>
            )}
            {blocks.contentAndLinks.internalLinkingStatus && (
              <div className="p-6 bg-[#EFEBE3] rounded-sm border border-[rgba(14,14,14,0.14)]">
                <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-[rgba(14,14,14,0.45)] mb-3">
                  {t.internalLinks}
                </div>
                <p className="text-[15px] font-medium text-[#0E0E0E]">
                  {blocks.contentAndLinks.internalLinkingStatus}
                </p>
              </div>
            )}
          </div>
        )}

        {/* ---------- Findings + Recommendations ---------- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Findings */}
          <div className="p-6 bg-[#EFEBE3] rounded-sm border border-[rgba(14,14,14,0.14)]">
            <h4 className="font-mono text-[10px] tracking-[0.16em] uppercase text-[rgba(14,14,14,0.45)] mb-5">
              {t.findings}
            </h4>
            <ul className="space-y-4">
              {currentBlock.findings.map((finding, idx) => (
                <li
                  key={idx}
                  className="text-[14px] text-[#0E0E0E] leading-relaxed flex items-start gap-3"
                >
                  <span className="w-2 h-[1px] bg-[rgba(14,14,14,0.45)] shrink-0 mt-2.5" />
                  <span>{finding}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recommendations */}
          <div className="p-6 bg-[#EFEBE3] rounded-sm border border-[rgba(14,14,14,0.14)]">
            <h4 className="font-mono text-[10px] tracking-[0.16em] uppercase text-[rgba(14,14,14,0.45)] mb-5">
              {t.recommendations}
            </h4>
            <ul className="space-y-4">
              {currentBlock.recommendations.map((rec, idx) => (
                <li
                  key={idx}
                  className="text-[14px] text-[#0E0E0E] leading-relaxed flex items-start gap-3"
                >
                  <span className="w-2 h-[1px] bg-[#C1440E] shrink-0 mt-2.5" />
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
