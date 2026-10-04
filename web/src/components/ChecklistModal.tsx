import React, { useState } from 'react';
import { Language } from '../types/seo';
import { TRANSLATIONS } from '../data/translations';
import { X, CheckSquare, Square, Download, Send, Sparkles } from 'lucide-react';

interface ChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: Language;
}

interface ChecklistItem {
  id: string;
  category: 'technical' | 'visibility' | 'intent' | 'content';
  critical: boolean;
  title: { ru: string; en: string; de: string };
  desc: { ru: string; en: string; de: string };
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  // 1. Technical SEO
  {
    id: 't1',
    category: 'technical',
    critical: true,
    title: {
      ru: 'HTTPS & SSL сертификат',
      en: 'HTTPS & SSL Certificate',
      de: 'HTTPS & SSL-Zertifikat',
    },
    desc: {
      ru: 'Действующий TLS-сертификат без смешанного контента (mixed content).',
      en: 'Valid TLS certificate without mixed content issues.',
      de: 'Gültiges TLS-Zertifikat ohne Mixed-Content-Probleme.',
    },
  },
  {
    id: 't2',
    category: 'technical',
    critical: true,
    title: {
      ru: 'Отсутствие блокировок в robots.txt',
      en: 'No blocking directives in robots.txt',
      de: 'Keine Blockierungen in robots.txt',
    },
    desc: {
      ru: 'Проверка директив Disallow для важных разделов и страниц сайта.',
      en: 'Review Disallow directives for key site sections.',
      de: 'Disallow-Anweisungen für wichtige Bereiche prüfen.',
    },
  },
  {
    id: 't3',
    category: 'technical',
    critical: true,
    title: {
      ru: 'Корректный мета-тег Viewport',
      en: 'Correct Viewport Meta Tag',
      de: 'Korrektes Viewport-Meta-Tag',
    },
    desc: {
      ru: 'width=device-width, initial-scale=1.0 для идеального мобильного отображения.',
      en: 'width=device-width, initial-scale=1.0 for seamless mobile rendering.',
      de: 'width=device-width, initial-scale=1.0 für perfekte Mobiloptimierung.',
    },
  },
  {
    id: 't4',
    category: 'technical',
    critical: false,
    title: {
      ru: 'Наличие XML-карты сайта (sitemap.xml)',
      en: 'XML Sitemap Presence (sitemap.xml)',
      de: 'XML-Sitemap vorhanden (sitemap.xml)',
    },
    desc: {
      ru: 'Файл доступен в корне и отправлен в Google Search Console и Яндекс Вебмастер.',
      en: 'File accessible in root and submitted to Google Search Console.',
      de: 'Datei im Root verfügbar und in Google Search Console hinterlegt.',
    },
  },
  {
    id: 't5',
    category: 'technical',
    critical: true,
    title: {
      ru: 'Канонические адреса (rel="canonical")',
      en: 'Canonical Tags (rel="canonical")',
      de: 'Kanonische Tags (rel="canonical")',
    },
    desc: {
      ru: 'Предотвращение дублирования страниц с GET-параметрами и пагинацией.',
      en: 'Prevents duplicate indexing caused by URL parameters or pagination.',
      de: 'Verhindert Duplikate durch URL-Parameter und Paginierung.',
    },
  },
  {
    id: 't6',
    category: 'technical',
    critical: false,
    title: {
      ru: 'Серверный ответ 200 OK',
      en: 'Clean Server Response 200 OK',
      de: 'Sauberer Server-Status 200 OK',
    },
    desc: {
      ru: 'Отсутствие цепочек редиректов 301/302 и быстрый ответ сервера TTFB < 600 мс.',
      en: 'No 301/302 redirect chains and fast server response TTFB < 600 ms.',
      de: 'Keine Weiterleitungsketten und schnelle Server-Antwort TTFB < 600 ms.',
    },
  },
  {
    id: 't7',
    category: 'technical',
    critical: true,
    title: {
      ru: 'Показатели Core Web Vitals (LCP, CLS, TBT)',
      en: 'Core Web Vitals (LCP, CLS, TBT)',
      de: 'Core Web Vitals (LCP, CLS, TBT)',
    },
    desc: {
      ru: 'Отрисовка LCP < 2.5 сек, отсутствие смещения макета CLS < 0.1.',
      en: 'LCP rendering < 2.5s, layout shift CLS < 0.1, blocking time TBT < 200ms.',
      de: 'LCP-Rendering < 2,5 Sek., Layout-Verschiebung CLS < 0,1.',
    },
  },
  {
    id: 't8',
    category: 'technical',
    critical: false,
    title: {
      ru: 'Оптимизация изображений (WebP / AVIF)',
      en: 'Image Optimization (WebP / AVIF)',
      de: 'Bildoptimierung (WebP / AVIF)',
    },
    desc: {
      ru: 'Сжатие картинок и атрибуты width/height для снижения CLS.',
      en: 'Next-gen formats and explicit width/height attributes.',
      de: 'Moderne Formate und explizite width/height-Attribute.',
    },
  },
  {
    id: 't9',
    category: 'technical',
    critical: false,
    title: {
      ru: 'Микроразметка Schema.org',
      en: 'Schema.org Structured Data',
      de: 'Schema.org Strukturierte Daten',
    },
    desc: {
      ru: 'Разметка Article, Organization, Product, FAQPage для расширенных сниппетов.',
      en: 'Organization, Product, Article or FAQPage markup for rich snippets.',
      de: 'Organization, Product, Article oder FAQ-Markup für Rich Snippets.',
    },
  },
  {
    id: 't10',
    category: 'technical',
    critical: false,
    title: {
      ru: 'Отсутствие битых ссылок (ошибки 404)',
      en: 'No Broken Links (404 errors)',
      de: 'Keine defekten Links (404-Fehler)',
    },
    desc: {
      ru: 'Регулярная проверка на внутренние битые ссылки и корректные анкоры.',
      en: 'Regular internal crawl check to fix 404 dead ends.',
      de: 'Regelmäßige interne Überprüfung zur Behebung von 404-Fehlern.',
    },
  },

