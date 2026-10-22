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
  if (!errors || errors.length === 0) {
    return (
      <section className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center text-center py-12 px-6 bg-[#EFEBE3] rounded-sm border border-[rgba(14,14,14,0.14)]">
          <div className="w-14 h-14 rounded-full bg-[#F5F2EC] border border-[rgba(14,14,14,0.14)] flex items-center justify-center mb-4">
            <CheckCircle2 className="w-7 h-7 text-[#1e5c2a]" />
          </div>
          <h3 className="font-display text-xl font-medium tracking-[-0.02em] text-[#0E0E0E] mb-2">
            {language === 'en' ? 'No critical issues found' : language === 'de' ? 'Keine kritischen Probleme gefunden' : 'Критических ошибок не обнаружено'}
          </h3>
          <p className="text-[14px] text-[rgba(14,14,14,0.68)] max-w-md leading-relaxed">
            {language === 'en' ? 'Technical foundations are stable. Proceed to snippet optimization.' : language === 'de' ? 'Die technische Basis ist stabil. Fahren Sie mit der Snippet-Optimierung fort.' : 'Технический фундамент в норме. Можно переходить к оптимизации сниппетов.'}
          </p>
        </div>
      </section>
    );
  }

  const getImpactColor = (impact: string) => {
    const lower = (impact || '').toLowerCase();
    if (lower.includes('критич') || lower.includes('crit')) return '#8b1f29';
    if (lower.includes('высок') || lower.includes('hoch') || lower.includes('high')) return '#C1440E';
    return '#0E0E0E';
  };

  const getImpactLabel = (impact: string): string => {
    const lower = (impact || '').toLowerCase();
    if (lower.includes('критич') || lower.includes('crit')) return language === 'en' ? 'Critical' : language === 'de' ? 'Kritisch' : 'Критично';
    if (lower.includes('высок') || lower.includes('hoch') || lower.includes('high')) return language === 'en' ? 'High' : language === 'de' ? 'Hoch' : 'Высокое';
    return language === 'en' ? 'Moderate' : language === 'de' ? 'Mittel' : 'Умеренное';
  };

  const sectionTitle = language === 'en' ? 'Critical issues' : language === 'de' ? 'Kritische Fehler' : 'Критические ошибки';
  const sectionSubtitle = language === 'en' ? 'Fix these first to restore indexing and rankings' : language === 'de' ? 'Diese zuerst beheben, um Indexierung und Rankings wiederherzustellen' : 'Исправьте в первую очередь для восстановления индексации';

  return (
    <section className="max-w-4xl mx-auto">
      <div className="flex items-baseline gap-3 mb-2">
        <h2 className="font-display text-2xl sm:text-3xl font-medium tracking-[-0.03em] text-[#0E0E0E]">
          {sectionTitle}
        </h2>
        <span className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 rounded-sm bg-[#F5F2EC] border border-[rgba(14,14,14,0.14)] text-[#8b1f29] font-mono text-[13px] font-medium">
          {errors.length}
        </span>
      </div>
      <p className="font-mono text-[11px] tracking-[0.1em] uppercase text-[rgba(14,14,14,0.45)] mb-8 pb-4 border-b border-[rgba(14,14,14,0.14)]">{sectionSubtitle}</p>

      <div className="space-y-4">
        {errors.map((error, idx) => {
          const impactColor = getImpactColor(error.impact);

          return (
            <div key={idx} className="p-6 bg-[#EFEBE3] rounded-sm border border-[rgba(14,14,14,0.14)]">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-5 pb-4 border-b border-[rgba(14,14,14,0.14)]">
                <div className="flex items-start gap-4">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-sm bg-[#F5F2EC] border border-[rgba(14,14,14,0.14)] text-[#C1440E] font-mono text-[12px] font-medium shrink-0">
                    {idx + 1}
                  </span>
                  <h3 className="font-display text-[17px] font-medium text-[#0E0E0E] leading-snug mt-0.5">
                    {error.title}
                  </h3>
                </div>
                <span
                  className="self-start font-mono text-[10px] tracking-[0.1em] uppercase px-2 py-1 rounded-sm border"
                  style={{ color: impactColor, borderColor: impactColor, backgroundColor: 'transparent' }}
                >
                  {getImpactLabel(error.impact)}
                </span>
              </div>

              <div className="mb-5 pl-11">
                <div className="font-mono text-[10px] tracking-[0.1em] uppercase text-[rgba(14,14,14,0.45)] mb-2">
                  {language === 'en' ? 'The issue' : language === 'de' ? 'Das Problem' : 'В чём суть'}
                </div>
                <p className="text-[14px] text-[#0E0E0E] leading-relaxed">{error.description}</p>
              </div>

              <div className="pl-11">
                <div className="flex items-start gap-4 p-5 rounded-sm bg-[#F5F2EC] border-l-2 border-[#C1440E]">
                  <AlertCircle className="w-5 h-5 text-[#C1440E] shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="font-mono text-[10px] tracking-[0.1em] uppercase text-[#C1440E] mb-2">
                      {language === 'en' ? 'What to do' : language === 'de' ? 'Was zu tun ist' : 'Что сделать'}
                    </div>
                    <p className="text-[14px] text-[#0E0E0E] leading-relaxed">
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
