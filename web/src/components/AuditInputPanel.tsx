import React, { useState } from 'react';
import { DeviceType, Language } from '../types/seo';
import { Search, Loader2 } from 'lucide-react';

interface AuditInputPanelProps {
  onStartAudit: (params: any) => Promise<void>;
  isLoading: boolean;
  loadingStepText: string;
  device: DeviceType;
  onDeviceChange: (device: DeviceType) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export const AuditInputPanel: React.FC<AuditInputPanelProps> = ({
  onStartAudit,
  isLoading,
  loadingStepText,
  device,
  onDeviceChange,
  language,
}) => {
  const [urlInput, setUrlInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim() || isLoading) return;

    await onStartAudit({
      url: urlInput.trim(),
      device,
      lang: language,
    });
  };

  const text = {
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
  };

  return (
    <section className="pt-8 sm:pt-16 pb-8">
      <div className="max-w-3xl mx-auto">
        {/* ---------- Логотип-заголовок ---------- */}
        <div className="flex justify-center mb-8 sm:mb-10">
          <img
            src={`${import.meta.env.BASE_URL}vitwill-logo.png`}
            alt="VITWILL"
            className="h-14 sm:h-20 w-auto"
          />
        </div>

        {/* ---------- Крупный заголовок ---------- */}
        <h1 className="text-center text-2xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[#1d1d1f] mb-4 sm:mb-6">
          {text.heading}
        </h1>

        {/* ---------- Подзаголовок ---------- */}
        <p className="text-center text-base sm:text-lg text-[#6e6e73] max-w-xl mx-auto mb-10 sm:mb-14 leading-relaxed">
          {text.subtitle}
        </p>

        {/* ---------- Форма ---------- */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder={text.placeholder}
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
                  <span>{text.buttonLoading}</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>{text.button}</span>
                </>
              )}
            </button>
          </div>

          {/* ---------- Переключатель устройства ---------- */}
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
                {text.mobile}
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
                {text.desktop}
              </button>
            </div>
          </div>

          {/* ---------- Строка прогресса ---------- */}
          {isLoading && loadingStepText && (
            <div className="pt-4 flex items-center justify-center gap-3 text-sm text-[#6e6e73]">
              <Loader2 className="w-4 h-4 animate-spin text-[#0071e3]" />
              <span>{loadingStepText}</span>
            </div>
          )}
        </form>
      </div>
    </section>
  );
};