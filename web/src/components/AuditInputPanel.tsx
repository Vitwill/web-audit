import React, { useState } from 'react';
import { DeviceType, Language } from '../types/seo';
import { Search, Loader2, Lock, CheckCircle2 } from 'lucide-react';

interface AuditInputPanelProps {
  onStartAudit: (params: any) => Promise<void>;
  isLoading: boolean;
  loadingStepText: string;
  device: DeviceType;
  onDeviceChange: (device: DeviceType) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  quotaRemaining?: number | null;
  quotaExhausted?: boolean;
  quotaUnlimited?: boolean;
  userId?: string;
}

export const AuditInputPanel: React.FC<AuditInputPanelProps> = ({
  onStartAudit,
  isLoading,
  loadingStepText,
  device,
  onDeviceChange,
  language,
  quotaRemaining = null,
  quotaExhausted = false,
  quotaUnlimited = false,
  userId = '',
}) => {
  const [urlInput, setUrlInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim() || isLoading || quotaExhausted) return;

    await onStartAudit({
      url: urlInput.trim(),
      device,
      lang: language,
    });
  };

  // Ссылка на бота с UUID (если UUID есть)
  const telegramBotUrl = userId
    ? `https://t.me/vitwill_audit_bot?start=${userId}`
    : 'https://t.me/vitwill_audit_bot';

  // Тексты
  const t = {
    heading:
      language === 'en'
        ? 'Express website audit'
        : language === 'de'
        ? 'Express-Website-Audit'
        : 'Экспресс-аудит сайта',
    subtitle:
      language === 'en'
        ? 'Deep SEO analysis, Core Web Vitals, structure and content — in 30 seconds'
        : language === 'de'
        ? 'Tiefe SEO-Analyse, Core Web Vitals, Struktur und Inhalt — in 30 Sekunden'
        : 'Глубокий SEO-анализ, Core Web Vitals, структура и контент — за 30 секунд',
    placeholder:
      language === 'en'
        ? 'Enter page URL'
        : language === 'de'
        ? 'Seiten-URL eingeben'
        : 'Укажите URL страницы',
    button:
      language === 'en'
        ? 'Run audit'
        : language === 'de'
        ? 'Audit starten'
        : 'Запустить аудит',
    buttonLoading:
      language === 'en'
        ? 'Analyzing...'
        : language === 'de'
        ? 'Analyse läuft...'
        : 'Анализируем...',
    mobile:
      language === 'en' ? 'Mobile' : language === 'de' ? 'Mobil' : 'Смартфон',
    desktop:
      language === 'en' ? 'Desktop' : language === 'de' ? 'Desktop' : 'Компьютер',
    quotaRemaining:
      language === 'en'
        ? `Free audits remaining: ${quotaRemaining}`
        : language === 'de'
        ? `Verbleibende kostenlose Audits: ${quotaRemaining}`
        : `Осталось бесплатных проверок: ${quotaRemaining}`,
    quotaUnlimited:
      language === 'en'
        ? 'Subscription active — unlimited access'
        : language === 'de'
        ? 'Abo aktiv — unbegrenzter Zugang'
        : 'Подписка активна — безлимитный доступ',
    exhaustedTitle:
      language === 'en'
        ? 'Free limit reached'
        : language === 'de'
        ? 'Kostenloses Limit erreicht'
        : 'Бесплатный лимит исчерпан',
    exhaustedText:
      language === 'en'
        ? 'You have used all 5 free audits. Subscribe to continue using the service.'
        : language === 'de'
        ? 'Sie haben alle 5 kostenlosen Audits aufgebraucht. Abonnieren Sie, um den Dienst weiter zu nutzen.'
        : 'Вы использовали все 5 бесплатных аудитов. Оформите подписку, чтобы продолжить использование сервиса.',
    subscribeBtn:
      language === 'en'
        ? 'Subscribe via Telegram'
        : language === 'de'
        ? 'Über Telegram abonnieren'
        : 'Оформить подписку через Telegram',
    refreshBtn:
      language === 'en'
        ? 'Refresh status'
        : language === 'de'
        ? 'Status aktualisieren'
        : 'Обновить статус',
  };

  return (
    <section className="pt-10 sm:pt-20 pb-8">
      <div className="max-w-3xl mx-auto">
        {/* Логотип-заголовок */}
        <div className="flex justify-center mb-10 sm:mb-12">
          <img
            src={`${import.meta.env.BASE_URL}vitwill-logo.png`}
            alt="VITWILL"
            className="h-16 sm:h-20 w-auto grayscale hover:grayscale-0 transition-all duration-500"
          />
        </div>

        {/* Крупный заголовок с акцентом */}
        <h1 className="text-center font-display text-[clamp(32px,5vw,52px)] font-medium tracking-[-0.04em] leading-[1.05] text-[#0E0E0E] mb-6">
          {t.heading.split(' ').map((word, i) => 
            word === 'сайта' || word === 'website' ? (
              <em key={i} className="font-serif italic font-normal text-[#C1440E]">{word} </em>
            ) : (
              <span key={i}>{word} </span>
            )
          )}
        </h1>

        <p className="text-center text-[16px] text-[rgba(14,14,14,0.68)] max-w-xl mx-auto mb-12 sm:mb-16 leading-relaxed">
          {t.subtitle}
        </p>

        {/* Баннер при исчерпании квоты */}
        {quotaExhausted ? (
          <div className="max-w-2xl mx-auto">
            <div className="p-8 sm:p-10 bg-[#EFEBE3] rounded-sm border border-[rgba(14,14,14,0.22)] text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#F5F2EC] border border-[rgba(14,14,14,0.14)] flex items-center justify-center">
                <Lock className="w-6 h-6 text-[#C1440E]" />
              </div>

              <h2 className="font-display text-2xl font-medium tracking-[-0.02em] text-[#0E0E0E] mb-3">
                {t.exhaustedTitle}
              </h2>

              <p className="text-[15px] text-[rgba(14,14,14,0.68)] leading-relaxed mb-8 max-w-md mx-auto">
                {t.exhaustedText}
              </p>

              <a
                href={telegramBotUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-sm font-mono text-[12px] tracking-[0.16em] uppercase font-medium text-[#F5F2EC] bg-[#0E0E0E] hover:bg-[#C1440E] transition-colors cursor-pointer mb-4"
              >
                <span>{t.subscribeBtn}</span>
              </a>

              <div>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="font-mono text-[11px] tracking-[0.1em] uppercase text-[rgba(14,14,14,0.45)] hover:text-[#0E0E0E] transition-colors cursor-pointer"
                >
                  {t.refreshBtn}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder={t.placeholder}
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  disabled={isLoading}
                  className="flex-1 px-5 py-4 bg-[#EFEBE3] border border-[rgba(14,14,14,0.22)] rounded-sm text-[16px] text-[#0E0E0E] placeholder-[rgba(14,14,14,0.45)] focus:outline-none focus:border-[#C1440E] focus:ring-1 focus:ring-[#C1440E] focus:bg-[#F5F2EC] transition-all disabled:opacity-60"
                  autoComplete="url"
                  spellCheck={false}
                />
                <button
                  type="submit"
                  disabled={isLoading || !urlInput.trim()}
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-sm font-mono text-[12px] tracking-[0.16em] uppercase bg-[#0E0E0E] hover:bg-[#C1440E] text-[#F5F2EC] disabled:opacity-40 disabled:hover:bg-[#0E0E0E] disabled:cursor-not-allowed transition-colors cursor-pointer whitespace-nowrap"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{t.buttonLoading}</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      <span>{t.button}</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex justify-center pt-2">
                <div className="inline-flex bg-[#EFEBE3] border border-[rgba(14,14,14,0.22)] rounded-sm p-1 gap-1">
                  <button
                    type="button"
                    onClick={() => onDeviceChange('mobile')}
                    className={`px-6 py-2 font-mono text-[11px] tracking-[0.1em] uppercase rounded-sm transition-all cursor-pointer ${
                      device === 'mobile'
                        ? 'bg-[#0E0E0E] text-[#F5F2EC]'
                        : 'text-[rgba(14,14,14,0.68)] hover:text-[#0E0E0E]'
                    }`}
                  >
                    {t.mobile}
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeviceChange('desktop')}
                    className={`px-6 py-2 font-mono text-[11px] tracking-[0.1em] uppercase rounded-sm transition-all cursor-pointer ${
                      device === 'desktop'
                        ? 'bg-[#0E0E0E] text-[#F5F2EC]'
                        : 'text-[rgba(14,14,14,0.68)] hover:text-[#0E0E0E]'
                    }`}
                  >
                    {t.desktop}
                  </button>
                </div>
              </div>

              {isLoading && loadingStepText && (
                <div className="pt-6 flex items-center justify-center gap-3 font-mono text-[11px] tracking-[0.1em] uppercase text-[rgba(14,14,14,0.68)]">
                  <Loader2 className="w-4 h-4 animate-spin text-[#C1440E]" />
                  <span>{loadingStepText}</span>
                </div>
              )}
            </form>

            {!isLoading && (
              <div className="pt-8 text-center">
                {quotaUnlimited ? (
                  <span className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.1em] uppercase text-[#1e5c2a]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {t.quotaUnlimited}
                  </span>
                ) : quotaRemaining !== null ? (
                  <span className="font-mono text-[11px] tracking-[0.1em] uppercase text-[rgba(14,14,14,0.45)]">
                    {t.quotaRemaining}
                  </span>
                ) : null}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};
