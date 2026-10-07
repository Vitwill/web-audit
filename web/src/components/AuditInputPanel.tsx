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
    <section className="pt-8 sm:pt-16 pb-8">
      <div className="max-w-3xl mx-auto">
        {/* Логотип-заголовок */}
        <div className="flex justify-center mb-8 sm:mb-10">
          <img
            src={`${import.meta.env.BASE_URL}vitwill-logo.png`}
            alt="VITWILL"
            className="h-14 sm:h-20 w-auto"
          />
        </div>

        {/* Крупный заголовок */}
        <h1 className="text-center text-2xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[#1d1d1f] mb-4 sm:mb-6">
          {t.heading}
        </h1>

        <p className="text-center text-base sm:text-lg text-[#6e6e73] max-w-xl mx-auto mb-10 sm:mb-14 leading-relaxed">
          {t.subtitle}
        </p>

        {/* Баннер при исчерпании квоты */}
        {quotaExhausted ? (
          <div className="max-w-2xl mx-auto">
            <div className="p-8 sm:p-10 bg-white rounded-3xl border border-[#e5e5e7] shadow-apple text-center">
              <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-[#fff3e0] flex items-center justify-center">
                <Lock className="w-7 h-7 text-[#ff9500]" />
              </div>

              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#1d1d1f] mb-3">
                {t.exhaustedTitle}
              </h2>

              <p className="text-sm sm:text-base text-[#6e6e73] leading-relaxed mb-8 max-w-md mx-auto">
                {t.exhaustedText}
              </p>

              <a
                href={telegramBotUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl text-base font-medium text-white bg-[#0071e3] hover:bg-[#0077ed] transition-apple cursor-pointer mb-3"
              >
                <span>{t.subscribeBtn}</span>
              </a>

              <div>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="text-xs font-medium text-[#86868b] hover:text-[#1d1d1f] transition-apple cursor-pointer"
                >
                  {t.refreshBtn}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder={t.placeholder}
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  disabled={isLoading}
                  className="flex-1 px-5 py-4 bg-white border border-[#d2d2d7] rounded-2xl text-base text-[#1d1d1f] placeholder-[#86868b] focus:outline-none focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/20 transition-apple disabled:opacity-60"
                  autoComplete="url"
                  spellCheck={false}
                />
                <button
                  type="submit"
                  disabled={isLoading || !urlInput.trim()}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-medium text-base bg-[#0071e3] hover:bg-[#0077ed] text-white disabled:opacity-40 disabled:cursor-not-allowed transition-apple cursor-pointer whitespace-nowrap"
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
                <div className="inline-flex p-1 bg-[#f5f5f7] rounded-full">
                  <button
                    type="button"
                    onClick={() => onDeviceChange('mobile')}
                    className={`px-4 py-1.5 text-xs font-medium rounded-full transition-apple cursor-pointer ${
                      device === 'mobile'
                        ? 'bg-white text-[#1d1d1f] shadow-sm'
                        : 'text-[#6e6e73] hover:text-[#1d1d1f]'
                    }`}
                  >
                    {t.mobile}
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeviceChange('desktop')}
                    className={`px-4 py-1.5 text-xs font-medium rounded-full transition-apple cursor-pointer ${
                      device === 'desktop'
                        ? 'bg-white text-[#1d1d1f] shadow-sm'
                        : 'text-[#6e6e73] hover:text-[#1d1d1f]'
                    }`}
                  >
                    {t.desktop}
                  </button>
                </div>
              </div>

              {isLoading && loadingStepText && (
                <div className="pt-4 flex items-center justify-center gap-3 text-sm text-[#6e6e73]">
                  <Loader2 className="w-4 h-4 animate-spin text-[#0071e3]" />
                  <span>{loadingStepText}</span>
                </div>
              )}
            </form>

            {!isLoading && (
              <div className="pt-6 text-center">
                {quotaUnlimited ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#34c759]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {t.quotaUnlimited}
                  </span>
                ) : quotaRemaining !== null ? (
                  <span className="text-xs font-medium text-[#86868b]">
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