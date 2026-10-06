import React, { useState } from 'react';
import { BeforeAfterItem, SerpPreview, DeviceType, Language } from '../types/seo';
import { Copy, Check, Smartphone, Laptop, ExternalLink } from 'lucide-react';

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
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [serpState, setSerpState] = useState<'after' | 'before'>('after');

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getRecommendedLength = (element: string): string | null => {
    const el = element.toLowerCase();
    if (el.includes('title') || el.includes('тег title'))
      return language === 'en' ? '50–60 chars' : language === 'de' ? '50–60 Zeichen' : '50–60 символов';
    if (el.includes('desc') || el.includes('описание'))
      return language === 'en' ? '140–160 chars' : language === 'de' ? '140–160 Zeichen' : '140–160 символов';
    if (el.includes('h1'))
      return language === 'en' ? '30–70 chars' : language === 'de' ? '30–70 Zeichen' : '30–70 символов';
    return null;
  };

  const isMobile = device === 'mobile';

  // Локализация
  const t = {
    sectionTitle:
      language === 'en'
        ? 'Before / After'
        : language === 'de'
        ? 'Vorher / Nachher'
        : 'Рекомендации «Было / Стало»',
    sectionSubtitle:
      language === 'en'
        ? 'Optimized tag variants to lift your click-through rate'
        : language === 'de'
        ? 'Optimierte Tag-Varianten für höhere Klickraten'
        : 'Оптимизированные варианты тегов для роста CTR',
    copy: language === 'en' ? 'Copy' : language === 'de' ? 'Kopieren' : 'Скопировать',
    copied: language === 'en' ? 'Copied' : language === 'de' ? 'Kopiert' : 'Скопировано',
    before: language === 'en' ? 'Before (current)' : language === 'de' ? 'Vorher (aktuell)' : 'Было (текущий вариант)',
    after: language === 'en' ? 'After (expert recommendation)' : language === 'de' ? 'Nachher (Empfehlung)' : 'Стало (рекомендация эксперта)',
    reasonLabel: language === 'en' ? 'Why this works' : language === 'de' ? 'Warum das funktioniert' : 'Почему это сработает',
    serpTitle: language === 'en' ? 'Google preview' : language === 'de' ? 'Google-Vorschau' : 'Сниппет в выдаче Google',
    showBefore: language === 'en' ? 'Before' : language === 'de' ? 'Vorher' : 'Было',
    showAfter: language === 'en' ? 'After' : language === 'de' ? 'Nachher' : 'Стало',
    optimal: language === 'en' ? 'Optimal:' : language === 'de' ? 'Optimal:' : 'Оптимально:',
    chars: language === 'en' ? 'chars' : language === 'de' ? 'Zeichen' : 'симв.',
    mobile: language === 'en' ? 'Mobile' : language === 'de' ? 'Mobil' : 'Смартфон',
    desktop: language === 'en' ? 'Desktop' : language === 'de' ? 'Desktop' : 'Компьютер',
    notSpecified: language === 'en' ? 'Not specified' : language === 'de' ? 'Nicht definiert' : 'Не задан',
  };

  return (
    <section className="max-w-4xl mx-auto">
      {/* ---------- Заголовок секции ---------- */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1d1d1f] mb-2">
            {t.sectionTitle}
          </h2>
          <p className="text-sm text-[#6e6e73]">{t.sectionSubtitle}</p>
        </div>

        {/* Переключатель Mobile/Desktop */}
        {onDeviceChange && (
          <div className="inline-flex p-1 bg-[#f5f5f7] rounded-full shrink-0">
            <button
              type="button"
              onClick={() => onDeviceChange('mobile')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full transition-apple cursor-pointer ${
                isMobile
                  ? 'bg-white text-[#1d1d1f] shadow-sm'
                  : 'text-[#6e6e73] hover:text-[#1d1d1f]'
              }`}
            >
              <Smartphone className="w-3 h-3" />
              {t.mobile}
            </button>
            <button
              type="button"
              onClick={() => onDeviceChange('desktop')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full transition-apple cursor-pointer ${
                !isMobile
                  ? 'bg-white text-[#1d1d1f] shadow-sm'
                  : 'text-[#6e6e73] hover:text-[#1d1d1f]'
              }`}
            >
              <Laptop className="w-3 h-3" />
              {t.desktop}
            </button>
          </div>
        )}
      </div>

      {/* ---------- Карточки Before/After ---------- */}
      <div className="space-y-4 mb-12">
        {items.map((item, idx) => {
          const recLength = getRecommendedLength(item.element);
          const isCopied = copiedIndex === idx;

          return (
            <div
              key={idx}
              className="p-6 bg-white rounded-3xl border border-[#e5e5e7] shadow-apple"
            >
              {/* Заголовок карточки: element + copy */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-sm font-semibold text-[#1d1d1f]">
                    {item.element}
                  </span>
                  {recLength && (
                    <span className="text-xs text-[#86868b]">
                      {t.optimal} {recLength}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => copyToClipboard(item.after, idx)}
                  className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#0071e3] hover:text-[#0077ed] transition-apple cursor-pointer"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      {t.copied}
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      {t.copy}
                    </>
                  )}
                </button>
              </div>

              {/* Было / Стало — две колонки */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Было */}
                <div className="p-5 rounded-2xl bg-[#f5f5f7]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium uppercase tracking-wide text-[#86868b]">
                      {t.before}
                    </span>
                    {item.beforeCharCount !== undefined && (
                      <span className="text-xs font-mono text-[#86868b]">
                        {item.beforeCharCount} {t.chars}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[#1d1d1f] leading-relaxed line-through decoration-[#d2d2d7] decoration-1">
                    {item.before || t.notSpecified}
                  </p>
                </div>

                {/* Стало */}
                <div className="p-5 rounded-2xl bg-white border border-[#0071e3]/20">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium uppercase tracking-wide text-[#0071e3]">
                      {t.after}
                    </span>
                    {item.afterCharCount !== undefined && (
                      <span className="text-xs font-mono text-[#0071e3]">
                        {item.afterCharCount} {t.chars}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[#1d1d1f] font-medium leading-relaxed">
                    {item.after}
                  </p>
                </div>
              </div>

              {/* Почему это сработает */}
              {item.reason && (
                <div className="mt-5 pt-4 border-t border-[#e5e5e7]">
                  <div className="text-xs font-medium uppercase tracking-widest text-[#86868b] mb-2">
                    {t.reasonLabel}
                  </div>
                  <p className="text-sm text-[#1d1d1f] leading-relaxed">{item.reason}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ---------- SERP Preview ---------- */}
      {serpPreview && (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <h3 className="text-xs font-medium uppercase tracking-widest text-[#86868b]">
              {t.serpTitle}
            </h3>

            {/* Переключатель Было/Стало */}
            <div className="inline-flex p-1 bg-[#f5f5f7] rounded-full">
              <button
                type="button"
                onClick={() => setSerpState('before')}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-apple cursor-pointer ${
                  serpState === 'before'
                    ? 'bg-white text-[#1d1d1f] shadow-sm'
                    : 'text-[#6e6e73] hover:text-[#1d1d1f]'
                }`}
              >
                {t.showBefore}
              </button>
              <button
                type="button"
                onClick={() => setSerpState('after')}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-apple cursor-pointer ${
                  serpState === 'after'
                    ? 'bg-white text-[#1d1d1f] shadow-sm'
                    : 'text-[#6e6e73] hover:text-[#1d1d1f]'
                }`}
              >
                {t.showAfter}
              </button>
            </div>
          </div>

          {/* Реалистичная карточка Google */}
          <div className={`p-6 bg-white rounded-3xl border border-[#e5e5e7] shadow-apple ${isMobile ? 'max-w-lg' : ''}`}>
            <div className="flex items-center gap-2 text-xs text-[#6e6e73] mb-2">
              <div className="w-4 h-4 rounded-full bg-[#f5f5f7] flex items-center justify-center">
                <ExternalLink className="w-2.5 h-2.5" />
              </div>
              <span className="truncate">{serpPreview.displayUrl || 'https://example.com'}</span>
            </div>
            <h4 className="text-lg text-[#1a0dab] hover:underline cursor-pointer leading-snug mb-2 line-clamp-2">
              {serpState === 'after'
                ? serpPreview.optimizedTitle || serpPreview.currentTitle
                : serpPreview.currentTitle}
            </h4>
            <p className="text-sm text-[#4d5156] leading-relaxed line-clamp-3">
              {serpState === 'after'
                ? serpPreview.optimizedDesc || serpPreview.currentDesc
                : serpPreview.currentDesc}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};