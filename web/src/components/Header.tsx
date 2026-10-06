import React from 'react';
import { Send } from 'lucide-react';
import { Language, DeviceType } from '../types/seo';
import { TRANSLATIONS } from '../data/translations';

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
  onOpenChecklistModal,
}) => {
  const t = TRANSLATIONS[language];

  const languages: { code: Language; label: string }[] = [
    { code: 'ru', label: 'RU' },
    { code: 'en', label: 'EN' },
    { code: 'de', label: 'DE' },
  ];

  return (
    <header className="sticky top-0 z-40 glass border-b border-[#e5e5e7]">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
        {/* ---------- Слева: логотип + название ---------- */}
        <div className="flex items-center gap-3 min-w-0">
          <a
            href="https://vitwill.github.io/"
            target="_blank"
            rel="noopener noreferrer"
            title="VITWILL Portfolio"
            className="flex items-center shrink-0 hover:opacity-80 transition-opacity duration-200"
          >
            <img
              src={`${import.meta.env.BASE_URL}vitwill-logo.png`}
              alt="VITWILL"
              className="h-6 w-auto"
            />
          </a>
          <span className="hidden md:block text-sm font-medium text-[#1d1d1f]/80 truncate">
            Сайты для бизнеса | AI и задачи
          </span>
        </div>

        {/* ---------- Справа: языки, чеклист, Telegram ---------- */}
        <div className="flex items-center gap-2 sm:gap-4">
          <nav className="flex items-center gap-1" aria-label="Language switcher">
            {languages.map(({ code, label }) => (
              <button
                key={code}
                type="button"
                onClick={() => onLanguageChange(code)}
                className={`px-2.5 py-1 text-xs font-medium rounded-full transition-apple cursor-pointer ${
                  language === code
                    ? 'bg-[#1d1d1f] text-white'
                    : 'text-[#1d1d1f]/60 hover:text-[#1d1d1f]'
                }`}
                aria-current={language === code}
              >
                {label}
              </button>
            ))}
          </nav>

          {onOpenChecklistModal && (
            <button
              onClick={onOpenChecklistModal}
              className="hidden lg:inline-block text-xs font-medium text-[#1d1d1f]/70 hover:text-[#1d1d1f] transition-apple cursor-pointer"
            >
              Чеклист
            </button>
          )}

          <a
            href="https://t.me/sites_ai_tasks"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium text-white bg-[#0071e3] hover:bg-[#0077ed] transition-apple cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Telegram</span>
          </a>
        </div>
      </div>
    </header>
  );
};