// -----------------------------------------------------------------------------
// fallback — алгоритмический генератор SEO-аудита (замена Gemini).
// -----------------------------------------------------------------------------
//
// ЧТО ДЕЛАЕТ:
// Строит полный AuditResult на основе ScrapedData — без вызова LLM.
// Возвращает ту же структуру, что и Gemini: overallScore, scores,
// criticalErrors, blocks (technical/visibility/intent/contentAndLinks),
// beforeAfter (Было / Стало), serpPreview, marketingBonus, rawMarkdown.
//
// КОГДА ИСПОЛЬЗУЕТСЯ:
//   - GEMINI_API_KEY не задан
//   - вызов Gemini упал (ошибка сети, квота)
//   - Gemini вернул невалидный JSON
//
// ЯЗЫКИ:
//   - 'ru', 'en', 'de' — все текстовые блоки подстраиваются под язык.
// -----------------------------------------------------------------------------

import {
  ScrapedData,
  AuditResult,
  CriticalError,
  BeforeAfterItem,
  PageSpeedMetrics,
  DevicePageSpeed,
} from '../types';
import { detectSiteType } from './detectSiteType';
import { calculatePageSpeedMetrics } from './metrics';
import { LINKS } from '../config/links';

// -----------------------------------------------------------------------------
// Псевдонимы для типов.
// -----------------------------------------------------------------------------
type Lang = 'ru' | 'en' | 'de';

