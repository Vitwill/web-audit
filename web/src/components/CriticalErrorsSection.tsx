import React from 'react';
import { CriticalError, Language } from '../types/seo';
import { TRANSLATIONS } from '../data/translations';
import { Flame, ArrowRight, CheckCircle2 } from 'lucide-react';

interface CriticalErrorsSectionProps {
  errors: CriticalError[];
  language?: Language;
}

export const CriticalErrorsSection: React.FC<CriticalErrorsSectionProps> = ({
  errors,
  language = 'ru',
}) => {
  const t = TRANSLATIONS[language];

  if (!errors || errors.length === 0) {
    return (
      <div className="bg-white border border-emerald-200 rounded-2xl p-6 text-center shadow-xs">
        <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3 border border-emerald-100">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-stone-900">{t.criticalErrors.title}</h3>
        <p className="text-sm text-stone-600 mt-1 max-w-md mx-auto">
          {t.criticalErrors.noErrors}
        </p>
      </div>
    );
  }

  const getImpactBadge = (impact: string) => {
    const lower = (impact || '').toLowerCase();
    if (lower.includes('критич') || lower.includes('crit') || lower.includes('срочн') || lower.includes('high')) {
      return {
        label: language === 'en' ? 'Critical Impact' : language === 'de' ? 'Kritischer Einfluss' : 'Критическое влияние',
        classes: 'bg-rose-100 text-rose-800 border-rose-200',
        dot: 'bg-rose-500 animate-pulse',
      };
    }
    if (lower.includes('высок') || lower.includes('hoch') || lower.includes('medium')) {
      return {
        label: language === 'en' ? 'High Impact' : language === 'de' ? 'Hoher Einfluss' : 'Высокое влияние',
        classes: 'bg-amber-100 text-amber-800 border-amber-200',
        dot: 'bg-amber-500',
      };
    }
    return {
      label: language === 'en' ? 'Moderate Impact' : language === 'de' ? 'Mittlerer Einfluss' : 'Умеренное влияние',
      classes: 'bg-sky-100 text-sky-800 border-sky-200',
      dot: 'bg-sky-500',
    };
  };

  return (
    <div className="bg-white border border-[#ded7cb] rounded-2xl p-6 sm:p-7 shadow-xs">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-stone-900 flex items-center gap-2">
              {t.criticalErrors.title}
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                {errors.length}
              </span>
            </h3>
            <p className="text-xs text-stone-500 font-medium">
              {t.criticalErrors.subtitle}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {errors.map((error, idx) => {
          const badge = getImpactBadge(error.impact);
          return (
            <div
              key={idx}
              className="p-5 rounded-xl border border-rose-100 bg-[#fffdfa] hover:border-rose-300 transition shadow-2xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center space-x-2.5">
                  <span className="w-6 h-6 rounded-full bg-[#2d2822] text-white text-xs font-black flex items-center justify-center flex-shrink-0">
                    {idx + 1}
                  </span>
                  <h4 className="text-base font-bold text-stone-900">{error.title}</h4>
                </div>

                <div className="flex items-center space-x-2">
                  <span
                    className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${badge.classes}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                    <span>{badge.label}</span>
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-4 text-xs sm:text-sm text-stone-700 leading-relaxed bg-[#fbf9f5] p-3.5 rounded-lg border border-[#ece7de]">
                <strong className="text-stone-900 block mb-1">
                  {t.criticalErrors.impact}
                </strong>
                <p>{error.description}</p>
              </div>

              {/* Fix Action */}
              <div className="p-3.5 rounded-lg bg-emerald-50/70 border border-emerald-200/80 flex items-start space-x-3">
                <ArrowRight className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs sm:text-sm">
                  <strong className="text-emerald-950 font-bold block mb-0.5">
                    {t.criticalErrors.action}
                  </strong>
                  <span className="text-emerald-900 font-medium">{error.fixAction}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
