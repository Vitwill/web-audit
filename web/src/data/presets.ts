import { Language } from '../types/seo';

export interface PresetCase {
  id: string;
  name: string;
  category: string;
  badge: string;
  description: string;
  nameI18n?: Record<Language, string>;
  categoryI18n?: Record<Language, string>;
  descriptionI18n?: Record<Language, string>;
  data: {
    url: string;
    hasSsl: boolean;
    title: string;
    description: string;
    h1: string;
    h2List: string[];
    h3List: string[];
    robots: string;
    viewport: string;
    canonical: string;
    imagesTotal: number;
    imagesWithoutAlt: number;
    internalLinksCount: number;
    externalLinksCount: number;
    responseTimeMs: number;
    targetKeywords: string;
    contentText: string;
  };
}

export const PRESET_CASES: PresetCase[] = [
  {
    id: 'ecommerce-furniture',
    name: 'Интернет-магазин дизайнерской мебели',
    category: 'E-commerce',
    badge: 'Каталог & Товары',
    description: 'Типичные ошибки интернет-магазина: скудный Title, нет цен и УТП в сниппете, 18 картинок без alt, размытый интент.',
    nameI18n: {
      ru: 'Интернет-магазин дизайнерской мебели',
      en: 'Designer Furniture E-commerce Store',
      de: 'Designer-Möbel Online-Shop',
    },
    categoryI18n: {
      ru: 'E-commerce',
      en: 'E-commerce',
      de: 'E-Commerce',
    },
    descriptionI18n: {
      ru: 'Типичные ошибки интернет-магазина: скудный Title, нет цен и УТП в сниппете, 18 картинок без alt, размытый интент.',
      en: 'Typical online shop issues: generic title, missing prices and USP in snippet, 18 images missing alt tags, unfocused search intent.',
      de: 'Typische Onlineshop-Mängel: generischer Titel, fehlende Preise und USPs im Snippet, 18 Bilder ohne Alt-Texte, unklare Suchintention.',
    },
    data: {
      url: 'https://loft-mebel-studio.ru/catalog/divany',
      hasSsl: true,
      title: 'Диваны - купить диван в интернет магазине недорого',
      description: 'В нашем каталоге представлены различные диваны. Большой выбор качественной мебели по выгодным ценам. Звоните прямо сейчас!',
      h1: 'Каталог диванов',
      h2List: ['Популярные модели', 'Преимущества нашей фабрики', 'Отзывы клиентов', 'Доставка и сборка'],
      h3List: ['Угловые диваны', 'Прямые диваны', 'Диваны-кровати'],
      robots: 'index, follow',
      viewport: 'width=device-width, initial-scale=1.0',
      canonical: 'https://loft-mebel-studio.ru/catalog/divany',
      imagesTotal: 24,
      imagesWithoutAlt: 18,
      internalLinksCount: 42,
      externalLinksCount: 2,
      responseTimeMs: 840,
      targetKeywords: 'дизайнерские диваны москва, купить прямой диван лофт, фабрика мебели',
      contentText: `В каталоге нашей мебельной фабрики вы можете заказать диваны от производителя. Мы производим качественную мебель уже более 7 лет. Доставка осуществляется по Москве и Московской области. Вся продукция сертифицирована. Гарантия на каркас 3 года. Сроки изготовления от 10 дней. Оплата при получении или онлайн картой на сайте.`,
    },
  },
  {
    id: 'b2b-saas',
    name: 'B2B SaaS платформа сквозной аналитики',
    category: 'SaaS / IT',
    badge: 'Сложный B2B интент',
    description: 'Критичный недостаток CTR: размытый заголовок, нет выгод для маркетологов, технический сленг без решения болей.',
    nameI18n: {
      ru: 'B2B SaaS платформа сквозной аналитики',
      en: 'B2B SaaS Attribution & Analytics Platform',
      de: 'B2B SaaS-Plattform für Marketing-Analytics',
    },
    categoryI18n: {
      ru: 'SaaS / IT',
      en: 'SaaS / Tech',
      de: 'SaaS / IT',
    },
    descriptionI18n: {
      ru: 'Критичный недостаток CTR: размытый заголовок, нет выгод для маркетологов, технический сленг без решения болей.',
      en: 'Low CTR problem: vague headline, missing measurable marketer benefits, jargon without addressing core pain points.',
      de: 'Geringe Klickrate: unklarer Titel, keine konkreten Marketer-Vorteile, technischer Jargon statt klarer Problemlösung.',
    },
    data: {
      url: 'https://metricflow.io',
      hasSsl: true,
      title: 'MetricFlow - Инновационная SaaS платформа нового поколения',
      description: 'Платформа для объединения данных и трекинга бизнес-метрик с передовыми возможностями машинного обучения и дашбордами.',
      h1: 'Интеллектуальная экосистема для ваших данных',
      h2List: ['Возможности платформы', 'Архитектура решений', 'Интеграции с CRM', 'Тарифные планы'],
      h3List: ['Real-time streaming', 'Multi-touch attribution', 'Custom webhooks'],
      robots: 'index, follow',
      viewport: 'width=device-width, initial-scale=1.0',
      canonical: '',
      imagesTotal: 12,
      imagesWithoutAlt: 6,
      internalLinksCount: 15,
      externalLinksCount: 4,
      responseTimeMs: 310,
      targetKeywords: 'сквозная аналитика для b2b, когортный анализ crm, атрибуция рекламы сервис',
      contentText: `MetricFlow агрегирует информацию из рекламных кабинетов Яндекс Директ, Google Ads, VK Реклама и популярных CRM систем. Сокращайте CPL и увеличивайте ROMI на 35%. Автоматический расчет LTV, CAC и когортный анализ в один клик. Попробуйте бесплатно 14 дней без привязки банковской карты.`,
    },
  },
  {
    id: 'health-blog',
    name: 'Медицинский информационный портал',
    category: 'YMYL / Блог',
    badge: 'Высокий риск спама',
    description: 'Переспам ключевыми словами (тошнота текста), отсутствие авторства врача (E-E-A-T), завышенная длина Description.',
    nameI18n: {
      ru: 'Медицинский информационный портал',
      en: 'Medical Health & Wellness Portal',
      de: 'Medizinisches Informationsportal',
    },
    categoryI18n: {
      ru: 'YMYL / Блог',
      en: 'YMYL / Blog',
      de: 'YMYL / Ratgeber',
    },
    descriptionI18n: {
      ru: 'Переспам ключевыми словами (тошнота текста), отсутствие авторства врача (E-E-A-T), завышенная длина Description.',
      en: 'Keyword stuffing risk, lack of verified medical doctor authorship (E-E-A-T), excessively bloated Description.',
      de: 'Gefahr durch Keyword-Spamming, fehlender medizinischer Autorenbeleg (E-E-A-T), überlange Description.',
    },
    data: {
      url: 'https://zdorovie-puls.ru/articles/lechenie-migreni-v-domashnih-usloviyah',
      hasSsl: true,
      title: 'Лечение мигрени в домашних условиях: как лечить мигрень быстро таблетки и народные средства от мигрени',
      description: 'Как быстро снять приступ мигрени дома? Узнайте лучшие способы лечения мигрени, симптомы мигрени, причины головной боли и эффективные народные средства от сильной мигрени прямо сейчас на нашем портале здоровья для всей семьи!',
      h1: 'Как быстро вылечить мигрень в домашних условиях: проверенные методы',
      h2List: ['Что такое мигрень и почему она возникает', 'Симптомы приступа мигрени у взрослых', 'Таблетки от мигрени: обзор препаратов', 'Народные рецепты и точечный массаж', 'Когда срочно нужно вызывать скорую'],
      h3List: ['Препараты триптанового ряда', 'Обезболивающие средства', 'Холодный компресс и покой'],
      robots: 'index, follow',
      viewport: 'width=device-width, initial-scale=1.0',
      canonical: 'https://zdorovie-puls.ru/articles/lechenie-migreni',
      imagesTotal: 8,
      imagesWithoutAlt: 1,
      internalLinksCount: 28,
      externalLinksCount: 1,
      responseTimeMs: 620,
      targetKeywords: 'лечение мигрени быстро, как снять приступ мигрени, симптомы мигрени',
      contentText: `Мигрень — это тяжелое неврологическое заболевание. Лечение мигрени требует комплексного подхода. Чтобы лечить мигрень быстро, необходимо вовремя принять таблетки от мигрени в начале ауры. В домашних условиях лечение мигрени народными средствами может облегчить пульсирующую боль в виске. Статья проверена врачом-неврологом высшей категории со стажем 15 лет. Имеются противопоказания, проконсультируйтесь со специалистом.`,
    },
  },
  {
    id: 'legal-landing',
    name: 'Лендинг адвоката по арбитражным спорам',
    category: 'Услуги',
    badge: 'Критичные технические ошибки',
    description: 'Отсутствует SSL-сертификат (HTTP), нет тега H1, Title состоит из одного слова, Description отсутствует вовсе.',
    nameI18n: {
      ru: 'Лендинг адвоката по арбитражным спорам',
      en: 'Arbitration Law & Legal Services Landing',
      de: 'Kanzlei-Landingpage für Wirtschaftsrecht',
    },
    categoryI18n: {
      ru: 'Услуги',
      en: 'Services / Legal',
      de: 'Dienstleistungen / Recht',
    },
    descriptionI18n: {
      ru: 'Отсутствует SSL-сертификат (HTTP), нет тега H1, Title состоит из одного слова, Description отсутствует вовсе.',
      en: 'Missing SSL certificate (HTTP), no H1 heading, one-word Title, and completely empty Description.',
      de: 'Fehlendes SSL-Zertifikat (HTTP), keine H1-Überschrift, Ein-Wort-Title und komplett fehlende Description.',
    },
    data: {
      url: 'http://advokat-smirnov.ru',
      hasSsl: false,
      title: 'Главная',
      description: '',
      h1: '',
      h2List: ['Обо мне', 'Услуги и стоимость', 'Выигранные дела в арбитраже', 'Контакты'],
      h3List: ['Взыскание задолженности', 'Корпоративные споры'],
      robots: '',
      viewport: '',
      canonical: '',
      imagesTotal: 4,
      imagesWithoutAlt: 4,
      internalLinksCount: 5,
      externalLinksCount: 0,
      responseTimeMs: 1450,
      targetKeywords: 'арбитражный юрист москва, адвокат по спорам с контрагентами, взыскание долгов ооо',
      contentText: `Адвокат Смирнов Алексей Валерьевич. Защита интересов бизнеса в Арбитражном суде г. Москвы и Московской области. Более 120 выигранных дел, возврат свыше 300 млн рублей. Бесплатный первичный анализ судебной перспективы спора по документам. Индивидуальный подход к каждому договору. Офис в Москва-Сити, башня Федерация.`,
    },
  },
];