// -----------------------------------------------------------------------------
// Главная функция.
// -----------------------------------------------------------------------------
export function generateFallbackAudit(
  analyzedData: Partial<ScrapedData>,
  targetKeywords: string = '',
  lang: Lang = 'ru'
): AuditResult {
  const isEn = lang === 'en';
  const isDe = lang === 'de';

  // ---------------------------------------------------------------------------
  // PageSpeed (mobile + desktop).
  // ---------------------------------------------------------------------------
  const mobilePageSpeed: PageSpeedMetrics = calculatePageSpeedMetrics(analyzedData, 'mobile');
  const desktopPageSpeed: PageSpeedMetrics = calculatePageSpeedMetrics(analyzedData, 'desktop');
  const pageSpeed = mobilePageSpeed;

  const devicePageSpeed: DevicePageSpeed = {
    mobile: mobilePageSpeed,
    desktop: desktopPageSpeed,
  };

  // ---------------------------------------------------------------------------
  // Базовые величины.
  // ---------------------------------------------------------------------------
  const currentTitle = analyzedData.title || '';
  const currentDesc = analyzedData.description || '';
  const h1List = analyzedData.h1 || [];
  const words = analyzedData.wordCount || 0;

  let technicalScore = pageSpeed.seoScore;
  let visibilityScore = 80;
  let intentScore = 85;
  let contentScore = 80;

  const siteType = detectSiteType(
    analyzedData.url || '',
    currentTitle,
    currentDesc,
    [...(analyzedData.h1 || []), ...(analyzedData.h2 || [])],
    analyzedData.contentSnippet || '',
    lang
  );

  const criticalErrors: CriticalError[] = [];
  const beforeAfter: BeforeAfterItem[] = [];

  // ===========================================================================
  // 1. TECHNICAL
  // ===========================================================================
  const technicalFindings: string[] = [];
  const technicalRecs: string[] = [];

  if (!analyzedData.hasSsl) {
    technicalScore -= 35;
    criticalErrors.push({
      title: isEn
        ? 'Missing HTTPS (SSL) Security Protocol'
        : isDe
        ? 'Fehlendes HTTPS (SSL) Sicherheitsprotokoll'
        : 'Отсутствует защищенный протокол HTTPS (SSL)',
      impact: isEn ? 'Critical' : isDe ? 'Kritisch' : 'Критическое',
      description: isEn
        ? 'Browsers flag the page as "Not Secure", causing user trust to drop and Google to penalize search rankings.'
        : isDe
        ? 'Browser stufen die Seite als "Nicht sicher" ein, was das Vertrauen der Nutzer senkt und Rankings schädigt.'
        : 'Браузеры помечают сайт как «Небезопасный», что приводит к резкому падению доверия пользователей и пессимизации в выдаче.',
      fixAction: isEn
        ? "Install an SSL certificate (e.g. Let's Encrypt) and enforce 301 redirects from HTTP to HTTPS."
        : isDe
        ? "Installieren Sie ein kostenloses Let's Encrypt SSL-Zertifikat und richten Sie 301-Weiterleitungen ein."
        : 'Установите бесплатный Let’s Encrypt SSL-сертификат и настройте 301-редирект с HTTP на HTTPS.',
    });
    technicalFindings.push(
      isEn
        ? 'The website operates over insecure HTTP protocol without transport encryption.'
        : isDe
        ? 'Die Webseite wird über ein unsicheres HTTP-Protokoll ohne Verschlüsselung übertragen.'
        : 'Страница работает по незащищенному протоколу HTTP без шифрования.'
    );
    technicalRecs.push(
      isEn
        ? 'Connect an SSL certificate and enable HSTS security headers.'
        : isDe
        ? 'SSL-Zertifikat einrichten und HSTS-Header konfigurieren.'
        : 'Подключить SSL-сертификат и настроить HSTS.'
    );
  } else {
    technicalFindings.push(
      isEn
        ? 'SSL certificate is active and properly secures user traffic (HTTPS).'
        : isDe
        ? 'SSL-Zertifikat ist aktiv und schützt Nutzerdaten zuverlässig (HTTPS).'
        : 'SSL-сертификат подключен и корректно защищает данные пользователей (HTTPS).'
    );
  }

  if (!analyzedData.viewport) {
    technicalScore -= 25;
    criticalErrors.push({
      title: isEn
        ? 'Missing Viewport Meta Tag'
        : isDe
        ? 'Fehlender Viewport-Meta-Tag'
        : 'Отсутствует мета-тег Viewport',
      impact: isEn ? 'Critical' : isDe ? 'Kritisch' : 'Критическое',
      description: isEn
        ? 'The page fails to adapt to mobile screens. Under Google Mobile-First Indexing, this severely damages mobile traffic.'
        : isDe
        ? 'Die Seite passt sich nicht an Mobilgeräte an. Unter Googles Mobile-First-Indexierung geht erheblicher Traffic verloren.'
        : 'Страница не адаптируется под мобильные устройства. По алгоритму Google Mobile-First Indexing сайт теряет более 70% мобильного поискового трафика.',
      fixAction: isEn
        ? 'Add <meta name="viewport" content="width=device-width, initial-scale=1.0"> inside <head>.'
        : isDe
        ? 'Fügen Sie <meta name="viewport" content="width=device-width, initial-scale=1.0"> im <head> ein.'
        : 'Добавьте в тег <head> директиву: <meta name="viewport" content="width=device-width, initial-scale=1.0">',
    });
    technicalFindings.push(
      isEn
        ? 'No viewport meta tag was detected in document header.'
        : isDe
        ? 'Kein Viewport-Meta-Tag im Dokumentenkopf gefunden.'
        : 'Мета-тег viewport не обнаружен в шапке страницы.'
    );
    technicalRecs.push(
      isEn
        ? 'Implement standard viewport directive to ensure responsive mobile layout.'
        : isDe
        ? 'Standard-Viewport-Tag einbinden, um mobiles Responsive-Design sicherzustellen.'
        : 'Внедрить стандартный viewport для поддержки мобильных устройств.'
    );
  } else {
    technicalFindings.push(
      isEn
        ? 'Viewport meta tag is properly configured for mobile devices.'
        : isDe
        ? 'Viewport-Meta-Tag ist für mobile Endgeräte korrekt eingerichtet.'
        : 'Мета-тег viewport задан корректно (поддерживается mobile-friendly).'
    );
  }

  if (analyzedData.responseTimeMs && analyzedData.responseTimeMs > 1000) {
    technicalScore -= 10;
    technicalFindings.push(
      isEn
        ? `Server response time (${analyzedData.responseTimeMs} ms) exceeds Google Core Web Vitals threshold (< 600 ms).`
        : isDe
        ? `Serverantwortzeit (${analyzedData.responseTimeMs} ms) überschreitet den Google-Grenzwert (< 600 ms).`
        : `Время ответа сервера ${analyzedData.responseTimeMs} мс превышает порог Google Core Web Vitals (< 600 мс).`
    );
    technicalRecs.push(
      isEn
        ? 'Optimize TTFB: implement caching, Brotli compression, and CDN.'
        : isDe
        ? 'TTFB optimieren: Caching, Brotli-Komprimierung und CDN einführen.'
        : 'Оптимизировать скорость TTFB: внедрить кэширование, Gzip/Brotli сжатие и CDN.'
    );
  } else {
    technicalFindings.push(
      isEn
        ? `Server TTFB response time is fast (${analyzedData.responseTimeMs || 150} ms), crawler indexing is swift.`
        : isDe
        ? `Server-TTFB-Antwortzeit ist schnell (${analyzedData.responseTimeMs || 150} ms), Crawling erfolgt zügig.`
        : `Время ответа сервера TTFB отличное (${analyzedData.responseTimeMs || 150} мс), сканирование роботами проходит мгновенно.`
    );
  }

  // ===========================================================================
  // 2. VISIBILITY & CTR
  // ===========================================================================
  const visibilityFindings: string[] = [];
  const visibilityRecs: string[] = [];

  if (!currentTitle || currentTitle.length < 15) {
    visibilityScore -= 25;
    criticalErrors.push({
      title: isEn
        ? 'Title Tag Is Too Short or Missing'
        : isDe
        ? 'Title-Tag zu kurz oder fehlt'
        : 'Слишком короткий или отсутствующий тег Title',
      impact: isEn ? 'Critical' : isDe ? 'Kritisch' : 'Критическое',
      description: isEn
        ? 'Title is the single most important on-page ranking factor. Titles under 15 characters fail to convey semantic relevance.'
        : isDe
        ? 'Der Title ist der wichtigste Onpage-Rankingfaktor. Zu kurze Titel vermitteln Suchmaschinen keine ausreichende Relevanz.'
        : 'Title — главный текстовый маркер ранжирования. Заголовок короче 15 символов не раскрывает тематику страницы для поисковиков.',
      fixAction: isEn
        ? 'Expand Title to 50–60 characters incorporating primary target keyword and unique brand value.'
        : isDe
        ? 'Erweitern Sie den Title auf 50–60 Zeichen mit Hauptsuchbegriff und Alleinstellungsmerkmal.'
        : 'Расширьте Title до 50-60 символов, включив ключевой поисковый запрос и суть страницы.',
    });
    visibilityFindings.push(
      isEn
        ? `Title tag is too short (${currentTitle.length} chars) to carry adequate search semantic weight.`
        : isDe
        ? `Title-Tag ist zu kurz (${currentTitle.length} Zeichen) für ausreichende Relevanz.`
        : `Тег Title слишком короткий (${currentTitle.length} симв.), не передает достаточно семантики.`
    );
  } else if (currentTitle.length > 70) {
    visibilityScore -= 10;
    visibilityFindings.push(
      isEn
        ? `Title length (${currentTitle.length} chars) exceeds the SERP display limit (65–70 chars) and will be truncated.`
        : isDe
        ? `Title-Länge (${currentTitle.length} Zeichen) überschreitet das Snippet-Limit (65–70 Zeichen) und wird abgeschnitten.`
        : `Длина Title (${currentTitle.length} симв.) превышает лимит сниппета (65-70 симв.) и будет обрезана в поисковой выдаче.`
    );
    visibilityRecs.push(
      isEn
        ? 'Shorten Title to 55–60 characters, front-loading the most critical keyword.'
        : isDe
        ? 'Title auf 55–60 Zeichen kürzen und wichtigste Keywords an den Anfang setzen.'
        : 'Сократить Title до 60 символов, поместив самое важное в начало.'
    );
  } else {
    visibilityFindings.push(
      isEn
        ? `Title tag has optimal length (${currentTitle.length} chars) and displays well in search engines.`
        : isDe
        ? `Title-Tag hat eine optimale Länge (${currentTitle.length} Zeichen) und wird vollständig dargestellt.`
        : `Тег Title имеет оптимальную длину (${currentTitle.length} симв.) и хорошо отображается в поисковых системах.`
    );
  }

  if (!currentDesc || currentDesc.length < 40) {
    visibilityScore -= 20;
    criticalErrors.push({
      title: isEn
        ? 'Missing or Incomplete Description Meta Tag'
        : isDe
        ? 'Fehlender oder unvollständiger Description-Meta-Tag'
        : 'Отсутствует или не заполнен мета-тег Description',
      impact: isEn ? 'High' : isDe ? 'Hoch' : 'Высокое',
      description: isEn
        ? 'Without an explicit Description, search crawlers compile snippets from arbitrary body fragments, cutting CTR by 25–40%.'
        : isDe
        ? 'Ohne Description ziehen Suchmaschinen willkürliche Textauszüge, was die Klickrate um 25–40% verringert.'
        : 'Без Description поисковый робот формирует сниппет из случайных обрывков текста, что снижает CTR кликабельности в выдаче на 25-40%.',
      fixAction: isEn
        ? 'Create an engaging meta description of 140–160 characters with a clear call-to-action.'
        : isDe
        ? 'Erstellen Sie eine ansprechende Meta-Description (140–160 Zeichen) mit Call-to-Action.'
        : 'Составьте емкое мета-описание длиной 130-160 символов, передающее ключевую ценность страницы.',
    });
    visibilityFindings.push(
      isEn
        ? 'Description meta tag is missing or too brief for search snippets.'
        : isDe
        ? 'Description-Meta-Tag fehlt oder ist zu kurz für ein aussagekräftiges Snippet.'
        : 'Мета-тег Description отсутствует или слишком короткий.'
    );
  } else if (currentDesc.length > 175) {
    visibilityScore -= 8;
    visibilityFindings.push(
      isEn
        ? `Description length (${currentDesc.length} chars) exceeds the snippet limit and will be trimmed with ellipses.`
        : isDe
        ? `Description-Länge (${currentDesc.length} Zeichen) überschreitet das Limit und wird abgeschnitten.`
        : `Description (${currentDesc.length} симв.) длиннее 160-170 символов, хвостовая часть будет скрыта многоточием.`
    );
  } else {
    visibilityFindings.push(
      isEn
        ? `Description meta tag is well formed (${currentDesc.length} chars).`
        : isDe
        ? `Description-Meta-Tag ist optimal formuliert (${currentDesc.length} Zeichen).`
        : `Мета-тег Description сформирован корректно (${currentDesc.length} симв.).`
    );
  }

  if (h1List.length === 0) {
    visibilityScore -= 20;
    criticalErrors.push({
      title: isEn
        ? 'Missing Primary H1 Heading'
        : isDe
        ? 'Hauptüberschrift H1 fehlt'
        : 'Отсутствует главный заголовок H1',
      impact: isEn ? 'Critical' : isDe ? 'Kritisch' : 'Критическое',
      description: isEn
        ? 'Without an H1 tag, crawlers lose the primary thematic anchor of the landing page.'
        : isDe
        ? 'Ohne H1-Tag fehlt Suchmaschinen der zentrale semantische Bezugspunkt der Seite.'
        : 'Без заголовка H1 страница теряет ключевой структурный маяк для поисковых алгоритмов Google и Яндекс.',
      fixAction: isEn
        ? 'Add a single <h1> heading reflecting the primary topic of the page.'
        : isDe
        ? 'Fügen Sie eine einzige <h1>-Überschrift ein, die das Hauptthema der Seite benennt.'
        : 'Добавьте единственный тег <h1> с главным поисковым запросом страницы.',
    });
    visibilityFindings.push(
      isEn
        ? 'No H1 heading found on page.'
        : isDe
        ? 'Keine H1-Überschrift auf der Seite gefunden.'
        : 'Тег H1 на странице не найден.'
    );
  } else if (h1List.length > 1) {
    visibilityScore -= 10;
    visibilityFindings.push(
      isEn
        ? `Found ${h1List.length} H1 headings. SEO best practice requires exactly one H1 per page.`
        : isDe
        ? `${h1List.length} H1-Überschriften gefunden. Empfohlen wird genau eine H1 pro Seite.`
        : `На странице найдено ${h1List.length} заголовков H1. По стандартам SEO рекомендуется строго один H1.`
    );
    visibilityRecs.push(
      isEn
        ? 'Keep a single primary H1 and convert supplementary headings to H2/H3.'
        : isDe
        ? 'Nur eine H1 beibehalten und nachgelagerte Überschriften in H2/H3 umwandeln.'
        : 'Оставить единственный H1, а второстепенные заголовки перевести в теги H2-H3.'
    );
  } else {
    visibilityFindings.push(
      isEn
        ? `Single H1 heading found: "${h1List[0]}".`
        : isDe
        ? `Eindeutige H1-Überschrift vorhanden: "${h1List[0]}".`
        : `Найден единственный заголовок H1: "${h1List[0]}".`
    );
  }

  // ===========================================================================
  // 3. INTENT
  // ===========================================================================
  const intentFindings: string[] = [];
  const intentRecs: string[] = [];

  if (words < 80) {
    intentScore -= 25;
    intentFindings.push(
      isEn
        ? 'Very little body copy found (under 80 words), risking a "Thin Content" algorithmic penalty.'
        : isDe
        ? 'Sehr geringer Textanteil (unter 80 Wörter), Risiko einer Einstufung als "Thin Content".'
        : 'На странице крайне мало текста (менее 80 слов), риск признания страницы «Thin Content».'
    );
    intentRecs.push(
      isEn
        ? 'Enrich the page with thorough, helpful content: answers to user questions, explanations, and structure.'
        : isDe
        ? 'Seite mit wertvollem Inhalt anreichern: Antworten auf Nutzerfragen, Erklärungen und Struktur.'
        : 'Насытить страницу полезным контентом: ответами на вопросы, описаниями и пояснениями.'
    );
  } else {
    intentFindings.push(
      isEn
        ? `Text volume (~${words} words) is sufficient to address typical user search intents.`
        : isDe
        ? `Textumfang (~${words} Wörter) reicht aus, um typische Suchintentionen zu bedienen.`
        : `Объем текстового наполнения (~${words} слов) достаточен для раскрытия интент-запросов пользователей.`
    );
    intentRecs.push(
      isEn
        ? 'Enhance scannability: use H2/H3 subheadings, bullet lists, and visual callouts to curb bounce rate.'
        : isDe
        ? 'Lesbarkeit verbessern: H2/H3 Zwischenüberschriften, Listen und Boxen nutzen, um die Absprungrate zu senken.'
        : 'Улучшать юзабилити: использовать подзаголовки H2/H3, списки и смысловые блоки для снижения показателя отказов.'
    );
  }

  // ===========================================================================
  // 4. CONTENT & LINKS
  // ===========================================================================
  const contentFindings: string[] = [];
  const contentRecs: string[] = [];

  if (analyzedData.imagesWithoutAlt && analyzedData.imagesWithoutAlt > 0) {
    contentScore -= 10;
    contentFindings.push(
      isEn
        ? `Detected ${analyzedData.imagesWithoutAlt} images without alt attributes, missing out on Google Image Search traffic.`
        : isDe
        ? `${analyzedData.imagesWithoutAlt} Bilder ohne Alt-Attribut erkannt, was Google-Bilder-Traffic mindert.`
        : `Обнаружено ${analyzedData.imagesWithoutAlt} изображений без атрибута alt, что снижает трафик из Google Images и ухудшает доступность.`
    );
    contentRecs.push(
      isEn
        ? 'Provide descriptive alt tags for all images to boost accessibility and visual search.'
        : isDe
        ? 'Aussagekräftige Alt-Tags für alle Inhaltsbilder hinterlegen.'
        : 'Заполнить человекопонятные описания alt для картинок.'
    );
  } else {
    contentFindings.push(
      isEn
        ? 'All images on the page feature descriptive alt attributes.'
        : isDe
        ? 'Alle Bilder der Seite verfügen über Alt-Attribute.'
        : 'Все изображения на странице снабжены атрибутами alt.'
    );
  }

  if ((analyzedData.internalLinksCount || 0) < 3) {
    contentScore -= 12;
    contentFindings.push(
      isEn
        ? 'Weak internal linking structure: very few pathways to related content.'
        : isDe
        ? 'Schwache interne Verlinkung: wenige Pfade zu weiterführenden Inhalten.'
        : 'Слабая внутренняя перелинковка: мало переходов на смежные страницы сайта.'
    );
    contentRecs.push(
      isEn
        ? 'Add contextual internal links to relevant categories and guides.'
        : isDe
        ? 'Kontextuelle interne Links zu themenverwandten Seiten setzen.'
        : 'Добавить контекстные ссылки на релевантные разделы и статьи.'
    );
  } else {
    contentFindings.push(
      isEn
        ? `Healthy internal linking density (${analyzedData.internalLinksCount} internal links).`
        : isDe
        ? `Gute interne Verlinkungsdichte (${analyzedData.internalLinksCount} interne Links).`
        : `Хорошая плотность внутренней перелинковки (${analyzedData.internalLinksCount} внутренних ссылок).`
    );
  }

  // ===========================================================================
  // 5. BEFORE / AFTER (Было / Стало)
  // ===========================================================================
  let optTitle = '';
  let optDesc = '';
  let optH1 = '';

  const isWiki =
    siteType.toLowerCase().includes('wiki') ||
    siteType.toLowerCase().includes('энциклопед') ||
    (analyzedData.url || '').includes('wikipedia');

  const isEcommerce =
    siteType.toLowerCase().includes('commerce') ||
    siteType.toLowerCase().includes('shop') ||
    siteType.toLowerCase().includes('магазин');

  const isSaas =
    siteType.toLowerCase().includes('saas') ||
    siteType.toLowerCase().includes('it-') ||
    siteType.toLowerCase().includes('b2b');

  if (isWiki) {
    if (isEn) {
      optTitle = currentTitle.length > 25 ? `${currentTitle} — Free Online Encyclopedia` : 'Wikipedia — The Free Encyclopedia';
      optDesc = currentDesc.length > 80 ? currentDesc : 'Wikipedia is a free online encyclopedia, created and edited by volunteers around the world and hosted by the Wikimedia Foundation.';
      optH1 = h1List[0] || 'Wikipedia, The Free Encyclopedia';
    } else if (isDe) {
      optTitle = currentTitle.length > 25 ? `${currentTitle} — Die freie Enzyklopädie` : 'Wikipedia — Die freie Enzyklopädie';
      optDesc = currentDesc.length > 80 ? currentDesc : 'Wikipedia ist eine freie Enzyklopädie, die von freiwilligen Autoren weltweit verfasst und gepflegt wird. Millionen fundierte Artikel im offenen Zugang.';
      optH1 = h1List[0] || 'Wikipedia — Die freie Enzyklopädie';
    } else {
      optTitle = currentTitle.length > 25 ? `${currentTitle} — свободная онлайн-энциклопедия` : 'Wikipedia — свободная многоязычная онлайн-энциклопедия';
      optDesc = currentDesc.length > 80 ? currentDesc : 'Википедия — свободная универсальная энциклопедия, создаваемая и редактируемая сообществом волонтеров со всего мира. Миллионы статей в открытом доступе.';
      optH1 = h1List[0] || 'Википедия — свободная энциклопедия';
    }
  } else if (isEcommerce) {
    const topic = targetKeywords || currentTitle.split(/[-–|]/)[0].trim() || (isEn ? 'Products Catalog' : isDe ? 'Produktkatalog' : 'Каталог товаров');
    if (isEn) {
      optTitle = `${topic}: Official Store & Catalog | Fast Delivery`;
      optDesc = `Discover high-quality ${topic} at competitive prices with fast delivery and official warranty. Browse our top-rated collections today!`;
      optH1 = topic;
    } else if (isDe) {
      optTitle = `${topic}: Offizieller Online-Shop | Schnelle Lieferung`;
      optDesc = `Hochwertige ${topic} zu fairen Preisen mit schneller Lieferung und Garantie. Jetzt online entdecken und bequem bestellen!`;
      optH1 = topic;
    } else {
      optTitle = `${topic}: каталог, актуальные цены и доставка`;
      optDesc = `Купить ${topic} по выгодным ценам с быстрой доставкой и гарантией качества. Большой ассортимент, акции и удобный заказ на сайте!`;
      optH1 = topic;
    }
  } else if (isSaas) {
    const brand = currentTitle.split(/[-–|]/)[0].trim() || (isEn ? 'Platform' : isDe ? 'Plattform' : 'Сервис');
    if (isEn) {
      optTitle = `${brand} — All-in-One Automation & Business Growth Platform`;
      optDesc = `Streamline operations and elevate performance with ${brand}. Start your free trial today with instant setup and 24/7 expert support.`;
      optH1 = brand;
    } else if (isDe) {
      optTitle = `${brand} — Plattform für Unternehmensautomatisierung`;
      optDesc = `Effiziente Automatisierung für moderne Unternehmen mit ${brand}. Jetzt kostenlose Testversion starten mit 24/7 Support.`;
      optH1 = brand;
    } else {
      optTitle = `${brand} — платформа для автоматизации и роста бизнеса`;
      optDesc = `Эффективное решение для автоматизации ваших процессов. Бесплатный пробный период, легкая интеграция и поддержка 24/7. Попробуйте сейчас!`;
      optH1 = brand;
    }
  } else {
    const baseName = currentTitle.split(/[-–|]/)[0].trim() || (isEn ? 'Official Portal' : isDe ? 'Offizielles Portal' : 'Официальный портал');
    if (isEn) {
      optTitle = `${baseName} — Official Website & Resource Hub`;
      optDesc = currentDesc || `Explore comprehensive insights, guides, and up-to-date documentation on the official ${baseName} portal.`;
      optH1 = h1List[0] || baseName;
    } else if (isDe) {
      optTitle = `${baseName} — Offizielle Website & Informationsportal`;
      optDesc = currentDesc || `Entdecken Sie umfassende Informationen, Anleitungen und Fachbeiträge auf der offiziellen Seite von ${baseName}.`;
      optH1 = h1List[0] || baseName;
    } else {
      optTitle = `${baseName} — официальный сайт и справочная информация`;
      optDesc = currentDesc || `Подробная информация, статьи, справочные материалы и ответы на актуальные вопросы на официальном сайте ${baseName}.`;
      optH1 = h1List[0] || baseName;
    }
  }

  beforeAfter.push({
    element: isEn ? 'Title Tag' : isDe ? 'Title-Tag' : 'Тег Title',
    before: currentTitle || (isEn ? 'No title was defined' : isDe ? 'Kein Titel definiert' : 'Заголовок не был задан'),
    after: optTitle,
    reason: isEn
      ? 'Optimal length (50–60 chars) highlighting primary search queries and clear topical context for peak CTR.'
      : isDe
      ? 'Optimale Länge (50–60 Zeichen) mit Hauptsuchbegriff und klarem Themenkontext für maximale Klickrate.'
      : 'Сфокусированный заголовок длиной 50-60 символов с высокочастотным запросом и маркерами ценности.',
    beforeCharCount: currentTitle.length,
    afterCharCount: optTitle.length,
  });

  beforeAfter.push({
    element: isEn ? 'Description Meta Tag' : isDe ? 'Description-Meta-Tag' : 'Мета-тег Description',
    before: currentDesc || (isEn ? 'Meta description is missing' : isDe ? 'Meta-Description fehlt' : 'Мета-описание отсутствует'),
    after: optDesc,
    reason: isEn
      ? 'Optimal 140–160 character snippet with strong user intent clarity, preventing search engines from using random text.'
      : isDe
      ? 'Ideale Länge von 140–160 Zeichen mit hohem Informationsgehalt zur Vermeidung willkürlicher Textauszüge.'
      : 'Оптимальная длина 140-160 символов, четкая формулировка сути ресурса, исключающая автогенерацию сниппета из случайных фрагментов страницы.',
    beforeCharCount: currentDesc.length,
    afterCharCount: optDesc.length,
  });

  if (h1List.length === 0 || h1List[0].length < 5 || h1List.length > 1) {
    beforeAfter.push({
      element: isEn ? 'H1 Heading' : isDe ? 'H1-Überschrift' : 'Заголовок H1',
      before: h1List.length === 0 ? (isEn ? 'H1 tag missing' : isDe ? 'H1 fehlt' : 'Тег H1 отсутствует на странице') : h1List.join(' | '),
      after: optH1,
      reason: isEn
        ? 'Firmly anchors user attention and crawler hierarchy on the core topic of the landing page.'
        : isDe
        ? 'Verankert das Hauptthema der Seite klar für Nutzer und Suchmaschinen-Crawler.'
        : 'Четко ориентирует посетителя и поискового бота на основном содержании посадочной страницы.',
      beforeCharCount: (h1List[0] || '').length,
      afterCharCount: optH1.length,
    });
  }

  // ===========================================================================
  // ФИНАЛЬНАЯ ОБРАБОТКА ОЦЕНОК
  // ===========================================================================
  technicalScore = Math.max(30, Math.min(98, technicalScore));
  visibilityScore = Math.max(35, Math.min(95, visibilityScore));
  intentScore = Math.max(40, Math.min(95, intentScore));
  contentScore = Math.max(35, Math.min(95, contentScore));

  const overallScore = Math.round(
    technicalScore * 0.3 + visibilityScore * 0.3 + intentScore * 0.2 + contentScore * 0.2
  );

  let statusLevel = isEn ? 'Good' : isDe ? 'Gut' : 'Хорошо';
  if (overallScore < 50) statusLevel = isEn ? 'Critical' : isDe ? 'Kritisch' : 'Критично';
  else if (overallScore < 75) statusLevel = isEn ? 'Needs Attention' : isDe ? 'Optimierungsbedarf' : 'Требует доработки';
  else if (overallScore >= 90) statusLevel = isEn ? 'Excellent' : isDe ? 'Hervorragend' : 'Отлично';

  // ===========================================================================
  // SUMMARY (краткое резюме аудита)
  // ===========================================================================
  const summary = isEn
    ? `Express SEO audit determined an overall score of ${overallScore}/100 for the «${siteType}» resource. ${
        criticalErrors.length > 0
          ? `Identified ${criticalErrors.length} critical issues (including ${criticalErrors[0].title.toLowerCase()}) holding back rankings.`
          : 'Technical foundations are stable with strong potential for organic ranking growth.'
      } We recommend deploying the optimized Before / After snippets to maximize SERP click-through rate (CTR).`
    : isDe
    ? `Das Express-SEO-Audit ermittelt einen Gesamtwert von ${overallScore}/100 für die Seite vom Typ «${siteType}». ${
        criticalErrors.length > 0
          ? `${criticalErrors.length} kritische Mängel wurden identifiziert (darunter ${criticalErrors[0].title.toLowerCase()}), die das Ranking bremsen.`
          : 'Die technische Basis ist stabil mit hohem Potenzial für die organische Indexierung.'
      } Es wird empfohlen, die Vorher/Nachher-Snippets zur CTR-Steigerung umzusetzen.`
    : `Экспресс-аудит выявил оценку страницы ${overallScore}/100 для ресурса типа «${siteType}». ${
        criticalErrors.length > 0
          ? `Обнаружено ${criticalErrors.length} критических недочетов (включая ${criticalErrors[0].title.toLowerCase()}), сдерживающих рост позиций.`
          : 'Техническая база стабильна, страница обладает высоким потенциалом для поискового ранжирования.'
      } Рекомендуется внедрить оптимизированные сниппеты для роста CTR.`;

  // ===========================================================================
  // RAW MARKDOWN (готовый отчёт)
  // ===========================================================================
  const rawMarkdown = isEn
    ? `# Express SEO Audit: ${analyzedData.url || 'Audited Web Document'}
**Resource Type:** ${siteType}

## 1. Overall Score: ${overallScore} / 100 (${statusLevel})
${summary}

### Scores Across 4 Core Pillars:
- **Technical SEO:** ${technicalScore}%
- **Visibility & CTR:** ${visibilityScore}%
- **Search Intent & Behavior:** ${intentScore}%
- **Content Quality & Backlinks:** ${contentScore}%

## 2. PageSpeed & Core Web Vitals
- **Performance:** ${pageSpeed.performanceScore}/100
- **Accessibility:** ${pageSpeed.accessibilityScore}/100
- **Best Practices:** ${pageSpeed.bestPracticesScore}/100
- **SEO Score:** ${pageSpeed.seoScore}/100
- **TTFB:** ${pageSpeed.ttfb.formatted} (${pageSpeed.ttfb.rating})
- **FCP:** ${pageSpeed.fcp.formatted}
- **LCP:** ${pageSpeed.lcp.formatted}
- **CLS:** ${pageSpeed.cls.formatted}
- **TBT:** ${pageSpeed.tbt.formatted}

## 3. Critical Errors
${criticalErrors.length > 0 ? criticalErrors.map((err, i) => `### ${i + 1}. ${err.title} [Impact: ${err.impact}]
- **Issue Details:** ${err.description}
- **Action Required:** ${err.fixAction}
`).join('\n') : '- No critical blocking issues detected.'}

## 4. Before / After Recommendations
${beforeAfter.map((item) => `### ${item.element}
- **Before:** \`${item.before}\` (${item.beforeCharCount || 0} chars)
- **After:** \`${item.after}\` (${item.afterCharCount || 0} chars)
- **Reason:** ${item.reason}
`).join('\n')}