  // 2. Visibility & Rankings
  {
    id: 'v1',
    category: 'visibility',
    critical: true,
    title: {
      ru: 'Уникальный тег Title (50–60 символов)',
      en: 'Unique Title Tag (50–60 chars)',
      de: 'Eindeutiger Title-Tag (50–60 Zeichen)',
    },
    desc: {
      ru: 'Содержит главный высокочастотный ключ ближе к началу + УТП + бренд.',
      en: 'Contains primary keyword near beginning, core value proposition and brand.',
      de: 'Enthält das Hauptkeyword am Anfang, ein Nutzenversprechen und die Marke.',
    },
  },
  {
    id: 'v2',
    category: 'visibility',
    critical: true,
    title: {
      ru: 'Кликабельный тег Description (140–160 символов)',
      en: 'Click-Worthy Description (140–160 chars)',
      de: 'Klickstarke Description (140–160 Zeichen)',
    },
    desc: {
      ru: 'Решает проблему пользователя, содержит призыв к действию и вторичные ключи.',
      en: 'Addresses user problem, contains actionable CTA and secondary terms.',
      de: 'Löst Nutzerbedürfnisse, enthält Handlungsaufforderung (CTA) und Nebenkeywords.',
    },
  },
  {
    id: 'v3',
    category: 'visibility',
    critical: true,
    title: {
      ru: 'Единственный тег H1 на странице',
      en: 'Single H1 Heading on Page',
      de: 'Genau eine H1-Überschrift pro Seite',
    },
    desc: {
      ru: 'Точно отражает суть страницы и дополняет Title без прямого дублирования.',
      en: 'Accurately reflects page topic and complements Title without duplication.',
      de: 'Spiegelt das Kernthema wider und ergänzt den Title sinnvoll.',
    },
  },
  {
    id: 'v4',
    category: 'visibility',
    critical: false,
    title: {
      ru: 'Логическая иерархия H2–H3',
      en: 'Logical H2–H3 Subheading Hierarchy',
      de: 'Logische H2–H3 Überschriften-Hierarchie',
    },
    desc: {
      ru: 'Структурирование контента по семантическим кластерам запросов (LSI).',
      en: 'Content structured into semantic search query clusters (LSI).',
      de: 'Gliederung des Inhalts nach semantischen Suchclustern.',
    },
  },
  {
    id: 'v5',
    category: 'visibility',
    critical: false,
    title: {
      ru: 'Open Graph разметка (og:title, og:image)',
      en: 'Open Graph Tags (og:title, og:image)',
      de: 'Open Graph Meta-Tags (og:title, og:image)',
    },
    desc: {
      ru: 'Привлекательное превью при шеринге в Telegram, соцсетях и мессенджерах.',
      en: 'Attractive snippet cards when shared in Telegram, messengers and social feeds.',
      de: 'Attraktive Vorschaubilder beim Teilen auf Telegram und Social Media.',
    },
  },
  {
    id: 'v6',
    category: 'visibility',
    critical: false,
    title: {
      ru: 'ЧПУ (человекопонятные URL)',
      en: 'Clean SEO-Friendly URLs',
      de: 'Lesbare, suchmaschinenfreundliche URLs',
    },
    desc: {
      ru: 'Короткие понятные URL без сложных технических идентификаторов.',
      en: 'Short semantic URLs without obscure IDs or session tokens.',
      de: 'Kurze, verständliche URLs ohne technische Session-IDs.',
    },
  },
  {
    id: 'v7',
    category: 'visibility',
    critical: false,
    title: {
      ru: 'Расширенные сниппеты в выдаче',
      en: 'Rich Search Snippets',
      de: 'Erweiterte Suchergebnis-Snippets',
    },
    desc: {
      ru: 'Хлебные крошки (BreadcrumbList), рейтинг звездочками, спецификации.',
      en: 'Breadcrumbs, review ratings, pricing and FAQ accordions in SERP.',
      de: 'Brotkrumen-Navigation (BreadcrumbList), Bewertungen und FAQs in Google.',
    },
  },
  {
    id: 'v8',
    category: 'visibility',
    critical: false,
    title: {
      ru: 'Атрибуты alt для всех картинок',
      en: 'Alt Attributes on All Images',
      de: 'Alt-Attribute für alle Bilder',
    },
    desc: {
      ru: 'Релевантные описания для ранжирования в Google Картинках и доступности.',
      en: 'Relevant visual descriptions for Google Images and web accessibility.',
      de: 'Relevante Beschreibungen für Google Bilder und Barrierefreiheit.',
    },
  },

