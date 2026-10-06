import React, { useState } from 'react';
import { Language } from '../types/seo';
import { X, CheckSquare, Square, Download } from 'lucide-react';

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

  // 2. Visibility
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

  // 3. Intent
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

  // 4. Content
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

export const ChecklistModal: React.FC<ChecklistModalProps> = ({
  isOpen,
  onClose,
  language = 'ru',
}) => {
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [activeFilter, setActiveFilter] = useState<
    'all' | 'technical' | 'visibility' | 'intent' | 'content'
  >('all');

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
    let md = `# SEO Checklist\n\n`;
    md += `${
      language === 'en' ? 'Date' : language === 'de' ? 'Datum' : 'Дата'
    }: ${new Date().toLocaleDateString()}\n`;
    md += `${
      language === 'en' ? 'Progress' : language === 'de' ? 'Fortschritt' : 'Прогресс'
    }: ${checkedIds.size}/${CHECKLIST_ITEMS.length} (${progressPercent}%)\n\n`;

    CHECKLIST_ITEMS.forEach((item) => {
      const isChecked = checkedIds.has(item.id) ? '[x]' : '[ ]';
      const title = item.title[language] || item.title.ru;
      const desc = item.desc[language] || item.desc.ru;
      md += `- ${isChecked} **${title}**: ${desc}\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `seo-checklist-${new Date().toISOString().slice(0, 10)}.md`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const filterLabels = {
    all: language === 'en' ? 'All' : language === 'de' ? 'Alle' : 'Все',
    technical: language === 'en' ? 'Technical' : language === 'de' ? 'Technik' : 'Техника',
    visibility: language === 'en' ? 'Visibility' : language === 'de' ? 'Sichtbarkeit' : 'Видимость',
    intent: language === 'en' ? 'Intent' : language === 'de' ? 'Intention' : 'Интенты',
    content: language === 'en' ? 'Content' : language === 'de' ? 'Inhalt' : 'Контент',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ---------- Шапка ---------- */}
        <div className="flex items-start justify-between px-8 py-6 border-b border-[#e5e5e7]">
          <div>
            <h3 className="text-xl font-semibold tracking-tight text-[#1d1d1f] mb-1">
              {language === 'en'
                ? 'Comprehensive SEO audit checklist'
                : language === 'de'
                ? 'Umfassende SEO-Audit-Checkliste'
                : 'Чеклист комплексного SEO-аудита'}
            </h3>
            <p className="text-sm text-[#6e6e73]">
              {language === 'en'
                ? 'Full expert guide for technical, content and CWV checks'
                : language === 'de'
                ? 'Vollständiger Leitfaden für Technik, Inhalt und CWV'
                : 'Полный гид эксперта по проверке технической части, контента и Core Web Vitals'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#86868b] hover:text-[#1d1d1f] hover:bg-[#f5f5f7] transition-apple cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ---------- Прогресс + фильтры ---------- */}
        <div className="px-8 py-4 border-b border-[#e5e5e7] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1 max-w-md">
            <div className="flex-1 h-1.5 bg-[#f5f5f7] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#0071e3] rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs font-medium text-[#6e6e73] tabular-nums">
              {checkedIds.size} / {CHECKLIST_ITEMS.length}
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            {(['all', 'technical', 'visibility', 'intent', 'content'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-apple cursor-pointer whitespace-nowrap ${
                  activeFilter === f
                    ? 'bg-[#1d1d1f] text-white'
                    : 'bg-[#f5f5f7] text-[#1d1d1f]/70 hover:text-[#1d1d1f]'
                }`}
              >
                {filterLabels[f]}
              </button>
            ))}
          </div>
        </div>

        {/* ---------- Список пунктов ---------- */}
        <div className="px-8 py-6 overflow-y-auto flex-1 space-y-2 bg-[#fafafa]">
          {filteredItems.map((item) => {
            const isChecked = checkedIds.has(item.id);
            const title = item.title[language] || item.title.ru;
            const desc = item.desc[language] || item.desc.ru;

            return (
              <button
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`w-full text-left p-4 rounded-2xl border transition-apple cursor-pointer flex items-start gap-3 ${
                  isChecked
                    ? 'bg-white border-[#0071e3]/30'
                    : 'bg-white border-[#e5e5e7] hover:border-[#d2d2d7]'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isChecked ? (
                    <CheckSquare className="w-4 h-4 text-[#0071e3]" />
                  ) : (
                    <Square className="w-4 h-4 text-[#c7c7cc]" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span
                      className={`text-sm font-medium ${
                        isChecked ? 'text-[#86868b] line-through' : 'text-[#1d1d1f]'
                      }`}
                    >
                      {title}
                    </span>
                    {item.critical && (
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-[#ffeceb] text-[#ff3b30]">
                        {language === 'en'
                          ? 'Critical'
                          : language === 'de'
                          ? 'Kritisch'
                          : 'Критично'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#6e6e73] leading-relaxed">{desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* ---------- Футер ---------- */}
        <div className="px-8 py-4 border-t border-[#e5e5e7] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-[#86868b]">Google Search Central 2026</div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadChecklist}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium text-[#1d1d1f] bg-[#f5f5f7] hover:bg-[#e8e8ed] transition-apple cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              {language === 'en'
                ? 'Download .md'
                : language === 'de'
                ? '.md herunterladen'
                : 'Скачать .md'}
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-medium text-white bg-[#0071e3] hover:bg-[#0077ed] transition-apple cursor-pointer"
            >
              {language === 'en' ? 'Close' : language === 'de' ? 'Schließen' : 'Закрыть'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};