import React from 'react';
import { Send, Sparkles, Smartphone, Laptop, Globe } from 'lucide-react';
import { Language, DeviceType } from '../types/seo';
import { TRANSLATIONS } from '../data/translations';
import vitwillLogo from '../assets/images/vitwill_logo_1790919219070.jpg';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  device?: DeviceType;
  onDeviceChange?: (device: DeviceType) => void;
  onOpenChecklistModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  device = 'mobile',
  onDeviceChange,
  onOpenChecklistModal,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <header className="border-b border-[#ded7cb] bg-[#efebe3]/95 backdrop-blur-md sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-3">
        {/* Brand with Telegram Channel Visual Identity */}
        <div className="flex items-center space-x-3 min-w-0">
          {/* User Brand Logo: VITWILL Icon */}
          <a
            href="https://vitwill.github.io/"
            target="_blank"
            rel="noopener noreferrer"
            title="VITWILL • Портфолио & Сайты для бизнеса"
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden flex items-center justify-center shadow-xs flex-shrink-0 hover:scale-105 transition transform cursor-pointer border border-[#ded7cb] bg-white group"
          >
            <img
              src={vitwillLogo}
              alt="VITWILL Logo"
              className="w-full h-full object-cover group-hover:opacity-95 transition-opacity"
              referrerPolicy="no-referrer"
            />
          </a>

          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <a
                href="https://t.me/sites_ai_tasks"
                target="_blank"
                rel="noopener noreferrer"
                className="font-black text-base sm:text-lg tracking-tight text-stone-900 hover:text-stone-700 transition truncate"
              >
                {t.header.brandTitle}
              </a>
            </div>
            <p className="text-xs text-stone-600 truncate font-medium hidden sm:block">
              {t.header.brandSubtitle}
            </p>
          </div>
        </div>

        {/* Right Actions: Language Switcher + Device + Telegram Channel */}
        <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
          {/* Language Switcher (RU / EN / DE) */}
          <div className="flex items-center p-1 bg-[#e3ded4] rounded-xl border border-[#d5cec2] shadow-2xs">
            <button
              type="button"
              onClick={() => onLanguageChange('ru')}
              title="Русский язык отчета"
              className={`flex items-center space-x-1 px-2 sm:px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                language === 'ru'
                  ? 'bg-white text-stone-900 shadow-xs border border-[#ded7cb]'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span>🇷🇺</span>
              <span className="hidden xs:inline">RU</span>
            </button>

            <button
              type="button"
              onClick={() => onLanguageChange('en')}
              title="English Report"
              className={`flex items-center space-x-1 px-2 sm:px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                language === 'en'
                  ? 'bg-white text-stone-900 shadow-xs border border-[#ded7cb]'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span>🇬🇧</span>
              <span className="hidden xs:inline">EN</span>
            </button>

            <button
              type="button"
              onClick={() => onLanguageChange('de')}
              title="Deutscher Bericht"
              className={`flex items-center space-x-1 px-2 sm:px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                language === 'de'
                  ? 'bg-white text-stone-900 shadow-xs border border-[#ded7cb]'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span>🇩🇪</span>
              <span className="hidden xs:inline">DE</span>
            </button>
          </div>

          {/* Device Switcher (Mobile / Desktop) */}
          {onDeviceChange && (
            <div className="hidden md:flex items-center p-1 bg-[#e3ded4] rounded-xl border border-[#d5cec2] shadow-2xs">
              <button
                type="button"
                onClick={() => onDeviceChange('mobile')}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  device === 'mobile'
                    ? 'bg-white text-stone-900 shadow-xs border border-[#ded7cb]'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
                <span>Mobile</span>
              </button>
              <button
                type="button"
                onClick={() => onDeviceChange('desktop')}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  device === 'desktop'
                    ? 'bg-white text-stone-900 shadow-xs border border-[#ded7cb]'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Laptop className="w-3.5 h-3.5 text-indigo-600" />
                <span>Desktop</span>
              </button>
            </div>
          )}

          {/* Telegram Channel Button */}
          <a
            href="https://t.me/sites_ai_tasks"
            target="_blank"
            rel="noopener noreferrer"
            title="Перейти в Telegram-канал @sites_ai_tasks"
            className="inline-flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold text-white bg-[#229ed9] hover:bg-[#1f8fc4] transition shadow-xs cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">@sites_ai_tasks</span>
            <span className="sm:hidden">Telegram</span>
          </a>

          {/* Checklist Modal CTA */}
          {onOpenChecklistModal && (
            <button
              onClick={onOpenChecklistModal}
              className="hidden lg:inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#2d2822] hover:bg-[#1f1b17] text-white transition shadow-xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.header.checklistBtn}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
