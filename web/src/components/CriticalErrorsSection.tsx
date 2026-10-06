import React from 'react';
import { CriticalError, Language } from '../types/seo';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface CriticalErrorsSectionProps {
  errors: CriticalError[];
  language?: Language;
}

export const CriticalErrorsSection: React.FC<CriticalErrorsSectionProps> = ({
  errors,
  language = 'ru',
}) => {
  // Пустой стейт — всё в порядке
  if (!errors || errors.length === 0) {
    return (
      <section className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center text-center py-12 px-6 bg-white rounded-3xl border border-[#e5e5e7] shadow-apple">
          <div className="w-14 h-14 rounded-full bg-[#e8f8ee] flex items-center justify-center mb-4">
            <CheckCircle2 className="w-7 h-7 text-[#34c759]" />
          </div>
          <h3 className="text-lg font-semibold text-[#1d1d1f] mb-2">
            {language === 'en'
              ? 'No critical issues found'
              : language === 'de'
              ? 'Keine kritischen Probleme gefunden'
              : 'Критических ошибок не обнаружено'}
          </h3>
          <p className="text-sm text-[#6e6e73] max-w-md leading-relaxed">
            {language === 'en'
              ? 'Technical foundations are stable. Proceed to snippet optimization.'
              : language === 'de'
              ? 'Die technische Basis ist stabil. Fahren Sie mit der Snippet-Optimierung fort.'
              : 'Технический фундамент в норме. Можно переходить к оптимизации сниппетов.'}
          </p>
        </div>
      </section>
    );
  }

  // Определяем "уровень" ошибки по тексту impact
  const getImpactColor = (impact: string) => {
    const lower = (impact || '').toLowerCase();
    if (lower.includes('критич') || lower.includes('crit')) return '#ff3b30';
    if (lower.includes('высок') || lower.includes('hoch') || lower.includes('high'))
      return '#ff9500';
    return '#ffcc00';
  };

  const getImpactLabel = (impact: string): string => {
    const lower = (impact || '').toLowerCase();
    if (lower.includes('критич') || lower.includes('crit'))
      return language === 'en' ? 'Critical' : language === 'de' ? 'Kritisch' : 'Критично';
    if (lower.includes('высок') || lower.includes('hoch') || lower.includes('high'))
      return language === 'en' ? 'High' : language === 'de' ? 'Hoch' : 'Высокое';
    return language === 'en' ? 'Moderate' : language === 'de' ? 'Mittel' : 'Умеренное';
  };

  const sectionTitle =
    language === 'en'
      ? 'Critical issues'
      : language === 'de'
      ? 'Kritische Fehler'
      : 'Критические ошибки';

  const sectionSubtitle =
    language === 'en'
      ? 'Fix these first to restore indexing and rankings'
      : language === 'de'
      ? 'Diese zuerst beheben, um Indexierung und Rankings wiederherzustellen'
      : 'Исправьте в первую очередь для восстановления индексации';

  return (
    <section className="max-w-4xl mx-auto">
      {/* ---------- Заголовок секции ---------- */}
      <div className="flex items-baseline gap-3 mb-8">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1d1d1f]">
          {sectionTitle}
        </h2>
        <span className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 rounded-full bg-[#ffeceb] text-[#ff3b30] text-sm font-semibold">
          {errors.length}
        </span>
      </div>
      <p className="text-sm text-[#6e6e73] mb-8 -mt-6">{sectionSubtitle}</p>

      {/* ---------- Список ошибок ---------- */}
      <div className="space-y-4">
        {errors.map((error, idx) => {
          const impactColor = getImpactColor(error.impact);

          return (
            <div
              key={idx}
              className="p-6 bg-white rounded-3xl border border-[#e5e5e7] shadow-apple"
            >
              {/* Заголовок ошибки + уровень */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                <div className="flex items-start gap-3">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#ffeceb] text-[#ff3b30] text-xs font-bold shrink-0">
                    {idx + 1}
                  </span>
                  <h3 className="text-base font-semibold text-[#1d1d1f] leading-snug">
                    {error.title}
                  </h3>
                </div>
                <span
                  className="self-start px-2.5 py-1 rounded-md text-[11px] font-semibold tracking-wide uppercase"
                  style={{
                    color: impactColor,
                    backgroundColor: `${impactColor}15`,
                  }}
                >
                  {getImpactLabel(error.impact)}
                </span>
              </div>

              {/* Описание проблемы */}
              <div className="mb-4 pl-10">
                <div className="text-xs font-medium uppercase tracking-widest text-[#86868b] mb-2">
                  {language === 'en'
                    ? 'The issue'
                    : language === 'de'
                    ? 'Das Problem'
                    : 'В чём суть'}
                </div>
                <p className="text-sm text-[#1d1d1f] leading-relaxed">{error.description}</p>
              </div>

              {/* Что сделать */}
              <div className="pl-10">
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#f5f5f7]">
                  <AlertCircle className="w-4 h-4 text-[#0071e3] shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-xs font-medium text-[#0071e3] mb-1.5">
                      {language === 'en'
                        ? 'What to do'
                        : language === 'de'
                        ? 'Was zu tun ist'
                        : 'Что сделать'}
                    </div>
                    <p className="text-sm text-[#1d1d1f] leading-relaxed">
                      {error.fixAction}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};