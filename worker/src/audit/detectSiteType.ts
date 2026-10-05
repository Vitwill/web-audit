// -----------------------------------------------------------------------------
// detectSiteType — определение типа веб-ресурса по контенту.
// -----------------------------------------------------------------------------
//
// ЧТО ДЕЛАЕТ:
// По URL, title, description, заголовкам и фрагменту текста определяет
// тип сайта: интернет-магазин, SaaS, корпоративный сайт, энциклопедия,
// медиа/блог или информационный ресурс.
//
// Используется в:
//   - worker/src/scraper/parseHtmlData.ts   (первичный парсинг)
//   - worker/src/audit/fallback.ts          (алгоритмический аудит)
//   - worker/src/audit/gemini.ts            (формирование промпта)
//
// ОСОБЕННОСТИ:
//   - Поддерживает RU/EN/DE: возвращает локализованное название типа.
//   - Для латиницы использует regex с границами слов (\bapi\b),
//     чтобы не ловить "capital" при поиске "api".
//   - Для кириллицы \b в JS не работает корректно, поэтому
//     используется простое includes().
// -----------------------------------------------------------------------------

export type SiteLang = 'ru' | 'en' | 'de';

/**
 * Определяет тип веб-ресурса по контенту.
 *
 * @param url       — URL страницы (используется для распознавания wikipedia.org и т.п.)
 * @param title     — тег title
 * @param desc      — meta description
 * @param headings  — массив всех заголовков H1-H3
 * @param text      — фрагмент тела страницы (первые ~1500 символов)
 * @param lang      — язык отчёта ('ru' | 'en' | 'de'), влияет на возвращаемую строку
 */
export function detectSiteType(
  url: string,
  title: string,
  desc: string,
  headings: string[],
  text: string,
  lang: SiteLang = 'ru'
): string {
  const combined = `${url} ${title} ${desc} ${headings.join(' ')} ${text}`.toLowerCase();

  // ---------------------------------------------------------------------------
  // Хелпер: проверка наличия слова с границами.
  // Для русского/немецкого слова через \b работают плохо из-за кириллицы
  // и умляутов, поэтому используем includes(). Для латиницы — \b.
  // ---------------------------------------------------------------------------
  const hasWord = (w: string): boolean => {
    // Если в слове есть не-ASCII символы (кириллица, умляуты) — includes()
    if (/[^\x00-\x7F]/.test(w)) {
      return combined.includes(w);
    }
    const re = new RegExp(`\\b${escapeRegex(w)}\\b`, 'i');
    return re.test(combined);
  };

  // ---------------------------------------------------------------------------
  // 1. Wikipedia / энциклопедия / библиотека
  // ---------------------------------------------------------------------------
  if (
    hasWord('wikipedia') ||
    hasWord('wiki') ||
    hasWord('энциклопедия') ||
    hasWord('словарь') ||
    hasWord('справочник') ||
    hasWord('библиотека') ||
    hasWord('encyclopedia') ||
    hasWord('lexicon') ||
    (hasWord('articles') && hasWord('donate'))
  ) {
    if (lang === 'en') return 'Encyclopedia / Wiki Portal';
    if (lang === 'de') return 'Enzyklopädie / Wiki-Portal';
    return 'Информационный портал / Энциклопедия';
  }

  // ---------------------------------------------------------------------------
  // 2. E-commerce / интернет-магазин
  // ---------------------------------------------------------------------------
  if (
    hasWord('корзина') ||
    hasWord('купить') ||
    hasWord('каталог') ||
    hasWord('руб') ||
    hasWord('цена') ||
    hasWord('доставка') ||
    hasWord('интернет-магазин') ||
    hasWord('checkout') ||
    hasWord('cart') ||
    hasWord('shop') ||
    hasWord('product') ||
    hasWord('price') ||
    hasWord('store')
  ) {
    if (lang === 'en') return 'E-commerce / Online Store';
    if (lang === 'de') return 'Online-Shop / E-Commerce';
    return 'Интернет-магазин / E-commerce';
  }

  // ---------------------------------------------------------------------------
  // 3. B2B SaaS / IT-сервис
  // ---------------------------------------------------------------------------
  if (
    hasWord('saas') ||
    hasWord('платформа') ||
    hasWord('crm') ||
    hasWord('api') ||
    hasWord('software') ||
    hasWord('integration') ||
    hasWord('dashboard') ||
    hasWord('automation') ||
    hasWord('сервис')
  ) {
    if (lang === 'en') return 'B2B SaaS / IT Service';
    if (lang === 'de') return 'B2B SaaS / IT-Dienst';
    return 'B2B SaaS / IT-сервис';
  }

  // ---------------------------------------------------------------------------
  // 4. Корпоративный сайт / услуги
  // ---------------------------------------------------------------------------
  if (
    hasWord('услуги') ||
    hasWord('консультация') ||
    hasWord('юридическ') ||
    hasWord('клиника') ||
    hasWord('стоматологи') ||
    hasWord('ремонт') ||
    hasWord('заявка') ||
    hasWord('services') ||
    hasWord('consulting') ||
    hasWord('legal')
  ) {
    if (lang === 'en') return 'Corporate Website / Services';
    if (lang === 'de') return 'Unternehmensportal / Dienstleistungen';
    return 'Корпоративный сайт / Услуги';
  }

  // ---------------------------------------------------------------------------
  // 5. Медиа / новостной портал / блог
  // ---------------------------------------------------------------------------
  if (
    hasWord('новости') ||
    hasWord('блог') ||
    hasWord('статьи') ||
    hasWord('журнал') ||
    hasWord('news') ||
    hasWord('blog') ||
    hasWord('article') ||
    hasWord('magazine')
  ) {
    if (lang === 'en') return 'Media / News Blog';
    if (lang === 'de') return 'Medien / Nachrichtenportal';
    return 'Медиа / Новостной портал';
  }

  // ---------------------------------------------------------------------------
  // 6. Fallback — общий информационный ресурс
  // ---------------------------------------------------------------------------
  if (lang === 'en') return 'Informational Web Resource';
  if (lang === 'de') return 'Informations-Webseite';
  return 'Информационный веб-ресурс';
}

// -----------------------------------------------------------------------------
// Экранирование спецсимволов regex.
// -----------------------------------------------------------------------------
function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}