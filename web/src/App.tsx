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
    // Генерируем UUID v4
    id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
    window.localStorage.setItem(USER_ID_KEY, id);
    return id;
  } catch {
    // localStorage может быть недоступен (приватный режим) — генерируем на сессию
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

  // Квота: сколько осталось бесплатных аудитов + флаг исчерпания
  const [quotaRemaining, setQuotaRemaining] = useState<number | null>(null);
  const [quotaExhausted, setQuotaExhausted] = useState(false);
  const [quotaUnlimited, setQuotaUnlimited] = useState(false);

  // UUID пользователя (создаётся при первом рендере)
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
      // Заголовки: Content-Type + X-User-Id (для учёта квоты)
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

      // Читаем квоту из заголовков ответа
      const remainingHeader = response.headers.get('X-Quota-Remaining');
      const subscriptionHeader = response.headers.get('X-Quota-Subscription');

      if (subscriptionHeader === 'active') {
        setQuotaUnlimited(true);
        setQuotaRemaining(null);
      } else if (remainingHeader === 'unlimited') {
        setQuotaUnlimited(true);
        setQuotaRemaining(null);
      } else if (remainingHeader !== null) {
        const num = parseInt(remainingHeader, 10);
        if (!Number.isNaN(num)) {
          setQuotaRemaining(num);
        }
      }

      // Обрабатываем особые статусы
      if (response.status === 402) {
        // Квота исчерпана
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
    <div className="min-h-screen bg-[#fafafa] text-[#1d1d1f] flex flex-col font-sans">
      <Header
        language={language}
        onLanguageChange={handleLanguageChange}
        device={device}
        onDeviceChange={setDevice}
        onOpenChecklistModal={() => setIsChecklistModalOpen(true)}
      />

      <main className="flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 max-w-[1200px]">
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
        />

        {errorMessage && !quotaExhausted && (
          <div className="max-w-2xl mx-auto p-4 bg-[#fff5f5] border border-[#ffdddd] rounded-2xl text-[#c41e3a] text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMessage}</span>
          </div>
        )}

        {auditResult && (
          <div id="audit-results" className="space-y-12 pt-4">
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

            <div className="flex justify-center pt-4 pb-8">
              <button
                onClick={handleReset}
                className="text-sm font-medium text-[#0071e3] hover:text-[#0077ed] transition-apple cursor-pointer"
              >
                ← Новый аудит
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-[#e5e5e7] py-6 text-center text-xs text-[#6e6e73]">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Сайты для бизнеса | AI и задачи</p>
          <div className="flex flex-wrap items-center justify-center gap-5">
            <button
              onClick={() => setIsChecklistModalOpen(true)}
              className="text-[#6e6e73] hover:text-[#1d1d1f] transition-apple cursor-pointer"
            >
              Чеклист
            </button>
            <a
              href="https://t.me/sites_ai_tasks"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#6e6e73] hover:text-[#1d1d1f] transition-apple"
            >
              Telegram
            </a>
            <a
              href="https://vk.ru/id1130637537"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#6e6e73] hover:text-[#1d1d1f] transition-apple"
            >
              ВКонтакте
            </a>
            <a
              href="https://vitwill.github.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#6e6e73] hover:text-[#1d1d1f] transition-apple"
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