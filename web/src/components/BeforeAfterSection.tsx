import React, { useState } from 'react';
import { BeforeAfterItem, SerpPreview, DeviceType, Language } from '../types/seo';
import { TRANSLATIONS } from '../data/translations';
import { Copy, Check, ArrowRight, Laptop, Smartphone, Eye, Sparkles, Globe } from 'lucide-react';

interface BeforeAfterSectionProps {
  items: BeforeAfterItem[];
  serpPreview: SerpPreview;
  device?: DeviceType;
  onDeviceChange?: (device: DeviceType) => void;
  language?: Language;
}

export const BeforeAfterSection: React.FC<BeforeAfterSectionProps> = ({
  items,
  serpPreview,
  device = 'mobile',
  onDeviceChange,
  language = 'ru',
}) => {
  const t = TRANSLATIONS[language];
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [serpState, setSerpState] = useState<'after' | 'before'>('after');

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getRecommendedLength = (element: string) => {
    const el = element.toLowerCase();
    if (el.includes('title')) return language === 'en' ? '50–60 chars' : language === 'de' ? '50–60 Zeichen' : '50–60 символов';
    if (el.includes('desc')) return language === 'en' ? '140–160 chars' : language === 'de' ? '140–160 Zeichen' : '140–160 символов';
    if (el.includes('h1')) return language === 'en' ? '30–70 chars' : language === 'de' ? '30–70 Zeichen' : '30–70 символов';
    return null;
  };

  const isMobile = device === 'mobile';

  return (
    <div className="bg-white border border-[#ded7cb] rounded-2xl p-6 sm:p-7 shadow-xs space-y-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#ece7de] pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-stone-900 flex items-center gap-2">
              {t.beforeAfter.title}
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800 border border-teal-200">
                {t.beforeAfter.solutionsBadge}
              </span>
            </h3>
            <p className="text-xs text-stone-500 font-medium">
              {t.beforeAfter.subtitle}
            </p>
          </div>
        </div>

        {/* Mobile / Desktop switcher for SERP */}
        {onDeviceChange && (
          <div className="flex items-center space-x-1 p-1 bg-[#f3efe6] rounded-xl border border-[#ded7cb]">
            <button
              type="button"
              onClick={() => onDeviceChange('mobile')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                isMobile
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
                !isMobile
                  ? 'bg-white text-stone-900 shadow-2xs border border-[#ded7cb]'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Laptop className="w-3.5 h-3.5 text-indigo-600" />
              <span>{t.inputPanel.desktop}</span>
            </button>
          </div>
        )}
      </div>

      {/* Before / After Cards Grid */}
      <div className="grid grid-cols-1 gap-5">
        {items.map((item, idx) => {
          const recLength = getRecommendedLength(item.element);
          const isCopied = copiedIndex === idx;

          return (
            <div
              key={idx}
              className="bg-[#faf8f5] border border-[#e5dfd5] rounded-xl p-5 hover:border-[#d5cec2] transition shadow-2xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#ece7de] pb-3 mb-4">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#2d2822] text-white">
                    {item.element}
                  </span>
                  {recLength && (
                    <span className="text-[11px] text-stone-500 font-medium">
                      {language === 'en' ? 'Target: ' : language === 'de' ? 'Ziel: ' : 'Оптимально: '}{recLength}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => copyToClipboard(item.after, idx)}
                  className="inline-flex items-center space-x-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-white border border-[#ded7cb] text-stone-700 hover:text-stone-950 transition cursor-pointer self-start sm:self-auto"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">{t.beforeAfter.copied}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-stone-400" />
                      <span>{t.beforeAfter.copy}</span>
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Before Box */}
                <div className="p-4 rounded-xl bg-white border border-rose-200/80 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-rose-800">
                    <span>{t.beforeAfter.before}</span>
                    {item.beforeCharCount !== undefined && (
                      <span className="text-[11px] text-rose-600 font-mono font-medium">
                        {item.beforeCharCount} {language === 'en' ? 'chars' : language === 'de' ? 'Zeichen' : 'симв.'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-stone-700 font-medium leading-relaxed break-words line-through decoration-rose-300">
                    {item.before || (language === 'en' ? 'Not specified' : language === 'de' ? 'Nicht definiert' : 'Не задан')}
                  </p>
                </div>

                {/* After Box */}
                <div className="p-4 rounded-xl bg-white border border-emerald-300 space-y-2 shadow-2xs">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-800">
                    <span>{t.beforeAfter.after}</span>
                    {item.afterCharCount !== undefined && (
                      <span className="text-[11px] text-emerald-700 font-mono font-bold">
                        {item.afterCharCount} {language === 'en' ? 'chars' : language === 'de' ? 'Zeichen' : 'симв.'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-stone-900 font-bold leading-relaxed break-words">
                    {item.after}
                  </p>
                </div>
              </div>

              {/* Rationale explanation */}
              {item.reason && (
                <div className="mt-4 pt-3 border-t border-[#ece7de] flex items-start space-x-2 text-xs text-stone-600 leading-relaxed font-medium">
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong className="text-stone-800 mr-1">{t.beforeAfter.reason}</strong>
                    {item.reason}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Visual Live SERP Simulation Box */}
      {serpPreview && (
        <div className="p-5 sm:p-6 rounded-xl bg-[#faf8f5] border border-[#ded7cb] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#ece7de] pb-3">
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-indigo-600" />
              <h4 className="text-sm font-bold text-stone-900">
                {t.beforeAfter.serpGoogle} ({isMobile ? t.inputPanel.mobile : t.inputPanel.desktop})
              </h4>
            </div>

            <div className="flex items-center space-x-1.5 p-1 bg-white rounded-lg border border-[#ded7cb]">
              <span className="text-xs text-stone-500 font-medium px-2">
                {t.beforeAfter.previewToggle}
              </span>
              <button
                type="button"
                onClick={() => setSerpState('before')}
                className={`px-2.5 py-1 text-xs font-bold rounded cursor-pointer transition ${
                  serpState === 'before'
                    ? 'bg-rose-100 text-rose-800 border border-rose-200'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                {t.beforeAfter.viewBefore}
              </button>
              <button
                type="button"
                onClick={() => setSerpState('after')}
                className={`px-2.5 py-1 text-xs font-bold rounded cursor-pointer transition ${
                  serpState === 'after'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                {t.beforeAfter.viewAfter}
              </button>
            </div>
          </div>

          {/* Realistic Google Search Card Simulation */}
          <div
            className={`p-4 bg-white rounded-xl border border-stone-200 shadow-2xs space-y-1.5 ${
              isMobile ? 'max-w-md' : 'max-w-2xl'
            }`}
          >
            {/* Breadcrumb / Favicon */}
            <div className="flex items-center space-x-2 text-xs text-stone-700">
              <div className="w-4 h-4 rounded-full bg-stone-100 flex items-center justify-center text-[10px] text-stone-500">
                <Globe className="w-3 h-3 text-stone-600" />
              </div>
              <span className="text-xs font-medium text-stone-800 truncate">
                {serpPreview.displayUrl || 'https://example.com'}
              </span>
            </div>

            {/* Clickable Blue Title */}
            <h5 className="text-base sm:text-lg font-normal text-[#1a0dab] hover:underline cursor-pointer leading-snug line-clamp-2">
              {serpState === 'after'
                ? serpPreview.optimizedTitle || serpPreview.currentTitle
                : serpPreview.currentTitle}
            </h5>

            {/* Meta Description Text */}
            <p className="text-xs sm:text-sm text-[#4d5156] leading-relaxed line-clamp-3">
              {serpState === 'after'
                ? serpPreview.optimizedDesc || serpPreview.currentDesc
                : serpPreview.currentDesc}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
