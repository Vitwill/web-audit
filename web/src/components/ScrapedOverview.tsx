import React, { useState } from 'react';
import { AnalyzedData, Language } from '../types/seo';
import { ShieldCheck, ShieldAlert, ChevronDown, ChevronUp } from 'lucide-react';

interface ScrapedOverviewProps {
  data: AnalyzedData;
  language?: Language;
}

export const ScrapedOverview: React.FC<ScrapedOverviewProps> = ({
  data,
  language = 'ru',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const t = {
    title: language === 'en' ? 'Technical parameters' : language === 'de' ? 'Technische Parameter' : 'Технические параметры страницы',
    sslSecure: 'HTTPS (SSL)',
    sslNone: 'HTTP',
    ttfb: 'TTFB',
    htmlSize: language === 'en' ? 'HTML size' : language === 'de' ? 'HTML-Größe' : 'Размер HTML',
    words: language === 'en' ? 'words' : language === 'de' ? 'Wörter' : 'слов',
    photos: language === 'en' ? 'images' : language === 'de' ? 'Bilder' : 'изображений',
    withoutAlt: language === 'en' ? 'without alt' : language === 'de' ? 'ohne Alt' : 'без alt',
    titleLabel: language === 'en' ? 'Title tag' : language === 'de' ? 'Title-Tag' : 'Тег Title',
    descLabel: language === 'en' ? 'Description' : language === 'de' ? 'Description' : 'Мета-тег Description',
    h1Label: 'H1',
    h2Label: 'H2',
    robotsLabel: 'robots',
    viewportLabel: 'viewport',
    internalLinks: language === 'en' ? 'internal links' : language === 'de' ? 'interne Links' : 'внутренних ссылок',
    externalLinks: language === 'en' ? 'external links' : language === 'de' ? 'externe Links' : 'внешних ссылок',
    notSpecified: language === 'en' ? 'Not specified' : language === 'de' ? 'Nicht angegeben' : 'Не указан',
  };

  return (
    <section className="max-w-4xl mx-auto">
      <div className="bg-[#EFEBE3] rounded-sm border border-[rgba(14,14,14,0.14)] overflow-hidden">
        {/* ---------- Верхняя строка (кликабельная) ---------- */}
        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          className="w-full flex items-center justify-between gap-4 px-6 py-4 cursor-pointer hover:bg-[#F5F2EC] transition-colors"
        >
          <div className="flex items-center gap-4 min-w-0 flex-wrap">
            <span className="text-[15px] font-medium text-[#0E0E0E]">{t.title}</span>

            {/* Сжатая сводка */}
            <div className="hidden md:flex items-center gap-5 font-mono text-[11px] text-[rgba(14,14,14,0.68)]">
              <span className="inline-flex items-center gap-1.5">
                {data.hasSsl ? (
                  <ShieldCheck className="w-4 h-4 text-[#1e5c2a]" />
                ) : (
                  <ShieldAlert className="w-4 h-4 text-[#8b1f29]" />
                )}
                {data.hasSsl ? t.sslSecure : t.sslNone}
              </span>
              {data.responseTimeMs !== undefined && data.responseTimeMs > 0 && (
                <span>{data.responseTimeMs} ms {t.ttfb}</span>
              )}
              {data.htmlSizeKb && <span>{data.htmlSizeKb} KB</span>}
              <span>~{data.wordCount || 0} {t.words}</span>
              <span>
                {data.imagesTotal || 0} {t.photos}
                {data.imagesWithoutAlt ? ` (${data.imagesWithoutAlt} ${t.withoutAlt})` : ''}
              </span>
            </div>
          </div>

          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-[rgba(14,14,14,0.45)] shrink-0" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[rgba(14,14,14,0.45)] shrink-0" />
          )}
        </button>

        {/* ---------- Раскрытое содержимое ---------- */}
        {isOpen && (
          <div className="border-t border-[rgba(14,14,14,0.14)] p-6 space-y-4">
            {/* Title + Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-sm bg-[#F5F2EC] border border-[rgba(14,14,14,0.14)]">
                <div className="font-mono text-[10px] tracking-[0.1em] uppercase text-[rgba(14,14,14,0.45)] mb-3 flex justify-between">
                  <span>{t.titleLabel}</span>
                  <span>{data.titleLength || data.title?.length || 0} {language === 'ru' ? 'симв.' : 'chars'}</span>
                </div>
                <p className="text-[13px] font-mono text-[#0E0E0E] break-words leading-relaxed">
                  {data.title || '—'}
                </p>
              </div>

              <div className="p-5 rounded-sm bg-[#F5F2EC] border border-[rgba(14,14,14,0.14)]">
                <div className="font-mono text-[10px] tracking-[0.1em] uppercase text-[rgba(14,14,14,0.45)] mb-3 flex justify-between">
                  <span>{t.descLabel}</span>
                  <span>{data.descriptionLength || data.description?.length || 0} {language === 'ru' ? 'симв.' : 'chars'}</span>
                </div>
                <p className="text-[13px] font-mono text-[#0E0E0E] break-words leading-relaxed">
                  {data.description || '—'}
                </p>
              </div>
            </div>

            {/* Сетка метаданных */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-4 rounded-sm bg-[#F5F2EC] border border-[rgba(14,14,14,0.14)]">
                <div className="font-mono text-[10px] text-[rgba(14,14,14,0.45)] mb-1.5">{t.robotsLabel}</div>
                <div className="text-[12px] font-mono text-[#0E0E0E] truncate">
                  {data.robots || t.notSpecified}
                </div>
              </div>
              <div className="p-4 rounded-sm bg-[#F5F2EC] border border-[rgba(14,14,14,0.14)]">
                <div className="font-mono text-[10px] text-[rgba(14,14,14,0.45)] mb-1.5">{t.viewportLabel}</div>
                <div className="text-[12px] font-mono text-[#0E0E0E] truncate">
                  {data.viewport || t.notSpecified}
                </div>
              </div>
              <div className="p-4 rounded-sm bg-[#F5F2EC] border border-[rgba(14,14,14,0.14)]">
                <div className="font-mono text-[10px] text-[rgba(14,14,14,0.45)] mb-1.5">{t.internalLinks}</div>
                <div className="text-[13px] font-mono font-medium text-[#0E0E0E]">
                  {data.internalLinksCount || 0}
                </div>
              </div>
              <div className="p-4 rounded-sm bg-[#F5F2EC] border border-[rgba(14,14,14,0.14)]">
                <div className="font-mono text-[10px] text-[rgba(14,14,14,0.45)] mb-1.5">{t.externalLinks}</div>
                <div className="text-[13px] font-mono font-medium text-[#0E0E0E]">
                  {data.externalLinksCount || 0}
                </div>
              </div>
            </div>

            {/* H1 */}
            {data.h1 && data.h1.length > 0 && (
              <div className="p-5 rounded-sm bg-[#F5F2EC] border border-[rgba(14,14,14,0.14)]">
                <div className="font-mono text-[10px] tracking-[0.1em] uppercase text-[rgba(14,14,14,0.45)] mb-3">
                  {t.h1Label} · {data.h1.length}
                </div>
                <ul className="space-y-2">
                  {data.h1.map((item, i) => (
                    <li key={i} className="text-[13px] font-mono text-[#0E0E0E] break-words">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* H2 */}
            {data.h2 && data.h2.length > 0 && (
              <div className="p-5 rounded-sm bg-[#F5F2EC] border border-[rgba(14,14,14,0.14)]">
                <div className="font-mono text-[10px] tracking-[0.1em] uppercase text-[rgba(14,14,14,0.45)] mb-3">
                  {t.h2Label} · {data.h2.length}
                </div>
                <div className="flex flex-wrap gap-2">
                  {data.h2.map((item, i) => (
                    <span
                      key={i}
                      className="text-[12px] font-mono px-3 py-1 rounded-sm bg-[#EFEBE3] border border-[rgba(14,14,14,0.14)] text-[#0E0E0E]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
