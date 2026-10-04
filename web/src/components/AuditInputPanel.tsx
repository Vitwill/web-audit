import React, { useState } from 'react';
import { PRESET_CASES, PresetCase } from '../data/presets';
import { DeviceType, Language } from '../types/seo';
import { TRANSLATIONS } from '../data/translations';
import {
  Globe,
  Code2,
  Sliders,
  Sparkles,
  Loader2,
  Search,
  Smartphone,
  Laptop,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

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
  onLanguageChange,
}) => {
  const t = TRANSLATIONS[language];
  const [activeTab, setActiveTab] = useState<'url' | 'html' | 'manual' | 'presets'>('url');

  // URL state
  const [urlInput, setUrlInput] = useState('');
  const [targetKeywords, setTargetKeywords] = useState('');

  // HTML state
  const [htmlInput, setHtmlInput] = useState('');
  const [htmlPageUrl, setHtmlPageUrl] = useState('');

  // Manual state
  const [manualTitle, setManualTitle] = useState('');
  const [manualDescription, setManualDescription] = useState('');
  const [manualH1, setManualH1] = useState('');
  const [manualH2, setManualH2] = useState('');
  const [manualContent, setManualContent] = useState('');
  const [manualHasSsl, setManualHasSsl] = useState(true);
  const [manualRobots, setManualRobots] = useState('index, follow');
  const [manualViewport, setManualViewport] = useState('width=device-width, initial-scale=1.0');

  // Load preset handler
  const loadPreset = (preset: PresetCase) => {
    setUrlInput(preset.data.url);
    setTargetKeywords(preset.data.targetKeywords);
    setManualTitle(preset.data.title);
    setManualDescription(preset.data.description);
    setManualH1(preset.data.h1);
    setManualH2(preset.data.h2List.join(', '));
    setManualContent(preset.data.contentText);
    setManualHasSsl(preset.data.hasSsl);
    setManualRobots(preset.data.robots);
    setManualViewport(preset.data.viewport);
    setActiveTab('url');
  };

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    await onStartAudit({
      url: urlInput.trim(),
      targetKeywords: targetKeywords.trim(),
      device,
      lang: language,
    });
  };

  const handleHtmlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!htmlInput.trim()) return;

    await onStartAudit({
      url: htmlPageUrl.trim() || 'https://local-page.dev',
      html: htmlInput.trim(),
      targetKeywords: targetKeywords.trim(),
      device,
      lang: language,
    });
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const h2Array = manualH2
      ? manualH2.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    await onStartAudit({
      url: urlInput.trim() || 'https://example-site.dev',
      title: manualTitle.trim(),
      description: manualDescription.trim(),
      h1: manualH1.trim(),
      h2List: h2Array,
      contentText: manualContent.trim(),
      hasSsl: manualHasSsl,
      robots: manualRobots.trim(),
      viewport: manualViewport.trim(),
      targetKeywords: targetKeywords.trim(),
      device,
      lang: language,
    });
  };

  return (
    <div className="bg-white border border-[#ded7cb] rounded-2xl p-6 sm:p-7 shadow-xs">
      {/* Device Strategy, Language, and Input Mode Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5 pb-4 border-b border-[#ece7de]">
        {/* Input Mode Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
              activeTab === 'url'
                ? 'bg-[#2d2822] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-[#faf8f5]'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>{t.inputPanel.tabUrl}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('html')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
              activeTab === 'html'
                ? 'bg-[#2d2822] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-[#faf8f5]'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>{t.inputPanel.tabHtml}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('manual')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
              activeTab === 'manual'
                ? 'bg-[#2d2822] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-[#faf8f5]'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>{t.inputPanel.tabConstructor}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
              activeTab === 'presets'
                ? 'bg-[#2d2822] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-[#faf8f5]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{t.inputPanel.tabPresets}</span>
          </button>
        </div>

        {/* Device Switcher & Language Selector */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Language Selector */}
          <div className="flex items-center space-x-1 p-1 bg-[#f3efe6] rounded-xl border border-[#ded7cb]">
            <span className="text-[11px] font-bold text-stone-500 px-2 hidden sm:inline">
              {t.inputPanel.langLabel}
            </span>
            <button
              type="button"
              onClick={() => onLanguageChange('ru')}
              title="Русский язык отчета"
              className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                language === 'ru'
                  ? 'bg-white text-stone-900 shadow-2xs border border-[#ded7cb]'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span>🇷🇺</span>
              <span>RU</span>
            </button>
            <button
              type="button"
              onClick={() => onLanguageChange('en')}
              title="English Report"
              className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                language === 'en'
                  ? 'bg-white text-stone-900 shadow-2xs border border-[#ded7cb]'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span>🇬🇧</span>
              <span>EN</span>
            </button>
            <button
              type="button"
              onClick={() => onLanguageChange('de')}
              title="Deutscher Bericht"
              className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                language === 'de'
                  ? 'bg-white text-stone-900 shadow-2xs border border-[#ded7cb]'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span>🇩🇪</span>
              <span>DE</span>
            </button>
          </div>

          {/* Device Switcher (Mobile vs Desktop) */}
          <div className="flex items-center space-x-1 p-1 bg-[#f3efe6] rounded-xl border border-[#ded7cb]">
            <button
              type="button"
              onClick={() => onDeviceChange('mobile')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                device === 'mobile'
                  ? 'bg-white text-stone-900 shadow-2xs border border-[#ded7cb]'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
              <span>{t.inputPanel.mobile}</span>
            </button>

            <button
              type="button"
              onClick={() => onDeviceChange('desktop')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                device === 'desktop'
                  ? 'bg-white text-stone-900 shadow-2xs border border-[#ded7cb]'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Laptop className="w-3.5 h-3.5 text-indigo-600" />
              <span>{t.inputPanel.desktop}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mode 1: URL Input (Default & Primary) */}
      {activeTab === 'url' && (
        <form onSubmit={handleUrlSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Globe className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder={t.inputPanel.urlPlaceholder}
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-[#faf8f5] border border-[#d6cfc2] rounded-xl text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-800 focus:bg-white transition shadow-2xs"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !urlInput.trim()}
              className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-[#2d2822] hover:bg-[#1a1714] text-white disabled:opacity-50 transition shadow-sm cursor-pointer flex-shrink-0"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                  <span>{t.inputPanel.btnLoading}</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 text-emerald-400" />
                  <span>{t.inputPanel.btnStart}</span>
                </>
              )}
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-600 mb-1.5">
              {t.inputPanel.keywordsLabel}
            </label>
            <input
              type="text"
              placeholder={t.inputPanel.keywordsPlaceholder}
              value={targetKeywords}
              onChange={(e) => setTargetKeywords(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#faf8f5] border border-[#ded7cb] rounded-xl text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-800 focus:bg-white transition"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-stone-500 font-medium">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{t.inputPanel.liveScrapeNote}</span>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('presets')}
              className="text-stone-600 hover:text-stone-900 font-semibold underline underline-offset-2 cursor-pointer"
            >
              {language === 'en' ? 'Or browse sample cases →' : language === 'de' ? 'Oder Beispielfälle ansehen →' : 'Или открыть готовые примеры сайтов →'}
            </button>
          </div>
        </form>
      )}

      {/* Mode 2: HTML Paste */}
      {activeTab === 'html' && (
        <form onSubmit={handleHtmlSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              URL страницы (для корректного расчета сниппетов):
            </label>
            <input
              type="text"
              placeholder="https://example.com/target-page"
              value={htmlPageUrl}
              onChange={(e) => setHtmlPageUrl(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#faf8f5] border border-[#d6cfc2] rounded-xl text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-800 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              {t.inputPanel.htmlLabel}
            </label>
            <textarea
              rows={8}
              placeholder={t.inputPanel.htmlPlaceholder}
              value={htmlInput}
              onChange={(e) => setHtmlInput(e.target.value)}
              className="w-full px-4 py-3 font-mono text-xs bg-[#faf8f5] border border-[#d6cfc2] rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-800 transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-600 mb-1.5">
              {t.inputPanel.keywordsLabel}
            </label>
            <input
              type="text"
              placeholder={t.inputPanel.keywordsPlaceholder}
              value={targetKeywords}
              onChange={(e) => setTargetKeywords(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#faf8f5] border border-[#ded7cb] rounded-xl text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-800 transition"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !htmlInput.trim()}
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-sm bg-[#2d2822] hover:bg-[#1a1714] text-white disabled:opacity-50 transition cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                <span>{t.inputPanel.btnLoading}</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4 text-emerald-400" />
                <span>{t.inputPanel.btnStart}</span>
              </>
            )}
          </button>
        </form>
      )}

      {/* Mode 3: Manual Constructor */}
      {activeTab === 'manual' && (
        <form onSubmit={handleManualSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                URL страницы:
              </label>
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/page"
                className="w-full px-3.5 py-2 bg-[#faf8f5] border border-[#d6cfc2] rounded-xl text-xs text-stone-900 focus:outline-none focus:border-stone-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Тег Title:
              </label>
              <input
                type="text"
                value={manualTitle}
                onChange={(e) => setManualTitle(e.target.value)}
                placeholder="Заголовок страницы (50-60 симв.)"
                className="w-full px-3.5 py-2 bg-[#faf8f5] border border-[#d6cfc2] rounded-xl text-xs text-stone-900 focus:outline-none focus:border-stone-800"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Мета-тег Description:
              </label>
              <textarea
                rows={2}
                value={manualDescription}
                onChange={(e) => setManualDescription(e.target.value)}
                placeholder="Описание страницы для поискового сниппета (140-160 симв.)"
                className="w-full px-3.5 py-2 bg-[#faf8f5] border border-[#d6cfc2] rounded-xl text-xs text-stone-900 focus:outline-none focus:border-stone-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Главный заголовок H1:
              </label>
              <input
                type="text"
                value={manualH1}
                onChange={(e) => setManualH1(e.target.value)}
                placeholder="Основной заголовок на странице"
                className="w-full px-3.5 py-2 bg-[#faf8f5] border border-[#d6cfc2] rounded-xl text-xs text-stone-900 focus:outline-none focus:border-stone-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Подзаголовки H2 (через запятую):
              </label>
              <input
                type="text"
                value={manualH2}
                onChange={(e) => setManualH2(e.target.value)}
                placeholder="Раздел 1, Раздел 2, Раздел 3..."
                className="w-full px-3.5 py-2 bg-[#faf8f5] border border-[#d6cfc2] rounded-xl text-xs text-stone-900 focus:outline-none focus:border-stone-800"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Текстовое содержание страницы:
              </label>
              <textarea
                rows={4}
                value={manualContent}
                onChange={(e) => setManualContent(e.target.value)}
                placeholder="Вставьте основной текст со страницы для анализа релевантности и интентов..."
                className="w-full px-3.5 py-2 bg-[#faf8f5] border border-[#d6cfc2] rounded-xl text-xs text-stone-900 focus:outline-none focus:border-stone-800"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl font-bold text-sm bg-[#2d2822] hover:bg-[#1a1714] text-white disabled:opacity-50 transition cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                <span>{t.inputPanel.btnLoading}</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4 text-emerald-400" />
                <span>{t.inputPanel.btnStart}</span>
              </>
            )}
          </button>
        </form>
      )}

      {/* Mode 4: Presets Showcase Tab */}
      {activeTab === 'presets' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#ece7de] pb-3">
            <div>
              <h4 className="text-sm font-bold text-stone-900">
                {t.inputPanel.presetsTitle}
              </h4>
              <p className="text-xs text-stone-500">
                {t.inputPanel.presetsDesc}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {PRESET_CASES.map((preset) => {
              const categoryName = preset.categoryI18n?.[language] || preset.category;
              const displayName = preset.nameI18n?.[language] || preset.name;
              const displayDesc = preset.descriptionI18n?.[language] || preset.description;

              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => loadPreset(preset)}
                  className="text-left p-4 rounded-xl bg-[#faf8f5] hover:bg-[#f3efe6] border border-[#e5dfd5] transition cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {categoryName}
                      </span>
                      <span className="text-xs text-stone-400 group-hover:text-stone-900 font-bold transition">
                        {t.inputPanel.loadPreset} →
                      </span>
                    </div>
                    <h5 className="text-xs font-bold text-stone-900 line-clamp-1 mb-1">
                      {displayName}
                    </h5>
                    <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed">
                      {displayDesc}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-[#ece7de] text-[10px] font-mono text-stone-400 truncate">
                    {preset.data.url}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Real-time Loading Steps progress banner */}
      {isLoading && (
        <div className="mt-5 p-4 rounded-xl bg-[#faf8f5] border border-[#ded7cb] flex items-center space-x-3 animate-pulse">
          <Loader2 className="w-5 h-5 text-emerald-600 animate-spin flex-shrink-0" />
          <div className="text-xs font-bold text-stone-800">
            {loadingStepText || t.inputPanel.btnLoading}
          </div>
        </div>
      )}
    </div>
  );
};
