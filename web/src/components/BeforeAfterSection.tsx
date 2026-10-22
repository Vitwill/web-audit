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

  const t = {
    sectionTitle: language === 'en' ? 'Before / After' : language === 'de' ? 'Vorher / Nachher' : 'Рекомендации «Было / Стало»',
    sectionSubtitle: language === 'en' ? 'Optimized tag variants to lift your click-through rate' : language === 'de' ? 'Optimierte Tag-Varianten für höhere Klickraten' : 'Оптимизированные варианты тегов для роста CTR',
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
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-[rgba(14,14,14,0.14)]">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-medium tracking-[-0.03em] text-[#0E0E0E] mb-2">
            {t.sectionTitle}
          </h2>
          <p className="font-mono text-[11px] tracking-[0.1em] uppercase text-[rgba(14,14,14,0.45)]">{t.sectionSubtitle}</p>
        </div>

        {onDeviceChange && (
          <div className="inline-flex bg-[#EFEBE3] border border-[rgba(14,14,14,0.22)] rounded-sm p-1 shrink-0">
            <button
              type="button"
              onClick={() => onDeviceChange('mobile')}
              className={`flex items-center gap-1.5 px-4 py-1.5 font-mono text-[10px] tracking-[0.1em] uppercase rounded-sm transition-colors cursor-pointer ${
                isMobile ? 'bg-[#0E0E0E] text-[#F5F2EC]' : 'text-[rgba(14,14,14,0.68)] hover:text-[#0E0E0E]'
              }`}
            >
              <Smartphone className="w-3 h-3" />
              {t.mobile}
            </button>
            <button
              type="button"
              onClick={() => onDeviceChange('desktop')}
              className={`flex items-center gap-1.5 px-4 py-1.5 font-mono text-[10px] tracking-[0.1em] uppercase rounded-sm transition-colors cursor-pointer ${
                !isMobile ? 'bg-[#0E0E0E] text-[#F5F2EC]' : 'text-[rgba(14,14,14,0.68)] hover:text-[#0E0E0E]'
              }`}
            >
              <Laptop className="w-3 h-3" />
              {t.desktop}
            </button>
          </div>
        )}
      </div>

      {/* ---------- Карточки Before/After ---------- */}
      <div className="space-y-6 mb-12">
        {items.map((item, idx) => {
          const recLength = getRecommendedLength(item.element);
          const isCopied = copiedIndex === idx;

          return (
            <div
              key={idx}
              className="p-6 bg-[#EFEBE3] rounded-sm border border-[rgba(14,14,14,0.14)]"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-[rgba(14,14,14,0.14)]">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-display text-[17px] font-medium text-[#0E0E0E]">
                    {item.element}
                  </span>
                  {recLength && (
                    <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-[rgba(14,14,14,0.45)] border border-[rgba(14,14,14,0.14)] px-2 py-0.5 rounded-sm">
                      {t.optimal} {recLength}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => copyToClipboard(item.after, idx)}
                  className="self-start sm:self-auto inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.1em] uppercase text-[#C1440E] hover:text-[#0E0E0E] transition-colors cursor-pointer"
                >
                  {isCopied ? (
                    <><Check className="w-3.5 h-3.5" />{t.copied}</>
                  ) : (
                    <><Copy className="w-3.5 h-3.5" />{t.copy}</>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Было */}
                <div className="p-5 rounded-sm bg-[#F5F2EC] border border-dashed border-[rgba(14,14,14,0.22)]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-[rgba(14,14,14,0.45)]">
                      {t.before}
                    </span>
                    {item.beforeCharCount !== undefined && (
                      <span className="font-mono text-[10px] text-[rgba(14,14,14,0.45)]">
                        {item.beforeCharCount} {t.chars}
                      </span>
                    )}
                  </div>
                  <p className="text-[14px] text-[#0E0E0E] leading-relaxed line-through decoration-[rgba(14,14,14,0.22)] decoration-1">
                    {item.before || t.notSpecified}
                  </p>
                </div>

                {/* Стало */}
                <div className="p-5 rounded-sm bg-[#F5F2EC] border border-[#C1440E]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-[#C1440E]">
                      {t.after}
                    </span>
                    {item.afterCharCount !== undefined && (
                      <span className="font-mono text-[10px] text-[#C1440E]">
                        {item.afterCharCount} {t.chars}
                      </span>
                    )}
                  </div>
                  <p className="text-[14px] text-[#0E0E0E] font-medium leading-relaxed">
                    {item.after}
                  </p>
                </div>
              </div>

              {item.reason && (
                <div className="mt-5 pt-4 border-t border-[rgba(14,14,14,0.14)]">
                  <div className="font-mono text-[10px] tracking-[0.1em] uppercase text-[rgba(14,14,14,0.45)] mb-2">
                    {t.reasonLabel}
                  </div>
                  <p className="text-[13px] text-[rgba(14,14,14,0.68)] leading-relaxed">{item.reason}</p>
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
            <h3 className="font-mono text-[11px] tracking-[0.16em] uppercase text-[rgba(14,14,14,0.45)]">
              {t.serpTitle}
            </h3>

            <div className="inline-flex bg-[#EFEBE3] border border-[rgba(14,14,14,0.22)] rounded-sm p-1">
              <button
                type="button"
                onClick={() => setSerpState('before')}
                className={`px-4 py-1 font-mono text-[10px] tracking-[0.1em] uppercase rounded-sm transition-colors cursor-pointer ${
                  serpState === 'before' ? 'bg-[#0E0E0E] text-[#F5F2EC]' : 'text-[rgba(14,14,14,0.68)] hover:text-[#0E0E0E]'
                }`}
              >
                {t.showBefore}
              </button>
              <button
                type="button"
                onClick={() => setSerpState('after')}
                className={`px-4 py-1 font-mono text-[10px] tracking-[0.1em] uppercase rounded-sm transition-colors cursor-pointer ${
                  serpState === 'after' ? 'bg-[#0E0E0E] text-[#F5F2EC]' : 'text-[rgba(14,14,14,0.68)] hover:text-[#0E0E0E]'
                }`}
              >
                {t.showAfter}
              </button>
            </div>
          </div>

          {/* Карточка Google (сохраняем цвета Google для реалистичности, но добавляем наши границы) */}
          <div className={`p-6 bg-white rounded-sm border border-[rgba(14,14,14,0.22)] ${isMobile ? 'max-w-lg' : ''}`}>
            <div className="flex items-center gap-2 text-xs text-[#202124] mb-2 font-sans">
              <div className="w-4 h-4 rounded-full bg-[#f1f3f4] flex items-center justify-center">
                <ExternalLink className="w-2.5 h-2.5" />
              </div>
              <span className="truncate">{serpPreview.displayUrl || 'https://example.com'}</span>
            </div>
            <h4 className="text-xl text-[#1a0dab] hover:underline cursor-pointer leading-snug mb-1 line-clamp-2 font-sans font-normal">
              {serpState === 'after' ? serpPreview.optimizedTitle || serpPreview.currentTitle : serpPreview.currentTitle}
            </h4>
            <p className="text-[14px] text-[#4d5156] leading-relaxed line-clamp-3 font-sans">
              {serpState === 'after' ? serpPreview.optimizedDesc || serpPreview.currentDesc : serpPreview.currentDesc}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