  // 3. User Intent & Behavior
  {
    id: 'i1',
    category: 'intent',
    critical: true,
    title: {
      ru: 'Точное попадание в поисковый интент',
      en: 'Precise Search Intent Match',
      de: 'Präzise Erfüllung der Suchintention',
    },
    desc: {
      ru: 'Коммерческая страница для транзакционных запросов, инфо-статья для познавательных.',
      en: 'Commercial landing for transactional queries, editorial depth for informational.',
      de: 'Transaktionale Seite für Kaufabsichten, Fachartikel für Informationssuche.',
    },
  },
  {
    id: 'i2',
    category: 'intent',
    critical: true,
    title: {
      ru: 'Первый экран с ответом на главный вопрос',
      en: 'Above-the-Fold Instant Answer',
      de: 'Above-the-Fold Sofort-Antwort',
    },
    desc: {
      ru: 'Суть предложения видна без скролла для предотвращения быстрого возврата в выдачу.',
      en: 'Core value is visible without scrolling to prevent immediate SERP bounce.',
      de: 'Kernaussage ist ohne Scrollen sichtbar, um Bounceraten zu senken.',
    },
  },
  {
    id: 'i3',
    category: 'intent',
    critical: false,
    title: {
      ru: 'Интерактивные элементы удержания',
      en: 'Interactive Engagement Elements',
      de: 'Interaktive Bindungselemente',
    },
    desc: {
      ru: 'Калькуляторы, фильтры, оглавление со ссылками-якорями, инфографика.',
      en: 'Calculators, product filters, anchor tables of contents, infographics.',
      de: 'Rechner, Filter, Inhaltsverzeichnisse mit Sprungmarken, Infografiken.',
    },
  },
  {
    id: 'i4',
    category: 'intent',
    critical: false,
    title: {
      ru: 'Читаемость и верстка текста',
      en: 'Readability & Typographic Hierarchy',
      de: 'Lesbarkeit und typografische Struktur',
    },
    desc: {
      ru: 'Абзацы по 3-4 строки, списки, выделения, цитаты, отсутствие простыней текста.',
      en: 'Concise paragraphs, bullet lists, bold highlights, zero wall of text.',
      de: 'Kurze Absätze, Aufzählungen, Hervorhebungen, keine Textwüsten.',
    },
  },
  {
    id: 'i5',
    category: 'intent',
    critical: false,
    title: {
      ru: 'Понятные точки конверсии (CTA)',
      en: 'Clear Conversion Points (CTA)',
      de: 'Eindeutige Conversion-Punkte (CTA)',
    },
    desc: {
      ru: 'Кнопки заказа/подписки, форма заявки в 1-2 поля без препятствий.',
      en: 'Action buttons, frictionless 1-2 field forms, visible contact routes.',
      de: 'Klare Handlungsaufforderungen, schlanke 1-2 Feld Formulare.',
    },
  },
  {
    id: 'i6',
    category: 'intent',
    critical: false,
    title: {
      ru: 'Адаптивность под тач-интерфейсы',
      en: 'Touch-Friendly Mobile Usability',
      de: 'Touch-optimierte mobile Bedienung',
    },
    desc: {
      ru: 'Размер кликабельных кнопок не менее 44x44px, отсутствие горизонтального скролла.',
      en: 'Tap targets at least 44x44px, zero accidental zoom or horizontal scrolling.',
      de: 'Touch-Ziele mindestens 44x44px, kein horizontales Scrollen.',
    },
  },