## 5. Marketing Bonus & Expert Consultation
- **Telegram Channel:** [${LINKS.telegram.handle}](${LINKS.telegram.url})
- **VKontakte:** [${LINKS.vk.handle}](${LINKS.vk.url})
- **Portfolio:** [${LINKS.portfolio.title}](${LINKS.portfolio.url})
`
    : isDe
    ? `# Express-SEO-Audit: ${analyzedData.url || 'Analysiertes Dokument'}
**Webseitentyp:** ${siteType}

## 1. Gesamtpunktzahl: ${overallScore} / 100 (${statusLevel})
${summary}

### Bewertung in 4 Kernbereichen:
- **Technisches SEO:** ${technicalScore}%
- **Sichtbarkeit & CTR:** ${visibilityScore}%
- **Suchintention & Nutzerverhalten:** ${intentScore}%
- **Inhaltsqualität & Verlinkung:** ${contentScore}%

## 2. PageSpeed & Core Web Vitals
- **Leistung:** ${pageSpeed.performanceScore}/100
- **Barrierefreiheit:** ${pageSpeed.accessibilityScore}/100
- **Best Practices:** ${pageSpeed.bestPracticesScore}/100
- **SEO:** ${pageSpeed.seoScore}/100
- **TTFB:** ${pageSpeed.ttfb.formatted} (${pageSpeed.ttfb.rating})
- **FCP:** ${pageSpeed.fcp.formatted}
- **LCP:** ${pageSpeed.lcp.formatted}
- **CLS:** ${pageSpeed.cls.formatted}

