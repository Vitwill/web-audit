import React, { useState } from 'react';
import { AnalyzedData, Language } from '../types/seo';
import { TRANSLATIONS } from '../data/translations';
import {
  ShieldCheck,
  ShieldAlert,
  Clock,
  Code2,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
  FileText,
  FileCode,
  Globe2,
} from 'lucide-react';

interface ScrapedOverviewProps {
  data: AnalyzedData;
  language?: Language;
}

export const ScrapedOverview: React.FC<ScrapedOverviewProps> = ({ data, language = 'ru' }) => {
  const t = TRANSLATIONS[language];
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white border border-[#ded7cb] rounded-2xl p-4 sm:p-5 shadow-xs">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-[#f3efe6] border border-[#ded7cb] flex items-center justify-center text-stone-700">
            <Code2 className="w-4 h-4 text-emerald-700" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-black text-stone-900">
                {t.scrapedOverview.title}
              </h4>
              {data.statusCode && (
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  HTTP {data.statusCode} {data.statusMessage || 'OK'}
                </span>
              )}
              {data.detectedSiteType && (
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-[#f3efe6] text-stone-700 border border-[#ded7cb]">
                  <Globe2 className="w-3 h-3 text-stone-500" />
                  {data.detectedSiteType}
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-600 font-medium mt-1">
              <span className="flex items-center space-x-1">
                {data.hasSsl ? (
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                )}
                <span>{data.hasSsl ? t.scrapedOverview.sslSecure : t.scrapedOverview.sslNone}</span>
              </span>

              {data.responseTimeMs !== undefined && data.responseTimeMs > 0 && (
                <span className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-sky-700" />
                  <span>{data.responseTimeMs} {t.scrapedOverview.ttfb}</span>
                </span>
              )}

              {data.htmlSizeKb && (
                <span className="flex items-center space-x-1">
                  <FileCode className="w-3.5 h-3.5 text-indigo-700" />
                  <span>{data.htmlSizeKb} {t.scrapedOverview.htmlSize}</span>
                </span>
              )}

              <span className="flex items-center space-x-1">
                <FileText className="w-3.5 h-3.5 text-amber-700" />
                <span>~{data.wordCount || 0} {t.scrapedOverview.words}</span>
              </span>

              <span className="flex items-center space-x-1">
                <ImageIcon className="w-3.5 h-3.5 text-teal-700" />
                <span>
                  {data.imagesTotal || 0} {t.scrapedOverview.photos} ({data.imagesWithoutAlt || 0} {t.scrapedOverview.withoutAlt})
                </span>
              </span>
            </div>
          </div>
        </div>

        <button className="text-stone-400 hover:text-stone-700 p-1 rounded-lg">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {isOpen && (
        <div className="mt-4 pt-4 border-t border-[#ece7de] text-xs text-stone-700 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-[#faf8f5] p-3 rounded-xl border border-[#e5dfd5]">
              <span className="text-stone-500 font-bold block mb-1">
                {t.scrapedOverview.titleLabel} ({data.titleLength || data.title?.length || 0} {language === 'en' ? 'chars' : language === 'de' ? 'Zeichen' : 'симв.'}):
              </span>
              <p className="font-mono text-stone-900 break-words">{data.title || '—'}</p>
            </div>

            <div className="bg-[#faf8f5] p-3 rounded-xl border border-[#e5dfd5]">
              <span className="text-stone-500 font-bold block mb-1">
                {t.scrapedOverview.descLabel} ({data.descriptionLength || data.description?.length || 0} {language === 'en' ? 'chars' : language === 'de' ? 'Zeichen' : 'симв.'}):
              </span>
              <p className="font-mono text-stone-900 break-words">{data.description || '—'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="bg-[#faf8f5] p-2.5 rounded-lg border border-[#e5dfd5]">
              <span className="text-stone-500 font-medium block text-[11px]">{t.scrapedOverview.robotsLabel}:</span>
              <span className="font-mono text-stone-900 font-bold">{data.robots || (language === 'en' ? 'Not specified' : language === 'de' ? 'Nicht angegeben' : 'Не указан')}</span>
            </div>
            <div className="bg-[#faf8f5] p-2.5 rounded-lg border border-[#e5dfd5]">
              <span className="text-stone-500 font-medium block text-[11px]">{t.scrapedOverview.viewportLabel}:</span>
              <span className="font-mono text-stone-900 font-bold truncate block">{data.viewport || (language === 'en' ? 'Not specified' : language === 'de' ? 'Nicht angegeben' : 'Не указан')}</span>
            </div>
            <div className="bg-[#faf8f5] p-2.5 rounded-lg border border-[#e5dfd5]">
              <span className="text-stone-500 font-medium block text-[11px]">{language === 'en' ? 'Internal links:' : language === 'de' ? 'Interne Links:' : 'Внутр. ссылки:'}</span>
              <span className="font-mono text-stone-900 font-bold">{data.internalLinksCount || 0}</span>
            </div>
            <div className="bg-[#faf8f5] p-2.5 rounded-lg border border-[#e5dfd5]">
              <span className="text-stone-500 font-medium block text-[11px]">{language === 'en' ? 'External links:' : language === 'de' ? 'Externe Links:' : 'Внешние ссылки:'}</span>
              <span className="font-mono text-stone-900 font-bold">{data.externalLinksCount || 0}</span>
            </div>
          </div>

          {data.h1 && data.h1.length > 0 && (
            <div className="bg-[#faf8f5] p-3 rounded-lg border border-[#e5dfd5]">
              <span className="text-stone-500 font-bold block mb-1">
                {t.scrapedOverview.h1Label} ({data.h1.length}):
              </span>
              <ul className="list-disc list-inside space-y-1 font-mono text-stone-900">
                {data.h1.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {data.h2 && data.h2.length > 0 && (
            <div className="bg-[#faf8f5] p-3 rounded-lg border border-[#e5dfd5]">
              <span className="text-stone-500 font-bold block mb-1">
                {t.scrapedOverview.h2Label} ({data.h2.length}):
              </span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {data.h2.map((item, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-white border border-[#ded7cb] font-mono text-[11px] text-stone-800">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
