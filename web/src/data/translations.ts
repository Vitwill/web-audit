import { Language } from '../types/seo';

export interface TranslationDictionary {
  header: {
    brandTitle: string;
    brandSubtitle: string;
    badgePro: string;
    telegramBtn: string;
    checklistBtn: string;
  };
  hero: {
    badge: string;
    titleMain: string;
    titleHighlight: string;
    desc: string;
  };
  inputPanel: {
    tabUrl: string;
    tabHtml: string;
    tabConstructor: string;
    tabPresets: string;
    urlPlaceholder: string;
    keywordsLabel: string;
    keywordsPlaceholder: string;
    deviceLabel: string;
    langLabel: string;
    mobile: string;
    desktop: string;
    btnStart: string;
    btnLoading: string;
    liveScrapeNote: string;
    htmlLabel: string;
    htmlPlaceholder: string;
    presetsTitle: string;
    presetsDesc: string;
    loadPreset: string;
  };
  toolbar: {
    ready: string;
    overallScore: string;
    siteType: string;
    pagespeed: string;
    markdownReport: string;
    reset: string;
  };
  scoreHero: {
    excellent: string;
    good: string;
    warning: string;
    critical: string;
    pillarTech: string;
    pillarTechDesc: string;
    pillarVisibility: string;
    pillarVisibilityDesc: string;
    pillarIntent: string;
    pillarIntentDesc: string;
    pillarContent: string;
    pillarContentDesc: string;
    assessmentTitle: string;
  };
  pagespeed: {
    title: string;
    subtitle: string;
    performance: string;
    accessibility: string;
    bestPractices: string;
    seo: string;
    vitalsTitle: string;
    diagnosticsTitle: string;
    good: string;
    needsImprovement: string;
    poor: string;
    mobileNotice: string;
    desktopNotice: string;
  };
  criticalErrors: {
    title: string;
    subtitle: string;
    impact: string;
    action: string;
    noErrors: string;
  };
  beforeAfter: {
    title: string;
    subtitle: string;
    solutionsBadge: string;
    element: string;
    before: string;
    after: string;
    reason: string;
    copy: string;
    copied: string;
    serpGoogle: string;
    serpYandex: string;
    previewToggle: string;
    viewBefore: string;
    viewAfter: string;
  };
  fourPillars: {
    title: string;
    subtitle: string;
    techSubtitle: string;
    tabTech: string;
    tabVisibility: string;
    tabIntent: string;
    tabContent: string;
    findings: string;
    recommendations: string;
    keywordsFound: string;
    ctrPotential: string;
    intentIdentified: string;
    bounceRisk: string;
    keywordDensity: string;
    internalLinks: string;
    statusLabel: string;
    viewDetails: string;
  };
  scrapedOverview: {
    title: string;
    sslSecure: string;
    sslNone: string;
    ttfb: string;
    htmlSize: string;
    words: string;
    photos: string;
    withoutAlt: string;
    titleLabel: string;
    descLabel: string;
    h1Label: string;
    h2Label: string;
    canonicalLabel: string;
    robotsLabel: string;
    viewportLabel: string;
  };
  marketing: {
    badge: string;
    telegramJoin: string;
    socialConnect: string;
    telegramBtn: string;
    vkBtn: string;
    portfolioBtn: string;
    openChecklist: string;
    leadTitle: string;
    leadSubtitle: string;
    leadSent: string;
    leadPlaceholder: string;
    leadBtn: string;
    features: [string, string, string];
  };
  footer: {
    copyright: string;
    checklistLink: string;
    telegramLink: string;
    vkLink: string;
    portfolioLink: string;
  };
  modals: {
    checklistTitle: string;
    checklistSubtitle: string;
    checklistProgress: string;
    checklistDone: string;
    markdownTitle: string;
    markdownCopy: string;
    markdownDownload: string;
    close: string;
  };
}

