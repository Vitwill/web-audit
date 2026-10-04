import React from 'react';
import { AuditResult, DeviceType, Language } from '../types/seo';
import { TRANSLATIONS } from '../data/translations';
import {
  Cpu,
  Eye,
  Users,
  FileSpreadsheet,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Smartphone,
  Laptop,
} from 'lucide-react';

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
  const t = TRANSLATIONS[language];
  const { blocks, scores, pageSpeed, devicePageSpeed } = audit;

  const currentDevicePageSpeed =
    devicePageSpeed && devicePageSpeed[device]
      ? devicePageSpeed[device]
      : pageSpeed;

  const tabs = [
    {
      id: 0,
      title: t.fourPillars.tabTech,
      shortTitle: t.scoreHero.pillarTech,
      score: scores.technical,
      icon: Cpu,
    },
    {
      id: 1,
      title: t.fourPillars.tabVisibility,
      shortTitle: t.scoreHero.pillarVisibility,
      score: scores.visibility,
      icon: Eye,
    },
    {
      id: 2,
      title: t.fourPillars.tabIntent,
      shortTitle: t.scoreHero.pillarIntent,
      score: scores.intent,
      icon: Users,
    },
    {
      id: 3,
      title: t.fourPillars.tabContent,
      shortTitle: t.scoreHero.pillarContent,
      score: scores.content,
      icon: FileSpreadsheet,
    },
  ];

  const getScoreBadge = (score: number) => {
    if (score >= 75) {
      return {
        text: language === 'en' ? 'Normal' : language === 'de' ? 'Gut' : 'Норма',
        color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      };
    }
    if (score >= 50) {
      return {
        text: language === 'en' ? 'Needs Attention' : language === 'de' ? 'Optimierungsbedarf' : 'Требует внимания',
        color: 'bg-amber-100 text-amber-800 border-amber-200',
      };
    }
    return {
      text: language === 'en' ? 'Critical' : language === 'de' ? 'Kritisch' : 'Критично',
      color: 'bg-rose-100 text-rose-800 border-rose-200',
    };
  };

  const getLocalizedBlockStatus = (status: string) => {
    const s = (status || '').toLowerCase();
    if (s.includes('норм') || s.includes('good') || s.includes('gut') || s.includes('norm') || s.includes('оптим')) {
      return language === 'en' ? 'Normal' : language === 'de' ? 'Gut' : 'Норма';
    }
    if (s.includes('вниман') || s.includes('need') || s.includes('optimier') || s.includes('улучш')) {
      return language === 'en' ? 'Needs Attention' : language === 'de' ? 'Optimierungsbedarf' : 'Требует внимания';
    }
    if (s.includes('критич') || s.includes('crit') || s.includes('плохо') || s.includes('poor')) {
      return language === 'en' ? 'Critical' : language === 'de' ? 'Kritisch' : 'Критично';
    }
    return status;
  };

  return (
    <div className="bg-white border border-[#ded7cb] rounded-2xl p-6 sm:p-7 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 border-b border-[#ece7de] pb-4">
        <div>
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
            {t.fourPillars.title}
          </span>
          <h3 className="text-xl font-black text-stone-900 mt-0.5">
            {t.fourPillars.subtitle}
          </h3>
        </div>

        <div className="flex items-center space-x-1.5 text-xs text-stone-500 font-medium bg-[#faf8f5] px-3 py-1.5 rounded-lg border border-[#ded7cb]">
          {device === 'mobile' ? (
            <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
          ) : (
            <Laptop className="w-3.5 h-3.5 text-indigo-600" />
          )}
          <span>{device === 'mobile' ? t.inputPanel.mobile : t.inputPanel.desktop}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const badge = getScoreBadge(tab.score);
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 flex items-center space-x-2.5 px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-bold transition cursor-pointer ${
                isActive
                  ? 'bg-[#2d2822] border-[#2d2822] text-white shadow-sm'
                  : 'bg-[#faf8f5] border-[#e5dfd5] text-stone-600 hover:text-stone-900 hover:bg-[#f3efe6]'
              }`}
            >
              <Icon
                className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-stone-500'}`}
              />
              <span>{tab.shortTitle}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${
                  isActive ? 'bg-stone-800 text-emerald-300 border-stone-700' : badge.color
                }`}
              >
                {tab.score}%
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab 0: Technical SEO */}
      {activeTab === 0 && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#faf8f5] p-4 rounded-xl border border-[#e5dfd5]">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                {language === 'en' ? 'Pillar 1 / 4' : language === 'de' ? 'Bereich 1 / 4' : 'Блок 1 / 4'}
              </span>
              <h4 className="text-base font-black text-stone-900">
                {t.fourPillars.tabTech}
              </h4>
              <p className="text-xs text-stone-500 mt-0.5 font-medium">
                {t.fourPillars.techSubtitle}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-stone-500 font-medium">
                {t.fourPillars.statusLabel}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                {getLocalizedBlockStatus(blocks.technical.status)}
              </span>
            </div>
          </div>

          {currentDevicePageSpeed && (
            <div className="p-4 rounded-xl bg-[#faf8f5] border border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 block">
                  {t.pagespeed.title} ({device === 'mobile' ? 'Mobile' : 'Desktop'})
                </span>
                <p className="text-xs text-stone-600 mt-0.5">
                  TTFB: <strong className="text-stone-900">{currentDevicePageSpeed.ttfb.formatted}</strong> • FCP: <strong className="text-stone-900">{currentDevicePageSpeed.fcp.formatted}</strong> • LCP: <strong className="text-stone-900">{currentDevicePageSpeed.lcp.formatted}</strong> • CLS: <strong className="text-stone-900">{currentDevicePageSpeed.cls.formatted}</strong>
                </p>
              </div>
              <button
                onClick={() => {
                  const el = document.getElementById('pagespeed-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white hover:bg-stone-50 text-indigo-800 border border-indigo-300 transition cursor-pointer shadow-2xs self-start sm:self-auto"
              >
                <span>{t.fourPillars.viewDetails} →</span>
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Findings */}
            <div className="bg-[#faf8f5] border border-[#e5dfd5] rounded-xl p-4">
              <h5 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-3 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{t.fourPillars.findings}</span>
              </h5>
              <ul className="space-y-2.5">
                {blocks.technical.findings.map((finding, idx) => (
                  <li key={idx} className="text-xs sm:text-sm text-stone-700 flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-400 mt-2 flex-shrink-0" />
                    <span>{finding}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommendations */}
            <div className="bg-[#faf8f5] border border-[#e5dfd5] rounded-xl p-4">
              <h5 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-3 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>{t.fourPillars.recommendations}</span>
              </h5>
              <ul className="space-y-2.5">
                {blocks.technical.recommendations.map((rec, idx) => (
                  <li key={idx} className="text-xs sm:text-sm text-stone-800 font-medium flex items-start space-x-2">
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 1: Visibility & CTR */}
      {activeTab === 1 && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#faf8f5] p-4 rounded-xl border border-[#e5dfd5]">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                {language === 'en' ? 'Pillar 2 / 4' : language === 'de' ? 'Bereich 2 / 4' : 'Блок 2 / 4'}
              </span>
              <h4 className="text-base font-black text-stone-900">
                {t.fourPillars.tabVisibility}
              </h4>
              <p className="text-xs text-stone-500 mt-0.5 font-medium">
                {t.beforeAfter.subtitle}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-stone-500 font-medium">
                {t.fourPillars.statusLabel}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800 border border-teal-200">
                {getLocalizedBlockStatus(blocks.visibility.status)}
              </span>
            </div>
          </div>

          {/* Target keywords badge */}
          {blocks.visibility.detectedKeywords && blocks.visibility.detectedKeywords.length > 0 && (
            <div className="bg-[#faf8f5] border border-[#e5dfd5] p-3.5 rounded-xl">
              <span className="text-xs font-bold text-stone-600 block mb-2">
                {t.fourPillars.keywordsFound}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {blocks.visibility.detectedKeywords.map((kw, i) => (
                  <span
                    key={i}
                    className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-white border border-[#ded7cb] text-stone-800 shadow-2xs"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* CTR Analysis */}
          {blocks.visibility.ctrAnalysis && (
            <div className="bg-[#faf8f5] border border-teal-200 p-4 rounded-xl text-xs sm:text-sm text-stone-700 leading-relaxed font-medium">
              <strong className="text-teal-900 block mb-1">
                {t.fourPillars.ctrPotential}
              </strong>
              {blocks.visibility.ctrAnalysis}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#faf8f5] border border-[#e5dfd5] rounded-xl p-4">
              <h5 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-3 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{t.fourPillars.findings}</span>
              </h5>
              <ul className="space-y-2.5">
                {blocks.visibility.findings.map((finding, idx) => (
                  <li key={idx} className="text-xs sm:text-sm text-stone-700 flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-400 mt-2 flex-shrink-0" />
                    <span>{finding}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#faf8f5] border border-[#e5dfd5] rounded-xl p-4">
              <h5 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-3 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>{t.fourPillars.recommendations}</span>
              </h5>
              <ul className="space-y-2.5">
                {blocks.visibility.recommendations.map((rec, idx) => (
                  <li key={idx} className="text-xs sm:text-sm text-stone-800 font-medium flex items-start space-x-2">
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Intent & Behavior */}
      {activeTab === 2 && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#faf8f5] p-4 rounded-xl border border-[#e5dfd5]">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                {language === 'en' ? 'Pillar 3 / 4' : language === 'de' ? 'Bereich 3 / 4' : 'Блок 3 / 4'}
              </span>
              <h4 className="text-base font-black text-stone-900">
                {t.fourPillars.tabIntent}
              </h4>
              <p className="text-xs text-stone-500 mt-0.5 font-medium">
                {t.scoreHero.pillarIntent}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-stone-500 font-medium">
                {t.fourPillars.statusLabel}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                {getLocalizedBlockStatus(blocks.intent.status)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-[#faf8f5] border border-[#e5dfd5] p-3.5 rounded-xl">
              <span className="text-xs font-bold text-stone-500 block mb-1">
                {t.fourPillars.intentIdentified}
              </span>
              <span className="text-sm font-bold text-stone-900">
                {blocks.intent.identifiedIntent}
              </span>
            </div>
            <div className="bg-[#faf8f5] border border-[#e5dfd5] p-3.5 rounded-xl">
              <span className="text-xs font-bold text-stone-500 block mb-1">
                {t.fourPillars.bounceRisk}
              </span>
              <span className="text-sm font-bold text-stone-900">
                {blocks.intent.bounceRateRisk}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#faf8f5] border border-[#e5dfd5] rounded-xl p-4">
              <h5 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-3 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{t.fourPillars.findings}</span>
              </h5>
              <ul className="space-y-2.5">
                {blocks.intent.findings.map((finding, idx) => (
                  <li key={idx} className="text-xs sm:text-sm text-stone-700 flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-400 mt-2 flex-shrink-0" />
                    <span>{finding}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#faf8f5] border border-[#e5dfd5] rounded-xl p-4">
              <h5 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-3 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>{t.fourPillars.recommendations}</span>
              </h5>
              <ul className="space-y-2.5">
                {blocks.intent.recommendations.map((rec, idx) => (
                  <li key={idx} className="text-xs sm:text-sm text-stone-800 font-medium flex items-start space-x-2">
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Content & Links */}
      {activeTab === 3 && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#faf8f5] p-4 rounded-xl border border-[#e5dfd5]">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                {language === 'en' ? 'Pillar 4 / 4' : language === 'de' ? 'Bereich 4 / 4' : 'Блок 4 / 4'}
              </span>
              <h4 className="text-base font-black text-stone-900">
                {t.fourPillars.tabContent}
              </h4>
              <p className="text-xs text-stone-500 mt-0.5 font-medium">
                {t.scoreHero.pillarContent}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-stone-500 font-medium">
                {t.fourPillars.statusLabel}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                {getLocalizedBlockStatus(blocks.contentAndLinks.status)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {blocks.contentAndLinks.keywordStuffingRisk && (
              <div className="bg-[#faf8f5] border border-[#e5dfd5] p-3.5 rounded-xl">
                <span className="text-xs font-bold text-stone-500 block mb-1">
                  {t.fourPillars.keywordDensity}
                </span>
                <span className="text-sm font-bold text-stone-900">
                  {blocks.contentAndLinks.keywordStuffingRisk}
                </span>
              </div>
            )}
            {blocks.contentAndLinks.internalLinkingStatus && (
              <div className="bg-[#faf8f5] border border-[#e5dfd5] p-3.5 rounded-xl">
                <span className="text-xs font-bold text-stone-500 block mb-1">
                  {t.fourPillars.internalLinks}
                </span>
                <span className="text-sm font-bold text-stone-900">
                  {blocks.contentAndLinks.internalLinkingStatus}
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#faf8f5] border border-[#e5dfd5] rounded-xl p-4">
              <h5 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-3 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{t.fourPillars.findings}</span>
              </h5>
              <ul className="space-y-2.5">
                {blocks.contentAndLinks.findings.map((finding, idx) => (
                  <li key={idx} className="text-xs sm:text-sm text-stone-700 flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-400 mt-2 flex-shrink-0" />
                    <span>{finding}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#faf8f5] border border-[#e5dfd5] rounded-xl p-4">
              <h5 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-3 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>{t.fourPillars.recommendations}</span>
              </h5>
              <ul className="space-y-2.5">
                {blocks.contentAndLinks.recommendations.map((rec, idx) => (
                  <li key={idx} className="text-xs sm:text-sm text-stone-800 font-medium flex items-start space-x-2">
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
