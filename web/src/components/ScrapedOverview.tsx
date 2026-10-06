import React, { useState } from 'react';
import { AnalyzedData, Language } from '../types/seo';
import {
  ShieldCheck,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

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
    title:
      language === 'en'
        ? 'Technical parameters'
        : language === 'de'
        ? 'Technische Parameter'
        : 'Технические параметры страницы',
    sslSecure:
      language === 'en' ? 'HTTPS (SSL)' : language === 'de' ? 'HTTPS (SSL)' : 'HTTPS (SSL)',
    sslNone:
      language === 'en' ? 'No SSL (HTTP)' : language === 'de' ? 'Kein SSL (HTTP)' : 'Без SSL (HTTP)',
    ttfb: 'TTFB',
    htmlSize:
      language === 'en' ? 'HTML size' : language === 'de' ? 'HTML-Größe' : 'Размер HTML',
    words:
      language === 'en' ? 'words' : language === 'de' ? 'Wörter' : 'слов',
    photos:
      language === 'en' ? 'images' : language === 'de' ? 'Bilder' : 'изображений',
    withoutAlt:
      language === 'en'
        ? 'without alt'
        : language === 'de'
        ? 'ohne Alt'
        : 'без alt',
    titleLabel:
      language === 'en' ? 'Title tag' : language === 'de' ? 'Title-Tag' : 'Тег Title',
    descLabel:
      language === 'en'
        ? 'Description'
        : language === 'de'
        ? 'Description'
        : 'Мета-тег Description',
    h1Label: 'H1',
    h2Label: 'H2',
    robotsLabel:
      language === 'en' ? 'robots' : language === 'de' ? 'robots' : 'robots',
    viewportLabel: 'viewport',
    internalLinks:
      language === 'en'
        ? 'internal links'
        : language === 'de'
        ? 'interne Links'
        : 'внутренних ссылок',
    externalLinks:
      language === 'en'
        ? 'external links'
        : language === 'de'
        ? 'externe Links'
        : 'внешних ссылок',
    notSpecified:
      language === 'en'
        ? 'Not specified'
        : language === 'de'
        ? 'Nicht angegeben'
        : 'Не указан',
  };

  return (
    <section className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl border border-[#e5e5e7] shadow-apple overflow-hidden">
        {/* ---------- Верхняя строка (кликабельная) ---------- */}
        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          className="w-full flex items-center justify-between gap-4 px-6 py-4 cursor-pointer hover:bg-[#fafafa] transition-apple"
        >
          <div className="flex items-center gap-4 min-w-0 flex-wrap">
            <span className="text-sm font-medium text-[#1d1d1f]">{t.title}</span>

            {/* Сжатая сводка */}
            <div className="hidden md:flex items-center gap-4 text-xs text-[#6e6e73]">
              <span className="inline-flex items-center gap-1">
                {data.hasSsl ? (
                  <ShieldCheck className="w-3.5 h-3.5 text-[#34c759]" />
                ) : (
                  <ShieldAlert className="w-3.5 h-3.5 text-[#ff3b30]" />
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
            <ChevronUp className="w-4 h-4 text-[#86868b] shrink-0" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#86868b] shrink-0" />
          )}
        </button>

        {/* ---------- Раскрытое содержимое ---------- */}
        {isOpen && (
          <div className="border-t border-[#e5e5e7] p-6 space-y-4">
            {/* Title + Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#f5f5f7]">
                <div className="text-xs font-medium text-[#86868b] mb-2">
                  {t.titleLabel} ·{' '}
                  <span className="text-[#6e6e73]">
                    {data.titleLength || data.title?.length || 0} симв.
                  </span>
                </div>
                <p className="text-sm font-mono text-[#1d1d1f] break-words">
                  {data.title || '—'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#f5f5f7]">
                <div className="text-xs font-medium text-[#86868b] mb-2">
                  {t.descLabel} ·{' '}
                  <span className="text-[#6e6e73]">
                    {data.descriptionLength || data.description?.length || 0} симв.
                  </span>
                </div>
                <p className="text-sm font-mono text-[#1d1d1f] break-words">
                  {data.description || '—'}
                </p>
              </div>
            </div>

            {/* Сетка метаданных */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-[#f5f5f7]">
                <div className="text-[11px] text-[#86868b] mb-1">{t.robotsLabel}</div>
                <div className="text-xs font-mono text-[#1d1d1f] truncate">
                  {data.robots || t.notSpecified}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#f5f5f7]">
                <div className="text-[11px] text-[#86868b] mb-1">{t.viewportLabel}</div>
                <div className="text-xs font-mono text-[#1d1d1f] truncate">
                  {data.viewport || t.notSpecified}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#f5f5f7]">
                <div className="text-[11px] text-[#86868b] mb-1">{t.internalLinks}</div>
                <div className="text-xs font-mono text-[#1d1d1f]">
                  {data.internalLinksCount || 0}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#f5f5f7]">
                <div className="text-[11px] text-[#86868b] mb-1">{t.externalLinks}</div>
                <div className="text-xs font-mono text-[#1d1d1f]">
                  {data.externalLinksCount || 0}
                </div>
              </div>
            </div>

            {/* H1 */}
            {data.h1 && data.h1.length > 0 && (
              <div className="p-4 rounded-2xl bg-[#f5f5f7]">
                <div className="text-xs font-medium text-[#86868b] mb-2">
                  {t.h1Label} · {data.h1.length}
                </div>
                <ul className="space-y-1.5">
                  {data.h1.map((item, i) => (
                    <li key={i} className="text-sm font-mono text-[#1d1d1f] break-words">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* H2 */}
            {data.h2 && data.h2.length > 0 && (
              <div className="p-4 rounded-2xl bg-[#f5f5f7]">
                <div className="text-xs font-medium text-[#86868b] mb-2">
                  {t.h2Label} · {data.h2.length}
                </div>
                <div className="flex flex-wrap gap-2">
                  {data.h2.map((item, i) => (
                    <span
                      key={i}
                      className="text-xs font-mono px-2.5 py-1 rounded-md bg-white text-[#1d1d1f]"
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