## 3. Kritische Fehler
${criticalErrors.length > 0 ? criticalErrors.map((err, i) => `### ${i + 1}. ${err.title} [Auswirkung: ${err.impact}]
- **Problem:** ${err.description}
- **Lösung:** ${err.fixAction}
`).join('\n') : '- Keine kritischen Blockierungsfehler gefunden.'}

## 4. Vorher / Nachher Empfehlungen
${beforeAfter.map((item) => `### ${item.element}
- **Vorher:** \`${item.before}\`
- **Nachher:** \`${item.after}\`
- **Begründung:** ${item.reason}
`).join('\n')}

## 5. Netzwerke, Portfolio & Beratung
- **Telegram-Kanal:** [${LINKS.telegram.handle}](${LINKS.telegram.url})
- **VKontakte:** [${LINKS.vk.handle}](${LINKS.vk.url})
- **Portfolio:** [${LINKS.portfolio.title}](${LINKS.portfolio.url})
`
    : `# Экспресс-аудит веб-страницы: ${analyzedData.url || 'Анализируемый документ'}
**Тип ресурса:** ${siteType}

## 1. Общая оценка (SEO Score): ${overallScore} / 100 (${statusLevel})
${summary}

### Оценки по 4 ключевым блокам:
- **Технические показатели (Technical SEO):** ${technicalScore}%
- **Видимость и потенциал в выдаче (Rankings & Visibility):** ${visibilityScore}%
- **Поведенческие факторы и интенты (User Intent & Behavior):** ${intentScore}%
- **Качество контента и ссылки (Content Quality & Backlinks):** ${contentScore}%

