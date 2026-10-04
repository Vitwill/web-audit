import React from 'react';
import { AuditResult, DeviceType, Language } from '../types/seo';
import { TRANSLATIONS } from '../data/translations';
import {
  ShieldCheck,
  ShieldAlert,
  Cpu,
  Eye,
  Users,
  FileSpreadsheet,
  ArrowUpRight,
  Zap,
  Globe2,
  Smartphone,
  Laptop,
} from 'lucide-react';

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
  const t = TRANSLATIONS[language];
  const { overallScore, statusLevel, summary, scores, detectedSiteType, devicePageSpeed, pageSpeed } = audit;

  const currentDevicePageSpeed =
    devicePageSpeed && devicePageSpeed[device]
      ? devicePageSpeed[device]
      : pageSpeed;

  const getScoreColor = (score: number) => {
    if (score >= 90) {
      return {
        text: 'text-emerald-700',
        stroke: '#059669',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
      };
    }
    if (score >= 75) {
      return {
        text: 'text-teal-700',
        stroke: '#0d9488',
        bg: 'bg-teal-50',
        border: 'border-teal-200',
      };
    }
    if (score >= 50) {
      return {
        text: 'text-amber-700',
        stroke: '#d97706',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
      };
    }
    return {
      text: 'text-rose-700',
      stroke: '#e11d48',
      bg: 'bg-rose-50',
      border: 'border-rose-200',
    };
  };

  const mainColor = getScoreColor(overallScore);
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  const getLocalizedStatus = (status: string) => {
    const s = (status || '').toLowerCase();
    if (s.includes('отлич') || s.includes('excel') || s.includes('hervor')) return t.scoreHero.excellent;
    if (s.includes('хорош') || s.includes('good') || s.includes('gut')) return t.scoreHero.good;
    if (s.includes('вниман') || s.includes('доработ') || s.includes('warn') || s.includes('need') || s.includes('optimier')) return t.scoreHero.warning;
    if (s.includes('критич') || s.includes('crit')) return t.scoreHero.critical;
    return status;
  };

  const pillarCards = [
    {
      id: 0,
      title: t.scoreHero.pillarTech,
      score: scores.technical,
      desc: t.scoreHero.pillarTechDesc,
      icon: Cpu,
    },
    {
      id: 1,
      title: t.scoreHero.pillarVisibility,
      score: scores.visibility,
      desc: t.scoreHero.pillarVisibilityDesc,
      icon: Eye,
    },
    {
      id: 2,
      title: t.scoreHero.pillarIntent,
      score: scores.intent,
      desc: t.scoreHero.pillarIntentDesc,
      icon: Users,
    },
    {
      id: 3,
      title: t.scoreHero.pillarContent,
      score: scores.content,
      desc: t.scoreHero.pillarContentDesc,
      icon: FileSpreadsheet,
    },
  ];

  return (
    <div className="bg-white border border-[#ded7cb] rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
          {/* Circular Gauge */}
          <div className="flex flex-col items-center flex-shrink-0">
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="12"
                  className="text-[#f0ece3]"
                  fill="transparent"
                />
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke={mainColor.stroke}
                  strokeWidth="12"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className={`text-5xl font-black tracking-tight ${mainColor.text}`}>
                  {overallScore}
                </span>
                <span className="text-xs uppercase tracking-wider font-bold text-stone-400 mt-0.5">
                  / 100
                </span>
              </div>
            </div>

            <div className="mt-3 flex flex-col items-center gap-2">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${mainColor.bg} ${mainColor.text} ${mainColor.border} border shadow-2xs`}
              >
                {overallScore >= 75 ? (
                  <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                ) : (
                  <ShieldAlert className="w-3.5 h-3.5 mr-1 text-rose-600" />
                )}
                {statusLevel ? getLocalizedStatus(statusLevel) : t.scoreHero.good}
              </span>

              {detectedSiteType && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#f3efe6] text-stone-700 border border-[#ded7cb]">
                  <Globe2 className="w-3 h-3 text-stone-500" />
                  {detectedSiteType}
                </span>
              )}
            </div>
          </div>

          {/* Overall Information & Executive Summary */}
          <div className="flex-1 w-full text-center lg:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#ece7de] pb-4 mb-4">
              <div>
                <span className="text-xs font-bold tracking-wider text-emerald-700 uppercase">
                  {t.hero.badge}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-stone-900 mt-0.5">
                  {t.toolbar.overallScore} {overallScore}/100
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Device selector in score header */}
                {onDeviceChange && (
                  <div className="flex items-center space-x-1 p-1 bg-[#f3efe6] rounded-xl border border-[#ded7cb]">
                    <button
                      type="button"
                      onClick={() => onDeviceChange('mobile')}
                      className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                        device === 'mobile'
                          ? 'bg-white text-stone-900 shadow-2xs border border-[#ded7cb]'
                          : 'text-stone-500 hover:text-stone-800'
                      }`}
                    >
                      <Smartphone className="w-3 h-3 text-indigo-600" />
                      <span>Mobile</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeviceChange('desktop')}
                      className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                        device === 'desktop'
                          ? 'bg-white text-stone-900 shadow-2xs border border-[#ded7cb]'
                          : 'text-stone-500 hover:text-stone-800'
                      }`}
                    >
                      <Laptop className="w-3 h-3 text-indigo-600" />
                      <span>Desktop</span>
                    </button>
                  </div>
                )}

                {currentDevicePageSpeed && (
                  <div className="flex items-center gap-1.5 text-xs bg-[#faf8f5] px-2.5 py-1.5 rounded-lg border border-[#ded7cb] text-stone-700 font-medium">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-stone-500">
                      PageSpeed ({device === 'mobile' ? 'Mobile' : 'Desktop'}):
                    </span>
                    <span className="font-bold text-stone-900">
                      {currentDevicePageSpeed.performanceScore}
                    </span>
                  </div>
                )}

                {url && (
                  <div className="text-xs text-stone-600 bg-[#faf8f5] px-3 py-1.5 rounded-lg border border-[#ded7cb] max-w-xs truncate font-mono">
                    {url}
                  </div>
                )}
              </div>
            </div>

            <div className="text-sm text-stone-700 leading-relaxed mb-6 bg-[#faf8f5] p-4 rounded-xl border border-[#e5dfd5]">
              <strong className="text-stone-900 font-bold block mb-1">
                {t.scoreHero.assessmentTitle} ({device === 'mobile' ? t.inputPanel.mobile : t.inputPanel.desktop}):
              </strong>
              {summary}
            </div>

            {/* 4 Pillars Breakdown Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {pillarCards.map((pillar) => {
                const color = getScoreColor(pillar.score);
                const Icon = pillar.icon;
                return (
                  <button
                    key={pillar.id}
                    onClick={() => onSelectTab(pillar.id)}
                    className="text-left bg-[#faf8f5] hover:bg-[#f3efe6] transition p-3.5 rounded-xl border border-[#e5dfd5] hover:border-[#d5cec2] group cursor-pointer shadow-2xs"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-7 h-7 rounded-lg bg-white border border-[#ded7cb] flex items-center justify-center text-stone-600 group-hover:text-stone-900 transition">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className={`text-base font-black ${color.text}`}>
                        {pillar.score}%
                      </span>
                    </div>

                    <div className="font-bold text-xs text-stone-800 group-hover:text-stone-950 flex items-center justify-between">
                      <span className="truncate">{pillar.title}</span>
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition text-stone-400" />
                    </div>

                    <div className="w-full bg-[#e5dfd5] h-1.5 rounded-full overflow-hidden mt-2">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${pillar.score}%`,
                          backgroundColor: color.stroke,
                        }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
