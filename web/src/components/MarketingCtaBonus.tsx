import React, { useState } from 'react';
import { MarketingBonus, Language } from '../types/seo';
import { CheckCircle2, UserCheck, ArrowRight } from 'lucide-react';

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

  const t = {
    badge:
      language === 'en'
        ? 'Expert bonus'
        : language === 'de'
        ? 'Experten-Bonus'
        : 'Маркетинговый бонус',
    sectionTitle:
      language === 'en'
        ? 'Reach TOP-3 and scale organic traffic'
        : language === 'de'
        ? 'TOP-3 erreichen und organischen Traffic skalieren'
        : 'Хотите вывести сайт в ТОП-3 и масштабировать органический трафик?',
    leadTitle:
      language === 'en'
        ? 'Need a personal promotion strategy for your website?'
        : language === 'de'
        ? 'Benötigen Sie eine individuelle SEO-Strategie?'
        : 'Нужна персональная стратегия продвижения для вашего сайта?',
    leadSubtitle:
      language === 'en'
        ? 'Leave your contact for a personalized project breakdown'
        : language === 'de'
        ? 'Hinterlassen Sie Ihren Kontakt für eine persönliche Projektanalyse'
        : 'Оставьте контакт для персонального разбора проекта от автора аудита',
    leadSent:
      language === 'en'
        ? 'Request received! We will contact you shortly.'
        : language === 'de'
        ? 'Anfrage erhalten! Wir melden uns in Kürze.'
        : 'Заявка принята! Свяжемся с вами в течение рабочего дня.',
    leadPlaceholder:
      language === 'en' ? '@telegram or phone' : language === 'de' ? '@telegram oder Telefon' : '@telegram или телефон',
    leadBtn:
      language === 'en'
        ? 'Request consultation'
        : language === 'de'
        ? 'Beratung anfordern'
        : 'Получить консультацию',
    telegramBtn: 'Telegram',
    vkBtn: language === 'en' ? 'VK' : language === 'de' ? 'VK' : 'ВКонтакте',
    portfolioBtn: language === 'en' ? 'Portfolio' : language === 'de' ? 'Portfolio' : 'Портфолио',
    checklistBtn:
      language === 'en'
        ? 'Open checklist'
        : language === 'de'
        ? 'Checkliste öffnen'
        : 'Открыть чеклист',
  };

  return (
    <section className="max-w-4xl mx-auto">
      <div className="p-8 sm:p-10 bg-white rounded-3xl border border-[#e5e5e7] shadow-apple">
        {/* ---------- Заголовок секции ---------- */}
        <div className="text-xs font-medium uppercase tracking-widest text-[#86868b] mb-3">
          {t.badge}
        </div>
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1d1d1f] mb-4">
          {bonus.title || t.sectionTitle}
        </h2>
        <p className="text-sm sm:text-base text-[#6e6e73] leading-relaxed mb-8 max-w-2xl">
          {bonus.bonusText}
        </p>

        {/* ---------- Кнопки соцсетей и чеклиста — в один ряд ---------- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-medium text-white bg-[#0071e3] hover:bg-[#0077ed] transition-apple cursor-pointer"
          >
            <TelegramIcon className="w-4 h-4" />
            <span>{t.telegramBtn}</span>
          </a>

          <a
            href={vkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-medium text-white bg-[#0077ff] hover:bg-[#0066dd] transition-apple cursor-pointer"
          >
            <VkIcon className="w-4 h-4" />
            <span>{t.vkBtn}</span>
          </a>

          <a
            href={portfolioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-medium text-[#1d1d1f] bg-[#f5f5f7] hover:bg-[#e8e8ed] transition-apple cursor-pointer"
          >
            <span>{t.portfolioBtn}</span>
          </a>

          <button
            onClick={onOpenChecklistModal}
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-medium text-[#1d1d1f] bg-[#f5f5f7] hover:bg-[#e8e8ed] transition-apple cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-[#0071e3]" />
            <span>{t.checklistBtn}</span>
          </button>
        </div>

        {/* ---------- Форма обратной связи ---------- */}
        <div className="pt-8 border-t border-[#e5e5e7]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="text-sm font-semibold text-[#1d1d1f] mb-1">
                {t.leadTitle}
              </div>
              <p className="text-xs text-[#6e6e73]">{t.leadSubtitle}</p>
            </div>

            {consultationRequested ? (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#e8f8ee] text-[#1d1d1f] text-sm">
                <UserCheck className="w-4 h-4 text-[#34c759]" />
                <span>{t.leadSent}</span>
              </div>
            ) : (
              <form onSubmit={handleConsultationSubmit} className="flex gap-2 shrink-0">
                <input
                  type="text"
                  placeholder={t.leadPlaceholder}
                  value={userContact}
                  onChange={(e) => setUserContact(e.target.value)}
                  className="px-4 py-2.5 rounded-2xl text-sm bg-[#f5f5f7] border border-transparent focus:border-[#0071e3] focus:bg-white focus:outline-none transition-apple w-56"
                  required
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-sm font-medium text-white bg-[#1d1d1f] hover:bg-[#000] transition-apple cursor-pointer whitespace-nowrap"
                >
                  <span>{t.leadBtn}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};