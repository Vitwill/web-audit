import React, { useState, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { AuditInputPanel } from './components/AuditInputPanel';
import { ScoreHero } from './components/ScoreHero';
import { PageSpeedSection } from './components/PageSpeedSection';
import { CriticalErrorsSection } from './components/CriticalErrorsSection';
import { BeforeAfterSection } from './components/BeforeAfterSection';
import { FourPillarsDetail } from './components/FourPillarsDetail';
import { MarketingCtaBonus } from './components/MarketingCtaBonus';
import { ScrapedOverview } from './components/ScrapedOverview';
import { ChecklistModal } from './components/ChecklistModal';
import { AuditResult, AnalyzedData, AuditResponse, DeviceType, Language } from './types/seo';
import { AlertCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || '';

// -----------------------------------------------------------------------------
// UUID пользователя в localStorage (для учёта бесплатной квоты).
// -----------------------------------------------------------------------------
const USER_ID_KEY = 'web-audit:user-id';

function getOrCreateUserId(): string {
  if (typeof window === 'undefined') return '';
  try {
    let id = window.localStorage.getItem(USER_ID_KEY);
    if (id && /^[a-zA-Z0-9-]{16,64}$/.test(id)) {
      return id;
    }
    id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
    window.localStorage.setItem(USER_ID_KEY, id);
    return id;
  } catch {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}

export default function App() {
  const [language, setLanguage] = useState<Language>('ru');
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [analyzedData, setAnalyzedData] = useState<AnalyzedData | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStepText, setLoadingStepText] = useState('');
  const [activeDetailTab, setActiveDetailTab] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [device, setDevice] = useState<DeviceType>('mobile');
  const lastParamsRef = useRef<any>(null);
  const [isChecklistModalOpen, setIsChecklistModalOpen] = useState(false);

  // Квота
  const [quotaRemaining, setQuotaRemaining] = useState<number | null>(null);
  const [quotaExhausted, setQuotaExhausted] = useState(false);
  const [quotaUnlimited, setQuotaUnlimited] = useState(false);

  // UUID пользователя
  const userIdRef = useRef<string>('');
  useEffect(() => {
    userIdRef.current = getOrCreateUserId();
  }, []);

  const executeAudit = async (params: any) => {
    setIsLoading(true);
    setErrorMessage(null);
    setCurrentUrl(params.url || '');
    lastParamsRef.current = params;

    const selectedDevice = params.device || device;
    const selectedLang = params.lang || language;

    const loadingSteps =
      selectedLang === 'en'
        ? [
            'Connecting to site...',
            'Measuring metrics...',
            'Analyzing tags...',
            'Generating report...',
          ]
        : selectedLang === 'de'
        ? [
            'Verbindung wird hergestellt...',
            'Metriken werden gemessen...',
            'Tags werden analysiert...',
            'Bericht wird erstellt...',
          ]
        : [
            'Подключение к сайту...',
            'Замер метрик...',
            'Анализ тегов...',
            'Генерация отчёта...',
          ];

    let stepIndex = 0;
    setLoadingStepText(loadingSteps[0]);
    const stepInterval = setInterval(() => {
      stepIndex = (stepIndex + 1) % loadingSteps.length;
      setLoadingStepText(loadingSteps[stepIndex]);
    }, 2500);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (userIdRef.current) {
        headers['X-User-Id'] = userIdRef.current;
      }

      const response = await fetch(`${API_URL}/api/audit`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          ...params,
          device: selectedDevice,
          lang: selectedLang,
        }),
      });

      clearInterval(stepInterval);

      // Читаем заголовки квоты
      const remainingHeader = response.headers.get('X-Quota-Remaining');
      const subscriptionHeader = response.headers.get('X-Quota-Subscription');

      if (subscriptionHeader === 'active' || remainingHeader === 'unlimited') {
        setQuotaUnlimited(true);
        setQuotaRemaining(null);
      } else if (remainingHeader !== null) {
        const num = parseInt(remainingHeader, 10);
        if (!Number.isNaN(num)) {
          setQuotaRemaining(num);
        }
      }

      // 402 — квота исчерпана
      if (response.status === 402) {
        const errorData = await response.json().catch(() => ({}));
        setQuotaExhausted(true);
        setQuotaRemaining(0);
        setErrorMessage(
          errorData.message ||
            'Бесплатный лимит исчерпан. Оформите подписку для продолжения.'
        );
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Ошибка сервера (${response.status})`);
      }

      const data: AuditResponse = await response.json();

      if (!data.success || !data.audit) {
        throw new Error(data.error || 'Не удалось получить результат аудита');
      }

      setAuditResult(data.audit);
      setAnalyzedData(data.analyzedData || null);

      setTimeout(() => {
        const el = document.getElementById('audit-results');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
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
    <div className="min-h-screen bg-[#F5F2EC] text-[#0E0E0E] flex flex-col font-sans selection:bg-[#0E0E0E] selection:text-[#F5F2EC]">
      <Header
        language={language}
        onLanguageChange={handleLanguageChange}
        device={device}
        onDeviceChange={setDevice}
        onOpenChecklistModal={() => setIsChecklistModalOpen(true)}
      />

      <main className="flex-1 w-full mx-auto px-5 md:px-10 py-10 space-y-12 max-w-[1440px]">
        <AuditInputPanel
          onStartAudit={executeAudit}
          isLoading={isLoading}
          loadingStepText={loadingStepText}
          device={device}
          onDeviceChange={setDevice}
          language={language}
          onLanguageChange={handleLanguageChange}
          quotaRemaining={quotaRemaining}
          quotaExhausted={quotaExhausted}
          quotaUnlimited={quotaUnlimited}
          userId={userIdRef.current}
        />

        {errorMessage && !quotaExhausted && (
          <div className="max-w-2xl mx-auto p-4 bg-[#fdf2f2] border border-[#f5c2c7] rounded-sm text-[#8b1f29] text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#C1440E]" />
            <span className="leading-relaxed">{errorMessage}</span>
          </div>
        )}

        {auditResult && (
          <div id="audit-results" className="space-y-16 pt-4">
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

            {analyzedData && (
              <ScrapedOverview data={analyzedData} language={language} />
            )}

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

            <CriticalErrorsSection
              errors={auditResult.criticalErrors}
              language={language}
            />

            <BeforeAfterSection
              items={auditResult.beforeAfter}
              serpPreview={auditResult.serpPreview}
              device={device}
              onDeviceChange={setDevice}
              language={language}
            />

            <div id="four-pillars-section">
              <FourPillarsDetail
                audit={auditResult}
                activeTab={activeDetailTab}
                setActiveTab={setActiveDetailTab}
                device={device}
                language={language}
              />
            </div>

            <MarketingCtaBonus
              bonus={auditResult.marketingBonus}
              language={language}
              onOpenChecklistModal={() => setIsChecklistModalOpen(true)}
            />

            <div className="flex justify-center pt-8 pb-12 border-t border-[rgba(14,14,14,0.14)]">
              <button
                onClick={handleReset}
                className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#C1440E] hover:text-[#0E0E0E] transition-colors cursor-pointer"
              >
                ← Новый аудит
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-[rgba(14,14,14,0.14)] py-10 text-center font-mono text-[10px] tracking-[0.12em] uppercase text-[rgba(14,14,14,0.45)]">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Сайты для бизнеса | AI и задачи</p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <button
              onClick={() => setIsChecklistModalOpen(true)}
              className="hover:text-[#0E0E0E] transition-colors cursor-pointer"
            >
              Чеклист
            </button>
            <a
              href="https://t.me/sites_ai_tasks"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#0E0E0E] transition-colors"
            >
              Telegram
            </a>
            <a
              href="https://vk.ru/id1130637537"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#0E0E0E] transition-colors"
            >
              ВКонтакте
            </a>
            <a
              href="https://vitwill.github.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#0E0E0E] transition-colors"
            >
              Портфолио
            </a>
          </div>
        </div>
      </footer>

      <ChecklistModal
        isOpen={isChecklistModalOpen}
        onClose={() => setIsChecklistModalOpen(false)}
        language={language}
      />
    </div>
  );
}