export const TRANSLATIONS: Record<Language, TranslationDictionary> = {
  ru: {
    header: {
      brandTitle: 'Сайты для бизнеса | AI и задачи',
      brandSubtitle: 'Экспресс-аудит веб-страниц и Core Web Vitals (Mobile & Desktop)',
      badgePro: 'PRO 10+ ЛЕТ',
      telegramBtn: 'Telegram-канал',
      checklistBtn: 'Чеклист',
    },
    hero: {
      badge: 'Экспресс-аудит веб-страниц от эксперта с 10-летним стажем',
      titleMain: 'Глубокий SEO-аудит',
      titleHighlight: 'по 4 ключевым блокам',
      desc: 'Технический фундамент, PageSpeed & Core Web Vitals для смартфонов и компьютеров, ранжирование, CTR и поисковый интент с практическими рекомендациями «Было / Стало».',
    },
    inputPanel: {
      tabUrl: 'Аудит по URL',
      tabHtml: 'Исходный HTML',
      tabConstructor: 'Конструктор страницы',
      tabPresets: 'Готовые сценарии',
      urlPlaceholder: 'https://example.com/page',
      keywordsLabel: 'Целевые поисковые запросы (опционально):',
      keywordsPlaceholder: 'Например: свободная энциклопедия, IT-платформа, онлайн-сервис...',
      deviceLabel: 'Тестируемое устройство:',
      langLabel: 'Язык отчета:',
      mobile: 'Смартфон (Mobile)',
      desktop: 'Компьютер (Desktop)',
      btnStart: 'Запустить SEO-аудит',
      btnLoading: 'Анализируем страницу...',
      liveScrapeNote: 'Автоматический парсинг HTML с эмуляцией браузера Chrome 124',
      htmlLabel: 'Вставьте исходный HTML-код страницы:',
      htmlPlaceholder: '<!DOCTYPE html><html><head><title>Ваш сайт</title>...',
      presetsTitle: 'Выберите готовый сценарий для мгновенного теста:',
      presetsDesc: 'Выберите любой кейс, чтобы мгновенно протестировать выявление ошибок в разных типах сайтов:',
      loadPreset: 'Загрузить',
    },
    toolbar: {
      ready: 'Аудит готов',
      overallScore: 'Общий балл:',
      siteType: 'Тип сайта:',
      pagespeed: 'PageSpeed',
      markdownReport: 'Markdown-отчет',
      reset: 'Сброс',
    },
    scoreHero: {
      excellent: 'Отличный уровень SEO',
      good: 'Хороший базовый уровень',
      warning: 'Требуется оптимизация',
      critical: 'Критическое состояние',
      pillarTech: 'Техническое SEO',
      pillarTechDesc: 'SSL, robots, viewport, Core Web Vitals',
      pillarVisibility: 'Видимость & CTR',
      pillarVisibilityDesc: 'Заголовки H1-H3, сниппеты, кликабельность',
      pillarIntent: 'Поисковый интент',
      pillarIntentDesc: 'Интент запроса, отказы, структура',
      pillarContent: 'Контент & Ссылки',
      pillarContentDesc: 'Плотность ключей, перелинковка',
      assessmentTitle: 'Экспертное заключение',
    },
    pagespeed: {
      title: 'PageSpeed Insights & Core Web Vitals',
      subtitle: 'Оценка скорости загрузки, стабильности верстки и отзывчивости интерфейса',
      performance: 'Производительность',
      accessibility: 'Доступность',
      bestPractices: 'Лучшие практики',
      seo: 'SEO',
      vitalsTitle: 'Ключевые метрики Core Web Vitals',
      diagnosticsTitle: 'Диагностика и рекомендации по ускорению',
      good: 'Хорошо',
      needsImprovement: 'Требует улучшения',
      poor: 'Плохо',
      mobileNotice: 'Режим симуляции 4G сети на мобильном устройстве (Moto G4)',
      desktopNotice: 'Режим высокоскоростного оптоволоконного подключения на настольном ПК',
    },
    criticalErrors: {
      title: 'Критические ошибки (срочно исправить)',
      subtitle: 'Факторы, блокирующие индексацию поисковыми роботами и снижающие позиции',
      impact: 'Влияние на ранжирование:',
      action: 'Что необходимо сделать:',
      noErrors: 'Критических блокирующих ошибок не обнаружено. Переходите к оптимизации сниппетов.',
    },
    beforeAfter: {
      title: 'Рекомендации «Было / Стало»',
      subtitle: 'Оптимизированные варианты тегов для взрывного роста CTR в выдаче Google и Яндекс',
      solutionsBadge: 'Готовые решения',
      element: 'Элемент',
      before: 'Было (текущий вариант)',
      after: 'Стало (рекомендация эксперта)',
      reason: 'Почему это сработает:',
      copy: 'Скопировать',
      copied: 'Скопировано!',
      serpGoogle: 'Сниппет в выдаче Google',
      serpYandex: 'Сниппет в Яндексе',
      previewToggle: 'Предпросмотр сниппета:',
      viewBefore: 'Показать «Было»',
      viewAfter: 'Показать «Стало»',
    },
    fourPillars: {
      title: 'Детальный разбор по 4 ключевым направлениям',
      subtitle: 'Глубокий анализ факторов ранжирования с практическими рекомендациями',
      techSubtitle: 'SSL (HTTPS), robots, viewport, Core Web Vitals, Crawl Budget',
      tabTech: '1. Техническое SEO',
      tabVisibility: '2. Видимость & CTR',
      tabIntent: '3. Поисковый интент',
      tabContent: '4. Контент & Ссылки',
      findings: 'Выявленные факты и анализ:',
      recommendations: 'Пошаговый план внедрения:',
      keywordsFound: 'Определенные ключевые маркеры:',
      ctrPotential: 'Анализ кликабельности (CTR):',
      intentIdentified: 'Определенный поисковый интент:',
      bounceRisk: 'Риск отказов (Bounce Rate):',
      keywordDensity: 'Оценка плотности ключевых слов:',
      internalLinks: 'Состояние внутренней структуры ссылок:',
      statusLabel: 'Статус:',
      viewDetails: 'Смотреть графики',
    },
    scrapedOverview: {
      title: 'Технические параметры исследованной страницы',
      sslSecure: 'HTTPS (SSL)',
      sslNone: 'Без SSL (HTTP)',
      ttfb: 'мс (TTFB)',
      htmlSize: 'КБ HTML',
      words: 'слов',
      photos: 'фото',
      withoutAlt: 'без alt',
      titleLabel: 'Тег Title',
      descLabel: 'Мета-тег Description',
      h1Label: 'Теги H1',
      h2Label: 'Подзаголовки H2',
      canonicalLabel: 'Канонический URL (canonical)',
      robotsLabel: 'Мета-тег robots',
      viewportLabel: 'Мета-тег viewport',
    },
    marketing: {
      badge: 'Маркетинговый бонус от эксперта',
      telegramJoin: 'Вступить в Telegram-канал (@sites_ai_tasks)',
      socialConnect: 'Соцсети и портфолио автора:',
      telegramBtn: 'Телеграм',
      vkBtn: 'ВКонтакте',
      portfolioBtn: 'Портфолио',
      openChecklist: 'Открыть интерактивный чеклист',
      leadTitle: 'Нужна персональная стратегия продвижения для вашего сайта?',
      leadSubtitle: 'Оставьте контакт для индивидуального разбора проекта от автора аудита',
      leadSent: 'Заявка принята! Эксперт свяжется с вами в течение рабочего дня.',
      leadPlaceholder: '@telegram или телефон',
      leadBtn: 'Получить консультацию',
      features: [
        'Чеклист аудита',
        'Белые методы продвижения 2026',
        'Разборы реальных кейсов в Telegram',
      ],
    },
    footer: {
      copyright: 'Сайты для бизнеса | AI и задачи. Комплексная поисковая оптимизация сайтов.',
      checklistLink: 'Чеклист',
      telegramLink: 'Telegram: @sites_ai_tasks',
      vkLink: 'ВКонтакте',
      portfolioLink: 'Портфолио',
    },
    modals: {
      checklistTitle: 'Чеклист комплексного SEO-аудита',
      checklistSubtitle: 'Полный гид эксперта по проверке технической части, контента, ссылок и Core Web Vitals',
      checklistProgress: 'Выполнено пунктов:',
      checklistDone: 'Все пункты проверены!',
      markdownTitle: 'Готовый отчет по SEO-аудиту (Markdown)',
      markdownCopy: 'Скопировать Markdown',
      markdownDownload: 'Скачать .md файл',
      close: 'Закрыть',
    },
  },

  en: {
    header: {
      brandTitle: 'Sites for Business | AI & Tasks',
      brandSubtitle: 'Express Web Page Audit & Core Web Vitals (Mobile & Desktop)',
      badgePro: 'PRO 10+ YRS',
      telegramBtn: 'Telegram Channel',
      checklistBtn: 'Checklist',
    },
    hero: {
      badge: 'Express web page audit by a 10+ year SEO expert',
      titleMain: 'Deep SEO Audit',
      titleHighlight: 'Across 4 Core Pillars',
      desc: 'Technical foundation, PageSpeed & Core Web Vitals for mobile and desktop, rankings, CTR, and search intent with actionable Before / After recommendations.',
    },
    inputPanel: {
      tabUrl: 'Audit by URL',
      tabHtml: 'Raw HTML',
      tabConstructor: 'Page Builder',
      tabPresets: 'Preset Scenarios',
      urlPlaceholder: 'https://example.com/page',
      keywordsLabel: 'Target search queries (optional):',
      keywordsPlaceholder: 'E.g.: free encyclopedia, SaaS platform, online service...',
      deviceLabel: 'Tested device:',
      langLabel: 'Report language:',
      mobile: 'Mobile Device',
      desktop: 'Desktop PC',
      btnStart: 'Run SEO Audit',
      btnLoading: 'Analyzing web page...',
      liveScrapeNote: 'Automated HTML scraping with Chrome 124 browser emulation',
      htmlLabel: 'Paste page source HTML code:',
      htmlPlaceholder: '<!DOCTYPE html><html><head><title>Your Site</title>...',
      presetsTitle: 'Select a ready scenario for an instant audit test:',
      presetsDesc: 'Click any scenario below to see how the audit identifies issues across different website types:',
      loadPreset: 'Load Case',
    },
    toolbar: {
      ready: 'Audit Ready',
      overallScore: 'Overall Score:',
      siteType: 'Site Type:',
      pagespeed: 'PageSpeed',
      markdownReport: 'Markdown Report',
      reset: 'Reset',
    },
    scoreHero: {
      excellent: 'Excellent SEO Health',
      good: 'Good Baseline',
      warning: 'Optimization Needed',
      critical: 'Critical Issues Found',
      pillarTech: 'Technical SEO',
      pillarTechDesc: 'SSL, robots, viewport, Core Web Vitals',
      pillarVisibility: 'Visibility & CTR',
      pillarVisibilityDesc: 'H1-H3 headings, snippets, clickability',
      pillarIntent: 'Search Intent',
      pillarIntentDesc: 'Query intent, bounce rate, structure',
      pillarContent: 'Content & Links',
      pillarContentDesc: 'Keyword density, internal links',
      assessmentTitle: 'Expert Assessment',
    },
    pagespeed: {
      title: 'PageSpeed Insights & Core Web Vitals',
      subtitle: 'Load speed, visual layout stability, and user responsiveness assessment',
      performance: 'Performance',
      accessibility: 'Accessibility',
      bestPractices: 'Best Practices',
      seo: 'SEO',
      vitalsTitle: 'Core Web Vitals Key Metrics',
      diagnosticsTitle: 'Speed Diagnostics & Recommendations',
      good: 'Good',
      needsImprovement: 'Needs Improvement',
      poor: 'Poor',
      mobileNotice: 'Simulated 4G mobile connection (Moto G4 emulation)',
      desktopNotice: 'High-speed broadband fiber connection on desktop browser',
    },
    criticalErrors: {
      title: 'Critical Issues (Fix Urgently)',
      subtitle: 'Factors blocking search engine indexing and depressing rankings',
      impact: 'Ranking Impact:',
      action: 'How to Resolve:',
      noErrors: 'No blocking critical issues found. Proceed to snippet CTR optimization.',
    },
    beforeAfter: {
      title: 'Before / After Recommendations',
      subtitle: 'Optimized tag variants for breakthrough CTR in Google & search engines',
      solutionsBadge: 'Ready Solutions',
      element: 'Element',
      before: 'Before (Current)',
      after: 'After (Expert Recommendation)',
      reason: 'Why this works:',
      copy: 'Copy',
      copied: 'Copied!',
      serpGoogle: 'Google Search Snippet',
      serpYandex: 'Yandex / Bing Snippet',
      previewToggle: 'Snippet Preview:',
      viewBefore: 'Show «Before»',
      viewAfter: 'Show «After»',
    },
    fourPillars: {
      title: 'Detailed Breakdown Across 4 Core Pillars',
      subtitle: 'In-depth analysis of ranking factors with step-by-step action items',
      techSubtitle: 'SSL (HTTPS), robots, viewport, Core Web Vitals, Crawl Budget',
      tabTech: '1. Technical SEO',
      tabVisibility: '2. Visibility & CTR',
      tabIntent: '3. Search Intent',
      tabContent: '4. Content & Backlinks',
      findings: 'Findings and Audit Analysis:',
      recommendations: 'Implementation Roadmap:',
      keywordsFound: 'Extracted Keyword Markers:',
      ctrPotential: 'Click-Through Rate (CTR) Analysis:',
      intentIdentified: 'Detected Search Intent:',
      bounceRisk: 'Bounce Rate Risk Assessment:',
      keywordDensity: 'Keyword Density & Stuffing Risk:',
      internalLinks: 'Internal Link Structure Status:',
      statusLabel: 'Status:',
      viewDetails: 'View Charts',
    },
    scrapedOverview: {
      title: 'Technical Parameters of Audited Page',
      sslSecure: 'HTTPS (SSL)',
      sslNone: 'No SSL (HTTP)',
      ttfb: 'ms (TTFB)',
      htmlSize: 'KB HTML',
      words: 'words',
      photos: 'images',
      withoutAlt: 'without alt',
      titleLabel: 'Title Tag',
      descLabel: 'Description Meta Tag',
      h1Label: 'H1 Tags',
      h2Label: 'H2 Subheadings',
      canonicalLabel: 'Canonical URL',
      robotsLabel: 'Robots Meta Tag',
      viewportLabel: 'Viewport Meta Tag',
    },
    marketing: {
      badge: 'Marketing Bonus from Expert',
      telegramJoin: 'Join Telegram Channel (@sites_ai_tasks)',
      socialConnect: 'Social Networks & Portfolio:',
      telegramBtn: 'Telegram',
      vkBtn: 'VKontakte',
      portfolioBtn: 'Portfolio',
      openChecklist: 'Open Interactive Checklist',
      leadTitle: 'Need a tailored SEO & growth strategy for your website?',
      leadSubtitle: 'Submit your contact info for a personalized breakdown by the audit author',
      leadSent: 'Request received! The expert will get in touch with you shortly.',
      leadPlaceholder: '@telegram or phone/email',
      leadBtn: 'Request Consultation',
      features: [
        'Actionable audit checklist',
        'White-hat growth techniques for 2026',
        'Real-world case breakdowns in Telegram',
      ],
    },
    footer: {
      copyright: 'Sites for Business | AI & Tasks. Comprehensive Search Engine Optimization.',
      checklistLink: 'Checklist',
      telegramLink: 'Telegram: @sites_ai_tasks',
      vkLink: 'VKontakte',
      portfolioLink: 'Portfolio',
    },
    modals: {
      checklistTitle: 'Comprehensive SEO Audit Checklist',
      checklistSubtitle: 'Complete expert guide verifying technical SEO, content quality, links, and Core Web Vitals',
      checklistProgress: 'Completed items:',
      checklistDone: 'All checklist items verified!',
      markdownTitle: 'Structured SEO Audit Report (Markdown)',
      markdownCopy: 'Copy Markdown',
      markdownDownload: 'Download .md File',
      close: 'Close',
    },
  },

  de: {
    header: {
      brandTitle: 'Websites für Unternehmen | KI & Aufgaben',
      brandSubtitle: 'Express-Webseiten-Audit & Core Web Vitals (Mobil & Desktop)',
      badgePro: 'PRO 10+ JAHRE',
      telegramBtn: 'Telegram-Kanal',
      checklistBtn: 'Checkliste',
    },
    hero: {
      badge: 'Express-Webseiten-Audit von einem SEO-Experten mit 10+ Jahren Erfahrung',
      titleMain: 'Umfassendes SEO-Audit',
      titleHighlight: 'in 4 Kernbereichen',
      desc: 'Technisches Fundament, PageSpeed & Core Web Vitals für Smartphones und Computer, Rankings, Klickrate (CTR) und Suchintention mit praxiserprobten Vorher/Nachher-Empfehlungen.',
    },
    inputPanel: {
      tabUrl: 'Audit per URL',
      tabHtml: 'Quell-HTML',
      tabConstructor: 'Seiten-Konstruktor',
      tabPresets: 'Praxisszenarien',
      urlPlaceholder: 'https://example.com/seite',
      keywordsLabel: 'Ziel-Suchbegriffe (optional):',
      keywordsPlaceholder: 'Z.B.: freie Enzyklopädie, SaaS-Plattform, Online-Shop...',
      deviceLabel: 'Testgerät:',
      langLabel: 'Berichtssprache:',
      mobile: 'Mobilgerät (Smartphone)',
      desktop: 'Desktop-Computer',
      btnStart: 'SEO-Audit starten',
      btnLoading: 'Seite wird analysiert...',
      liveScrapeNote: 'Automatische HTML-Erfassung mit Chrome-124 Browser-Emulation',
      htmlLabel: 'Quell-HTML-Code der Seite einfügen:',
      htmlPlaceholder: '<!DOCTYPE html><html><head><title>Ihre Website</title>...',
      presetsTitle: 'Wählen Sie ein fertiges Szenario für einen Soforttest:',
      presetsDesc: 'Wählen Sie ein Fallbeispiel aus, um die Fehlererkennung für verschiedene Webseitentypen zu testen:',
      loadPreset: 'Laden',
    },
    toolbar: {
      ready: 'Audit bereit',
      overallScore: 'Gesamtpunktzahl:',
      siteType: 'Webseitentyp:',
      pagespeed: 'PageSpeed',
      markdownReport: 'Markdown-Bericht',
      reset: 'Zurücksetzen',
    },
    scoreHero: {
      excellent: 'Hervorragender SEO-Zustand',
      good: 'Gute Ausgangsbasis',
      warning: 'Optimierungsbedarf',
      critical: 'Kritische Fehler vorhanden',
      pillarTech: 'Technisches SEO',
      pillarTechDesc: 'SSL, Robots, Viewport, Web Vitals',
      pillarVisibility: 'Sichtbarkeit & CTR',
      pillarVisibilityDesc: 'H1-H3 Überschriften, Snippets, Klickrate',
      pillarIntent: 'Suchintention',
      pillarIntentDesc: 'Suchintention, Absprungrate, Struktur',
      pillarContent: 'Inhalt & Verlinkung',
      pillarContentDesc: 'Keyword-Dichte, interne Links',
      assessmentTitle: 'Expertenbewertung',
    },
    pagespeed: {
      title: 'PageSpeed Insights & Core Web Vitals',
      subtitle: 'Bewertung von Ladezeit, visueller Stabilität und Reaktionsgeschwindigkeit',
      performance: 'Leistung',
      accessibility: 'Barrierefreiheit',
      bestPractices: 'Best Practices',
      seo: 'SEO',
      vitalsTitle: 'Wichtige Core Web Vitals Metriken',
      diagnosticsTitle: 'Geschwindigkeitsdiagnose & Optimierungsvorschläge',
      good: 'Gut',
      needsImprovement: 'Verbesserungswürdig',
      poor: 'Schlecht',
      mobileNotice: 'Simulierte 4G-Mobilfunkverbindung (Moto G4 Emulation)',
      desktopNotice: 'Highspeed-Breitbandverbindung auf dem Desktop-PC',
    },
    criticalErrors: {
      title: 'Kritische Fehler (Dringend beheben)',
      subtitle: 'Faktoren, die die Suchmaschinen-Indexierung blockieren und Rankings schädigen',
      impact: 'Auswirkung auf Rankings:',
      action: 'Lösungsschritte:',
      noErrors: 'Keine blockierenden kritischen Fehler gefunden. Fahren Sie mit der Snippet-Optimierung fort.',
    },
    beforeAfter: {
      title: 'Vorher / Nachher Empfehlungen',
      subtitle: 'Optimierte Tag-Varianten für maximale Klickraten (CTR) bei Google & Suchmaschinen',
      solutionsBadge: 'Fertige Lösungen',
      element: 'Element',
      before: 'Vorher (Aktuell)',
      after: 'Nachher (Expertenempfehlung)',
      reason: 'Warum das funktioniert:',
      copy: 'Kopieren',
      copied: 'Kopiert!',
      serpGoogle: 'Google-Suchergebnis (Snippet)',
      serpYandex: 'Suchergebnis-Vorschau',
      previewToggle: 'Snippet-Vorschau:',
      viewBefore: '«Vorher» anzeigen',
      viewAfter: '«Nachher» anzeigen',
    },
    fourPillars: {
      title: 'Detaillierte Analyse in 4 Kernbereichen',
      subtitle: 'Fundierte Bewertung aller Rankingfaktoren mit konkreten Handlungsschritten',
      techSubtitle: 'SSL (HTTPS), robots, viewport, Core Web Vitals, Crawl Budget',
      tabTech: '1. Technisches SEO',
      tabVisibility: '2. Sichtbarkeit & CTR',
      tabIntent: '3. Suchintention',
      tabContent: '4. Inhalt & Backlinks',
      findings: 'Festgestellte Fakten und Analyse:',
      recommendations: 'Schritt-für-Schritt Implementierungsplan:',
      keywordsFound: 'Erkannte Schlüsselbegriffe:',
      ctrPotential: 'Klickraten-Potenzial (CTR):',
      intentIdentified: 'Ermittelte Suchintention:',
      bounceRisk: 'Absprungraten-Risiko (Bounce Rate):',
      keywordDensity: 'Keyword-Dichte & Spam-Risiko:',
      internalLinks: 'Status der internen Linkstruktur:',
      statusLabel: 'Status:',
      viewDetails: 'Diagramme anzeigen',
    },
    scrapedOverview: {
      title: 'Technische Parameter der analysierten Seite',
      sslSecure: 'HTTPS (SSL)',
      sslNone: 'Ohne SSL (HTTP)',
      ttfb: 'ms (TTFB)',
      htmlSize: 'KB HTML',
      words: 'Wörter',
      photos: 'Bilder',
      withoutAlt: 'ohne Alt',
      titleLabel: 'Title-Tag',
      descLabel: 'Description-Meta-Tag',
      h1Label: 'H1-Tags',
      h2Label: 'H2-Unterüberschriften',
      canonicalLabel: 'Kanonische URL (canonical)',
      robotsLabel: 'Robots-Meta-Tag',
      viewportLabel: 'Viewport-Meta-Tag',
    },
    marketing: {
      badge: 'Marketing-Bonus vom Experten',
      telegramJoin: 'Dem Telegram-Kanal beitreten (@sites_ai_tasks)',
      socialConnect: 'Netzwerke & Portfolio:',
      telegramBtn: 'Telegram',
      vkBtn: 'VKontakte',
      portfolioBtn: 'Portfolio',
      openChecklist: 'Interaktive Checkliste öffnen',
      leadTitle: 'Benötigen Sie eine individuelle SEO-Strategie für Ihre Website?',
      leadSubtitle: 'Hinterlassen Sie Ihren Kontakt für eine persönliche Projektanalyse durch den Autor',
      leadSent: 'Anfrage erhalten! Der Experte wird sich in Kürze mit Ihnen in Verbindung setzen.',
      leadPlaceholder: '@telegram oder E-Mail / Telefon',
      leadBtn: 'Beratung anfordern',
      features: [
        'Checkliste für Audits',
        'White-Hat SEO-Methoden für 2026',
        'Reale Fallstudien im Telegram-Kanal',
      ],
    },
    footer: {
      copyright: 'Websites für Unternehmen | KI & Aufgaben. Umfassende Suchmaschinenoptimierung.',
      checklistLink: 'Checkliste',
      telegramLink: 'Telegram: @sites_ai_tasks',
      vkLink: 'VKontakte',
      portfolioLink: 'Portfolio',
    },
    modals: {
      checklistTitle: 'Umfassende SEO-Audit-Checkliste',
      checklistSubtitle: 'Vollständiger Leitfaden zur Überprüfung von Technik, Inhalt, Links und Core Web Vitals',
      checklistProgress: 'Erledigte Punkte:',
      checklistDone: 'Alle Prüfpunkte erfolgreich abgeschlossen!',
      markdownTitle: 'Strukturierter SEO-Audit-Bericht (Markdown)',
      markdownCopy: 'Markdown kopieren',
      markdownDownload: '.md Datei herunterladen',
      close: 'Schließen',
    },
  },
};