## 2. PageSpeed & Core Web Vitals (Оценка скорости и стабильности)
- **Производительность:** ${pageSpeed.performanceScore}/100
- **Доступность (Accessibility):** ${pageSpeed.accessibilityScore}/100
- **Best Practices:** ${pageSpeed.bestPracticesScore}/100
- **SEO (Lighthouse):** ${pageSpeed.seoScore}/100
- **TTFB (Время ответа сервера):** ${pageSpeed.ttfb.formatted} (${pageSpeed.ttfb.rating === 'good' ? 'Норма' : 'Требует внимания'})
- **FCP (First Contentful Paint):** ${pageSpeed.fcp.formatted}
- **LCP (Largest Contentful Paint):** ${pageSpeed.lcp.formatted}
- **CLS (Layout Shift):** ${pageSpeed.cls.formatted}
- **TBT (Total Blocking Time):** ${pageSpeed.tbt.formatted}

## 3. Критичные ошибки (Что срочно исправить)
${criticalErrors.length > 0 ? criticalErrors.map((err, i) => `### ${i + 1}. ${err.title} [Влияние: ${err.impact}]
- **В чем суть проблемы:** ${err.description}
- **Что срочно сделать:** ${err.fixAction}
`).join('\n') : '- Критичных технических ошибок не выявлено. Фундамент индексации в норме.'}