  // 4. Content Quality & Links
  {
    id: 'c1',
    category: 'content',
    critical: true,
    title: {
      ru: 'Уникальность и экспертность (E-E-A-T)',
      en: 'Originality & Authority (E-E-A-T)',
      de: 'Einzigartigkeit & Expertise (E-E-A-T)',
    },
    desc: {
      ru: 'Указание реального автора-эксперта, пруфы, сертификаты, оригинальный опыт.',
      en: 'Named expert author bio, verifiable facts, credentials and original insights.',
      de: 'Echter Autorenbeleg, Verweise, Zertifikate und Praxiserfahrung.',
    },
  },
  {
    id: 'c2',
    category: 'content',
    critical: true,
    title: {
      ru: 'Отсутствие переспама (тошнота < 8%)',
      en: 'No Keyword Stuffing (< 8% density)',
      de: 'Kein Keyword-Spamming (< 8% Dichte)',
    },
    desc: {
      ru: 'Естественное вхождение ключевых слов в склонениях и словосочетаниях.',
      en: 'Natural conversational keyword distribution with varied synonyms.',
      de: 'Natürliche Keyword-Verteilung mit Synonymen und Phrasen.',
    },
  },
  {
    id: 'c3',
    category: 'content',
    critical: false,
    title: {
      ru: 'Продуманная внутренняя перелинковка',
      en: 'Strategic Internal Linking',
      de: 'Strategische interne Verlinkung',
    },
    desc: {
      ru: 'Контекстные ссылки с естественными анкорами на релевантные сопутствующие страницы.',
      en: 'Contextual in-content links with descriptive anchors to related assets.',
      de: 'Kontextuelle Links mit aussagekräftigen Ankertexten.',
    },
  },
  {
    id: 'c4',
    category: 'content',
    critical: true,
    title: {
      ru: 'Защита от каннибализации ключевых слов',
      en: 'Keyword Cannibalization Prevention',
      de: 'Schutz vor Keyword-Kannibalisierung',
    },
    desc: {
      ru: 'Каждая страница продвигается по своему уникальному кластеру запросов.',
      en: 'Each page targets its own distinct query cluster without overlapping.',
      de: 'Jede Seite zielt auf einen eigenen Suchcluster ohne Überschneidungen.',
    },
  },
  {
    id: 'c5',
    category: 'content',
    critical: false,
    title: {
      ru: 'Актуальность информации',
      en: 'Content Freshness & Revision Date',
      de: 'Aktualität und Überarbeitungsdatum',
    },
    desc: {
      ru: 'Дата обновления контента, отсутствие устаревших данных и цен.',
      en: 'Explicit "last updated" timestamps, verified current figures and prices.',
      de: 'Sichtbares Aktualisierungsdatum, keine veralteten Angaben oder Preise.',
    },
  },
  {
    id: 'c6',
    category: 'content',
    critical: false,
    title: {
      ru: 'Анализ ссылочного профиля (Backlinks)',
      en: 'Natural Backlink Profile',
      de: 'Natürliches Backlink-Profil',
    },
    desc: {
      ru: 'Качественные ссылки с тематических авторитетных ресурсов без спам-ферм.',
      en: 'High-trust thematic links without link farm or PBN footprints.',
      de: 'Hochwertige Themenlinks ohne toxische Linknetzwerke.',
    },
  },
];

