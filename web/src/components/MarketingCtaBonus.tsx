import React, { useState } from 'react';
import { MarketingBonus, Language } from '../types/seo';
import { TRANSLATIONS } from '../data/translations';
import { Sparkles, CheckCircle2, UserCheck, FileText, ArrowRight, Globe } from 'lucide-react';

interface MarketingCtaBonusProps {
  bonus: MarketingBonus;
  language?: Language;
  onOpenChecklistModal: () => void;
}

const TelegramIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
  </svg>
);

const VkIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M15.07 2H8.93C4.33 2 2 4.33 2 8.93v6.14C2 19.67 4.33 22 8.93 22h6.14c4.6 0 6.93-2.33 6.93-6.93V8.93C22 4.33 19.67 2 15.07 2zm3.39 13.91h-1.64c-.62 0-.81-.49-1.92-1.6-.97-.94-1.4-1.06-1.64-1.06-.34 0-.44.1-.44.57v1.44c0 .39-.13.65-1.17.65-1.72 0-3.63-1.05-4.98-3.01-2.04-2.89-2.61-5.07-2.61-5.51 0-.25.1-.48.58-.48h1.64c.44 0 .61.2.78.68.86 2.49 2.3 4.67 2.89 4.67.22 0 .32-.1.32-.66V9.45c-.07-1.17-.68-1.27-.68-1.69 0-.2.17-.4.44-.4h2.76c.37 0 .5.2.5.64v3.47c0 .37.16.5.27.5.23 0 .42-.13.84-.55 1.3-1.46 2.23-3.7 2.23-3.7.12-.25.33-.48.77-.48h1.64c.5 0 .61.25.5.64-.21.99-2.28 3.88-2.38 4.04-.21.32-.3.46 0 .86.21.29.93.91 1.41 1.46.88.99 1.55 1.82 1.73 2.39.18.57-.1.86-.66.86z" />
  </svg>
);

export const MarketingCtaBonus: React.FC<MarketingCtaBonusProps> = ({
  bonus,
  language = 'ru',
  onOpenChecklistModal,
}) => {
  const t = TRANSLATIONS[language];
  const [consultationRequested, setConsultationRequested] = useState(false);
  const [userContact, setUserContact] = useState('');

  const handleConsultationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userContact.trim()) return;
    setConsultationRequested(true);
  };

  const telegramUrl = 'https://t.me/sites_ai_tasks';
  const vkUrl = 'https://vk.ru/id1130637537';
  const portfolioUrl = 'https://vitwill.github.io/';

  return (
    <div className="bg-white border border-[#ded7cb] rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex items-center space-x-2 text-emerald-800 font-bold text-xs uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>{t.marketing.badge}</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-stone-900 mb-2">
          {bonus.title || t.marketing.leadTitle}
        </h3>

        <p className="text-sm text-stone-600 max-w-3xl leading-relaxed mb-6 font-medium">
          {bonus.bonusText ||
            'Экспресс-аудит выявил ключевые точки роста. Чтобы системно обойти конкурентов, скачайте наш расширенный чеклист на 50+ параметров и подпишитесь на Telegram-канал «Сайты для бизнеса | AI и задачи» (@sites_ai_tasks).'}
        </p>

        {/* Feature Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {t.marketing.features.map((feature, idx) => (
            <div key={idx} className="flex items-center space-x-2.5 bg-[#faf8f5] border border-[#e5dfd5] p-3 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span className="text-xs font-bold text-stone-800">{feature}</span>
            </div>
          ))}
        </div>

        {/* Social Icons & Action Row */}
        <div className="pt-4 border-t border-[#ece7de] space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Social Network Badges Group */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              <span className="text-xs font-bold text-stone-500 mr-1 hidden sm:inline">
                {t.marketing.socialConnect}
              </span>

              {/* Telegram */}
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Telegram: https://t.me/sites_ai_tasks (@sites_ai_tasks)"
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#229ed9] hover:bg-[#1a8bc0] text-white transition shadow-xs hover:shadow-sm hover:scale-[1.02] transform cursor-pointer"
              >
                <TelegramIcon className="w-4 h-4" />
                <span>{t.marketing.telegramBtn}</span>
              </a>

              {/* VK */}
              <a
                href={vkUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="ВКонтакте: https://vk.ru/id1130637537"
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#0077ff] hover:bg-[#0066dd] text-white transition shadow-xs hover:shadow-sm hover:scale-[1.02] transform cursor-pointer"
              >
                <VkIcon className="w-4 h-4" />
                <span>{t.marketing.vkBtn}</span>
              </a>

              {/* Portfolio */}
              <a
                href={portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Портфолио: https://vitwill.github.io/"
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#2d2822] hover:bg-[#1a1714] text-white transition shadow-xs hover:shadow-sm hover:scale-[1.02] transform cursor-pointer"
              >
                <Globe className="w-4 h-4 text-emerald-400" />
                <span>{t.marketing.portfolioBtn}</span>
              </a>
            </div>

            {/* Interactive Checklist CTA */}
            <button
              onClick={onOpenChecklistModal}
              className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#faf8f5] hover:bg-[#f3efe6] border border-[#ded7cb] text-stone-800 transition cursor-pointer self-start sm:self-auto"
            >
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>{t.marketing.openChecklist}</span>
            </button>
          </div>
        </div>

        {/* Consultation Lead Form */}
        <div className="mt-6 pt-5 border-t border-[#ece7de]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-stone-900 block">
                {t.marketing.leadTitle}
              </span>
              <p className="text-xs text-stone-500 font-medium">
                {t.marketing.leadSubtitle}
              </p>
            </div>

            {consultationRequested ? (
              <div className="flex items-center space-x-2 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-4 py-2.5 rounded-xl">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <span>{t.marketing.leadSent}</span>
              </div>
            ) : (
              <form onSubmit={handleConsultationSubmit} className="flex gap-2">
                <input
                  type="text"
                  placeholder={t.marketing.leadPlaceholder}
                  value={userContact}
                  onChange={(e) => setUserContact(e.target.value)}
                  className="px-3 py-2 bg-[#faf8f5] border border-[#ded7cb] rounded-xl text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-700 w-52"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#2d2822] hover:bg-[#1a1714] text-white rounded-xl text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
                >
                  <span>{t.marketing.leadBtn}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