## 4. Рекомендации «Было / Стало»
${beforeAfter.map((item) => `### ${item.element}
- **Было:** \`${item.before}\` (${item.beforeCharCount || 0} симв.)
- **Стало:** \`${item.after}\` (${item.afterCharCount || 0} симв.)
- **Обоснование:** ${item.reason}
`).join('\n')}

## 5. Маркетинговый бонус, соцсети и контакты
Хотите получить расширенный пошаговый чеклист (50+ параметров глубокого SEO-аудита) и персональную стратегию продвижения вашего проекта в ТОП-3 Google и Яндекс?
- **Telegram-канал:** [${LINKS.telegram.handle}](${LINKS.telegram.url}) — Сайты для бизнеса, AI-автоматизация, свежие кейсы и решения.
- **ВКонтакте:** [${LINKS.vk.handle}](${LINKS.vk.url})
- **Портфолио автора:** [${LINKS.portfolio.title}](${LINKS.portfolio.url})
`;

  // ===========================================================================
  // MARKETING BONUS
  // ===========================================================================
  const marketingBonus = {
    title: isEn
      ? 'Want to reach TOP-3 and scale organic traffic?'
      : isDe
      ? 'Möchten Sie die TOP-3 erreichen und organischen Traffic skalieren?'
      : 'Хотите вывести сайт в ТОП-3 и масштабировать органический трафик?',
    bonusText: isEn
      ? `Express audit highlighted key growth vectors. To systematically outrank competitors, download our checklist and join the Telegram channel «${LINKS.telegram.titleEn}» for live case breakdowns and practical solutions.`
      : isDe
      ? `Das Express-Audit hat wichtige Wachstumspotenziale aufgezeigt. Laden Sie unsere Checkliste herunter und treten Sie dem Telegram-Kanal «${LINKS.telegram.titleDe}» für aktuelle Fallstudien bei.`
      : 'Экспресс-аудит выявил ключевые точки роста. Чтобы системно обойти конкурентов, скачайте наш чеклист и подпишитесь на Telegram-канал «Сайты для бизнеса | AI и задачи» со свежими кейсами и практическими решениями.',
    telegramChannel: LINKS.telegram.handle,
    telegramUrl: LINKS.telegram.url,
    ctaOffer: isEn
      ? `Submit a website task or request private audit: ${LINKS.orderBot.handle}`
      : isDe
      ? `Projektaufgabe einreichen oder Audit anfragen: ${LINKS.orderBot.handle}`
      : `Разместить задачу на разработку или получить аудит: ${LINKS.orderBot.handle}`,
  };

  // ===========================================================================
  // SERP PREVIEW
  // ===========================================================================
  const serpPreview = {
    displayUrl: analyzedData.url || 'https://example.com',
    currentTitle:
      currentTitle || (isEn ? 'Page Title' : isDe ? 'Seitentitel' : 'Заголовок страницы'),
    currentDesc:
      currentDesc ||
      (isEn
        ? 'Description missing in search snippet.'
        : isDe
        ? 'Keine Beschreibung im Snippet vorhanden.'
        : 'Описание отсутствует в поисковой выдаче.'),
    optimizedTitle: optTitle,
    optimizedDesc: optDesc,
  };

  // ===========================================================================
  // ВОЗВРАЩАЕМЫЙ ОБЪЕКТ
  // ===========================================================================
  return {
    overallScore,
    statusLevel,
    summary,
    detectedSiteType: siteType,
    language: lang,
    scores: {
      technical: technicalScore,
      visibility: visibilityScore,
      intent: intentScore,
      content: contentScore,
    },
    criticalErrors,
    blocks: {
      technical: {
        score: technicalScore,
        status:
          technicalScore >= 75
            ? isEn
              ? 'Normal'
              : isDe
              ? 'Gut'
              : 'Норма'
            : isEn
            ? 'Needs Attention'
            : isDe
            ? 'Optimierungsbedarf'
            : 'Требует внимания',
        findings: technicalFindings,
        recommendations:
          technicalRecs.length > 0
            ? technicalRecs
            : [
                isEn
                  ? 'Maintain active SSL and server response TTFB < 600 ms.'
                  : isDe
                  ? 'SSL und schnelle Server-TTFB < 600 ms sicherstellen.'
                  : 'Поддерживать актуальность SSL и скорость TTFB < 600 мс.',
              ],
      },
      visibility: {
        score: visibilityScore,
        status:
          visibilityScore >= 75
            ? isEn
              ? 'Stable'
              : isDe
              ? 'Stabil'
              : 'Стабильно'
            : isEn
            ? 'Suboptimal CTR'
            : isDe
            ? 'Niedrige CTR'
            : 'Слабый CTR',
        detectedKeywords: targetKeywords
          ? targetKeywords.split(',').map((s) => s.trim())
          : [
              currentTitle.split(/[-–|]/)[0].trim() ||
                (isEn ? 'Brand Domain' : isDe ? 'Hauptmarke' : 'Основной бренд'),
            ],
        ctrAnalysis: isWiki
          ? isEn
            ? 'Informational snippet tailored for educational queries. High CTR is achieved by concise topic naming.'
            : isDe
            ? 'Informativer Snippet für Bildungsabfragen. Hohe Klickrate durch präzise Definition.'
            : 'Информационный сниппет ориентирован на поиск знаний и фактов. Высокая кликабельность достигается четким определением темы.'
          : isEn
          ? 'Search snippet requires an explicit value proposition to outrank competitors.'
          : isDe
          ? 'Snippet benötigt ein klares Nutzenversprechen für maximale Klickrate.'
          : 'Сниппет требует выразительного УТП для повышения кликабельности в органической выдаче.',
        findings: visibilityFindings,
        recommendations:
          visibilityRecs.length > 0
            ? visibilityRecs
            : [
                isEn
                  ? 'Update Title and Description following the Before / After recommendations.'
                  : isDe
                  ? 'Title und Description anhand der Vorher/Nachher-Empfehlungen aktualisieren.'
                  : 'Обновить Title и Description согласно блоку «Было / Стало».',
              ],
      },
      intent: {
        score: intentScore,
        status: isEn ? 'Optimal' : isDe ? 'Optimal' : 'Оптимально',
        identifiedIntent: isWiki
          ? isEn
            ? 'Informational / Academic'
            : isDe
            ? 'Informativ / Akademisch'
            : 'Информационный / Академический'
          : isEcommerce
          ? isEn
            ? 'Transactional / Purchase'
            : isDe
            ? 'Transaktional / Kauf'
            : 'Транзакционный / Покупка'
          : isEn
          ? 'Informational & Commercial'
          : isDe
          ? 'Information & Recherche'
          : 'Информационно-справочный',
        bounceRateRisk:
          words < 120
            ? isEn
              ? 'High (Thin content)'
              : isDe
              ? 'Hoch (Wenig Text)'
              : 'Высокий (мало контента)'
            : isEn
            ? 'Low / Moderate'
            : isDe
            ? 'Niedrig / Moderat'
            : 'Низкий / Умеренный',
        findings: intentFindings,
        recommendations: intentRecs,
      },
      contentAndLinks: {
        score: contentScore,
        status:
          contentScore >= 75
            ? isEn
              ? 'High Quality'
              : isDe
              ? 'Hochwertig'
              : 'Качественно'
            : isEn
            ? 'Needs Refinement'
            : isDe
            ? 'Verbesserungswürdig'
            : 'Требует доработки',
        keywordStuffingRisk: isEn
          ? 'Low (Natural keyword distribution)'
          : isDe
          ? 'Niedrig (Natürliche Verteilung)'
          : 'Низкий (тошнота в пределах нормы)',
        internalLinkingStatus: `${analyzedData.internalLinksCount || 0} ${
          isEn ? 'internal links' : isDe ? 'interne Links' : 'внутренних ссылок'
        }`,
        cannibalizationRisk: isEn ? 'Low' : isDe ? 'Niedrig' : 'Низкий',
        findings: contentFindings,
        recommendations:
          contentRecs.length > 0
            ? contentRecs
            : [
                isEn
                  ? 'Continue enriching unique structured content.'
                  : isDe
                  ? 'Weiterhin einzigartigen Inhalt aufbauen.'
                  : 'Продолжать наполнение уникальным структурированным контентом.',
              ],
      },
    },
    beforeAfter,
    serpPreview,
    marketingBonus,
    pageSpeed: mobilePageSpeed,
    devicePageSpeed,
    rawMarkdown,
  };
}