export const ChecklistModal: React.FC<ChecklistModalProps> = ({ isOpen, onClose, language = 'ru' }) => {
  const t = TRANSLATIONS[language];
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [activeFilter, setActiveFilter] = useState<'all' | 'technical' | 'visibility' | 'intent' | 'content'>('all');

  if (!isOpen) return null;

  const toggleItem = (id: string) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredItems = CHECKLIST_ITEMS.filter((item) => {
    if (activeFilter === 'all') return true;
    return item.category === activeFilter;
  });

  const progressPercent = Math.round((checkedIds.size / CHECKLIST_ITEMS.length) * 100);

  const handleDownloadChecklist = () => {
    let md = `# ${t.modals.checklistTitle}\n\n`;
    md += `${language === 'en' ? 'Date' : language === 'de' ? 'Datum' : 'Дата'}: ${new Date().toLocaleDateString()}\n${
      language === 'en' ? 'Progress' : language === 'de' ? 'Fortschritt' : 'Прогресс'
    }: ${checkedIds.size}/${CHECKLIST_ITEMS.length} (${progressPercent}%)\n\n`;

    CHECKLIST_ITEMS.forEach((item) => {
      const isChecked = checkedIds.has(item.id) ? '[x]' : '[ ]';
      const crit = item.critical
        ? ` [${language === 'en' ? 'CRITICAL' : language === 'de' ? 'KRITISCH' : 'КРИТИЧНО'}]`
        : '';
      const title = item.title[language] || item.title.ru;
      const desc = item.desc[language] || item.desc.ru;
      md += `- ${isChecked} **${title}**${crit}: ${desc}\n`;
    });

    md += `\n---\n${language === 'en' ? 'Contacts & Links' : language === 'de' ? 'Kontakte & Links' : 'Контакты и ресурсы'}:\n- Telegram: https://t.me/sites_ai_tasks (@sites_ai_tasks)\n- ВКонтакте: https://vk.ru/id1130637537\n- ${language === 'en' ? 'Portfolio' : language === 'de' ? 'Portfolio' : 'Портфолио'}: https://vitwill.github.io/\n`;

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `seo-checklist-${new Date().toISOString().slice(0, 10)}.md`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-[#ded7cb] rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#ece7de] bg-[#fbf9f5]">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-[#2d2822] text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-stone-900">
                {t.modals.checklistTitle}
              </h3>
              <p className="text-xs text-stone-500 font-medium">
                {t.modals.checklistSubtitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress & Filters */}
        <div className="px-6 py-3.5 bg-white border-b border-[#ece7de] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Progress bar */}
          <div className="flex items-center space-x-3 flex-1">
            <div className="flex-1 bg-[#ece7de] h-2 rounded-full overflow-hidden max-w-xs">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs font-bold text-stone-700">
              {checkedIds.size} / {CHECKLIST_ITEMS.length} ({progressPercent}%)
            </span>
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: language === 'en' ? 'All' : language === 'de' ? 'Alle' : 'Все' },
              { id: 'technical', label: language === 'en' ? 'Technical' : language === 'de' ? 'Technik' : 'Техника' },
              { id: 'visibility', label: language === 'en' ? 'Visibility' : language === 'de' ? 'Sichtbarkeit' : 'Видимость' },
              { id: 'intent', label: language === 'en' ? 'Intent' : language === 'de' ? 'Intention' : 'Интенты' },
              { id: 'content', label: language === 'en' ? 'Content' : language === 'de' ? 'Inhalt' : 'Контент' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id as any)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeFilter === f.id
                    ? 'bg-[#2d2822] text-white shadow-2xs'
                    : 'bg-white border border-[#ded7cb] text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Items List */}
        <div className="p-6 overflow-y-auto flex-1 space-y-2.5 bg-[#faf8f5]">
          {filteredItems.map((item) => {
            const isChecked = checkedIds.has(item.id);
            const title = item.title[language] || item.title.ru;
            const desc = item.desc[language] || item.desc.ru;

            return (
              <div
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`p-3.5 rounded-xl border transition cursor-pointer flex items-start space-x-3 ${
                  isChecked
                    ? 'bg-emerald-50/50 border-emerald-300'
                    : 'bg-white border-[#ded7cb] hover:border-stone-400'
                }`}
              >
                <div className="mt-0.5 flex-shrink-0">
                  {isChecked ? (
                    <CheckSquare className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Square className="w-4 h-4 text-stone-400" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-xs font-bold ${
                        isChecked ? 'line-through text-stone-500' : 'text-stone-900'
                      }`}
                    >
                      {title}
                    </span>
                    {item.critical && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 border border-rose-200 uppercase">
                        {language === 'en' ? 'Critical' : language === 'de' ? 'Kritisch' : 'Критично'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[#ece7de] bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-stone-500 font-medium">
            Google Search Central & Best SEO Practices 2026
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleDownloadChecklist}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#faf8f5] hover:bg-[#f3efe6] border border-[#ded7cb] text-stone-800 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t.modals.markdownDownload}</span>
            </button>

            <a
              href="https://t.me/sites_ai_tasks"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#229ed9] hover:bg-[#1f8fc4] transition shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>@sites_ai_tasks</span>
            </a>

            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg font-bold bg-[#2d2822] hover:bg-[#1a1714] text-white text-xs transition cursor-pointer"
            >
              {t.modals.close}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
