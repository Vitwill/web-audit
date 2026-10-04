import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { AuditInputPanel } from './components/AuditInputPanel';
import { ScoreHero } from './components/ScoreHero';
import { PageSpeedSection } from './components/PageSpeedSection';
import { CriticalErrorsSection } from './components/CriticalErrorsSection';
import { BeforeAfterSection } from './components/BeforeAfterSection';
import { FourPillarsDetail } from './components/FourPillarsDetail';
import { MarketingCtaBonus } from './components/MarketingCtaBonus';
import { ScrapedOverview } from './components/ScrapedOverview';
import { MarkdownExportModal } from './components/MarkdownExportModal';
import { ChecklistModal } from './components/ChecklistModal';
import { AuditResult, AnalyzedData, AuditResponse, DeviceType, Language } from './types/seo';
import { PRESET_CASES } from './data/presets';
import { TRANSLATIONS } from './data/translations';
import { FileText, RotateCcw, AlertCircle, Sparkles, Send, Zap, Smartphone, Laptop, Globe } from 'lucide-react';

export default function App() {
  const [language, setLanguage] = useState<Language>('ru');
  const t = TRANSLATIONS[language];

  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [analyzedData, setAnalyzedData] = useState<AnalyzedData | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStepText, setLoadingStepText] = useState('');
  const [activeDetailTab, setActiveDetailTab] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Device Strategy: 'mobile' | 'desktop'
  const [device, setDevice] = useState<DeviceType>('mobile');

  // Keep track of last audit params to support instant language re-trigger
  const lastParamsRef = useRef<any>(null);

  // Modals
  const [isMarkdownModalOpen, setIsMarkdownModalOpen] = useState(false);
  const [isChecklistModalOpen, setIsChecklistModalOpen] = useState(false);

  // Run audit function
  const executeAudit = async (params: any) => {
    setIsLoading(true);
    setErrorMessage(null);
    setCurrentUrl(params.url || '');
    lastParamsRef.current = params;

    const selectedDevice = params.device || device;
    const selectedLang = params.lang || language;

    const loadingSteps = selectedLang === 'en'
      ? [
          `Connecting to site and parsing HTML (${selectedDevice === 'mobile' ? 'Mobile' : 'Desktop'})...`,
          'Measuring PageSpeed & Core Web Vitals (TTFB, FCP, LCP, CLS, TBT)...',
          'Analyzing Title, Description, robots, viewport tags...',
          'Auditing semantic H1-H3 structure and intent alignment...',
          'Generating Before / After recommendations and CTR boosters...',
        ]
      : selectedLang === 'de'
      ? [
          `Verbindung zur Website wird hergestellt (${selectedDevice === 'mobile' ? 'Mobil' : 'Desktop'})...`,
          'Messung von PageSpeed & Core Web Vitals (TTFB, FCP, LCP, CLS, TBT)...',
          'Prüfung von Title, Description, robots und Viewport...',
          'Semantische Analyse der H1-H3 Struktur & Suchintention...',
          'Erstellung von Vorher/Nachher-Empfehlungen zur CTR-Steigerung...',
        ]
      : [
          `Подключение к сайту и сканирование HTML (${selectedDevice === 'mobile' ? 'Mobile' : 'Desktop'})...`,
          'Замер параметров PageSpeed & Core Web Vitals (TTFB, FCP, LCP, CLS, TBT)...',
          'Проверка мета-тегов Title, Description, robots, viewport...',
          'Анализ соответствия поисковым интентам и структуре H1-H3...',
          'Генерация оптимизированных сниппетов «Было / Стало»...',
        ];

    let stepIndex = 0;
    setLoadingStepText(loadingSteps[0]);
    const stepInterval = setInterval(() => {
      stepIndex = (stepIndex + 1) % loadingSteps.length;
      setLoadingStepText(loadingSteps[stepIndex]);
    }, 1500);

    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...params,
          device: selectedDevice,
          lang: selectedLang,
        }),
      });

      clearInterval(stepInterval);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Ошибка сервера (${response.status})`);
      }

      const data: AuditResponse = await response.json();

      if (!data.success || !data.audit) {
        throw new Error(data.error || 'Не удалось получить структурированный результат аудита');
      }

      setAuditResult(data.audit);
      setAnalyzedData(data.analyzedData || null);

      // Smooth scroll to results
      setTimeout(() => {
        const resultsEl = document.getElementById('audit-results');
        if (resultsEl) {
          resultsEl.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (err: any) {
      clearInterval(stepInterval);
      console.error('Audit execution error:', err);
      setErrorMessage(err.message || 'Произошла ошибка при аудите');
    } finally {
      setIsLoading(false);
      setLoadingStepText('');
    }
  };

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    // If an audit was already completed, re-run with new language to get fresh translations and recommendations
    if (lastParamsRef.current && !isLoading) {
      executeAudit({
        ...lastParamsRef.current,
        lang: newLang,
      });
    }
  };

  const handleReset = () => {
    setAuditResult(null);
    setAnalyzedData(null);
    setErrorMessage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#efebe3] text-stone-900 flex flex-col font-sans">
      {/* Top Header with Language, Device, and Telegram link */}
      <Header
        language={language}
        onLanguageChange={handleLanguageChange}
        device={device}
        onDeviceChange={setDevice}
        onOpenChecklistModal={() => setIsChecklistModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Input & Configuration Section with Device Toggle and Language */}
        <AuditInputPanel
          onStartAudit={executeAudit}
          isLoading={isLoading}
          loadingStepText={loadingStepText}
          device={device}
          onDeviceChange={setDevice}
          language={language}
          onLanguageChange={handleLanguageChange}
        />

        {/* Error message */}
        {errorMessage && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-sm flex items-start space-x-3 shadow-xs">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600 mt-0.5" />
            <div>
              <strong className="block font-bold">Ошибка проведения аудита:</strong>
              <span className="leading-relaxed">{errorMessage}</span>
            </div>
          </div>
        )}

        {/* Audit Results Section */}
        {auditResult && (
          <div id="audit-results" className="space-y-8 pt-4">
            {/* Quick Action Navigation Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white/95 border border-[#ded7cb] p-3 sm:p-4 rounded-2xl backdrop-blur-md sticky top-18 sm:top-20 z-20 shadow-xs">
              <div className="flex items-center space-x-3 text-xs sm:text-sm font-bold text-stone-900">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{t.toolbar.ready}</span>
                <span className="text-stone-500 font-normal hidden sm:inline">
                  • {t.toolbar.overallScore} <strong className="text-stone-900 font-black">{auditResult.overallScore}/100</strong>
                </span>

                {auditResult.detectedSiteType && (
                  <span className="hidden md:inline px-2.5 py-0.5 rounded text-xs bg-[#f3efe6] text-stone-800 border border-[#ded7cb] font-semibold">
                    {auditResult.detectedSiteType}
                  </span>
                )}
              </div>

              {/* Toolbar Controls: Device Switcher + Actions */}
              <div className="flex items-center space-x-2">
                {/* Global Device Toggle in Toolbar */}
                <div className="flex items-center p-0.5 bg-[#ece7de] rounded-xl border border-[#d6cfc2]">
                  <button
                    type="button"
                    onClick={() => setDevice('mobile')}
                    className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      device === 'mobile'
                        ? 'bg-white text-stone-900 shadow-2xs border border-[#ded7cb]'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Mobile</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDevice('desktop')}
                    className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      device === 'desktop'
                        ? 'bg-white text-stone-900 shadow-2xs border border-[#ded7cb]'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <Laptop className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Desktop</span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    const el = document.getElementById('pagespeed-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#faf8f5] hover:bg-[#f3efe6] text-stone-800 border border-[#ded7cb] transition cursor-pointer shadow-2xs"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span className="hidden sm:inline">PageSpeed</span>
                </button>

                <button
                  onClick={() => setIsMarkdownModalOpen(true)}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#2d2822] hover:bg-[#1a1714] text-white transition cursor-pointer shadow-xs"
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t.toolbar.markdownReport}</span>
                </button>

                <button
                  onClick={handleReset}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-stone-50 text-stone-700 hover:text-stone-950 border border-[#ded7cb] transition cursor-pointer shadow-2xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">{t.toolbar.reset}</span>
                </button>
              </div>
            </div>

            {/* 1. Overall Score & Summary */}
            <ScoreHero
              audit={auditResult}
              url={currentUrl || analyzedData?.url}
              onSelectTab={(tabIdx) => {
                setActiveDetailTab(tabIdx);
                const section = document.getElementById('four-pillars-section');
                if (section) section.scrollIntoView({ behavior: 'smooth' });
              }}
              device={device}
              onDeviceChange={setDevice}
              language={language}
            />

            {/* Scraped Raw Data Overview */}
            {analyzedData && <ScrapedOverview data={analyzedData} language={language} />}

            {/* PageSpeed Insights & Core Web Vitals Panel (Mobile & Desktop) */}
            <div id="pagespeed-section">
              <PageSpeedSection
                pageSpeed={auditResult.pageSpeed}
                devicePageSpeed={auditResult.devicePageSpeed}
                analyzedData={analyzedData || undefined}
                url={currentUrl || analyzedData?.url}
                device={device}
                onDeviceChange={setDevice}
                language={language}
              />
            </div>

            {/* 2. Critical Errors */}
            <CriticalErrorsSection
              errors={auditResult.criticalErrors}
              language={language}
            />

            {/* 3. Before / After Recommendations + SERP Preview */}
            <BeforeAfterSection
              items={auditResult.beforeAfter}
              serpPreview={auditResult.serpPreview}
              device={device}
              onDeviceChange={setDevice}
              language={language}
            />

            {/* Deep Breakdown Across the 4 Pillars */}
            <div id="four-pillars-section">
              <FourPillarsDetail
                audit={auditResult}
                activeTab={activeDetailTab}
                setActiveTab={setActiveDetailTab}
                device={device}
                language={language}
              />
            </div>

            {/* 4. Marketing Bonus & CTA */}
            <MarketingCtaBonus
              bonus={auditResult.marketingBonus}
              language={language}
              onOpenChecklistModal={() => setIsChecklistModalOpen(true)}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#ded7cb] bg-[#e9e4da] py-8 mt-16 text-center text-xs text-stone-600">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 font-medium">
          <p>© {new Date().getFullYear()} {t.footer.copyright}</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setIsChecklistModalOpen(true)}
              className="text-stone-700 hover:text-stone-950 font-bold transition cursor-pointer"
            >
              {t.footer.checklistLink}
            </button>
            <a
              href="https://t.me/sites_ai_tasks"
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-700 hover:text-[#229ed9] font-bold transition flex items-center space-x-1"
            >
              <Send className="w-3.5 h-3.5 text-[#229ed9]" />
              <span>{t.footer.telegramLink}</span>
            </a>
            <a
              href="https://vk.ru/id1130637537"
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-700 hover:text-[#0077ff] font-bold transition flex items-center space-x-1"
            >
              <svg className="w-3.5 h-3.5 fill-[#0077ff]" viewBox="0 0 24 24">
                <path d="M15.07 2H8.93C4.33 2 2 4.33 2 8.93v6.14C2 19.67 4.33 22 8.93 22h6.14c4.6 0 6.93-2.33 6.93-6.93V8.93C22 4.33 19.67 2 15.07 2zm3.39 13.91h-1.64c-.62 0-.81-.49-1.92-1.6-.97-.94-1.4-1.06-1.64-1.06-.34 0-.44.1-.44.57v1.44c0 .39-.13.65-1.17.65-1.72 0-3.63-1.05-4.98-3.01-2.04-2.89-2.61-5.07-2.61-5.51 0-.25.1-.48.58-.48h1.64c.44 0 .61.2.78.68.86 2.49 2.3 4.67 2.89 4.67.22 0 .32-.1.32-.66V9.45c-.07-1.17-.68-1.27-.68-1.69 0-.2.17-.4.44-.4h2.76c.37 0 .5.2.5.64v3.47c0 .37.16.5.27.5.23 0 .42-.13.84-.55 1.3-1.46 2.23-3.7 2.23-3.7.12-.25.33-.48.77-.48h1.64c.5 0 .61.25.5.64-.21.99-2.28 3.88-2.38 4.04-.21.32-.3.46 0 .86.21.29.93.91 1.41 1.46.88.99 1.55 1.82 1.73 2.39.18.57-.1.86-.66.86z" />
              </svg>
              <span>{t.footer.vkLink}</span>
            </a>
            <a
              href="https://vitwill.github.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-700 hover:text-stone-950 font-bold transition flex items-center space-x-1"
            >
              <Globe className="w-3.5 h-3.5 text-stone-700" />
              <span>{t.footer.portfolioLink}</span>
            </a>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {auditResult && (
        <MarkdownExportModal
          isOpen={isMarkdownModalOpen}
          onClose={() => setIsMarkdownModalOpen(false)}
          markdown={auditResult.rawMarkdown}
          url={currentUrl || analyzedData?.url}
          language={language}
        />
      )}

      <ChecklistModal
        isOpen={isChecklistModalOpen}
        onClose={() => setIsChecklistModalOpen(false)}
        language={language}
      />
    </div>
  );
}
