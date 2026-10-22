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
    <header className="sticky top-0 z-40 glass">
      <div className="max-w-[1440px] mx-auto px-5 md:px-10 h-[73px] flex items-center justify-between gap-4">
        
        {/* ---------- Слева: логотип + название ---------- */}
        <div className="flex items-center gap-4 min-w-0">
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
              className="h-7 w-auto"
            />
          </a>
          <span className="hidden md:block font-display text-[17px] font-semibold tracking-[-0.02em] text-[#0E0E0E] truncate">
            Сайты для бизнеса <em className="font-serif italic text-[#C1440E]">| AI и задачи</em>
          </span>
        </div>

        {/* ---------- Справа: языки, чеклист, Telegram ---------- */}
        <div className="flex items-center gap-3 sm:gap-6">
          <nav className="flex items-center gap-1.5" aria-label="Language switcher">
            {languages.map(({ code, label }) => (
              <button
                key={code}
                type="button"
                onClick={() => onLanguageChange(code)}
                className={`px-2.5 py-1 font-mono text-[11px] tracking-[0.1em] border rounded-sm transition-colors cursor-pointer ${
                  language === code
                    ? 'bg-[#0E0E0E] text-[#F5F2EC] border-[#0E0E0E]'
                    : 'text-[rgba(14,14,14,0.68)] border-transparent hover:border-[rgba(14,14,14,0.22)] hover:text-[#0E0E0E]'
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
              className="hidden lg:inline-block font-mono text-[11px] tracking-[0.14em] uppercase text-[rgba(14,14,14,0.68)] hover:text-[#0E0E0E] transition-colors cursor-pointer"
            >
              Чеклист
            </button>
          )}

          <a
            href="https://t.me/sites_ai_tasks"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-sm font-mono text-[11px] tracking-[0.16em] uppercase font-medium text-[#F5F2EC] bg-[#0E0E0E] hover:bg-[#C1440E] transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Telegram</span>
          </a>
        </div>
      </div>
    </header>
  );
};
