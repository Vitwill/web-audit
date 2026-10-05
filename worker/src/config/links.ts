// -----------------------------------------------------------------------------
// Контакты, соцсети, ссылки проекта.
// -----------------------------------------------------------------------------
//
// Все внешние ссылки проекта в одном месте. Если нужно поменять
// Telegram-канал или VK-аккаунт — правим только этот файл.
//
// Используется в:
//   - worker/src/audit/fallback.ts (генерация rawMarkdown)
//   - worker/src/audit/gemini.ts   (systemPrompt и промпты)
// -----------------------------------------------------------------------------

export const LINKS = {
  /** Telegram-канал «Сайты для бизнеса | AI и задачи» */
  telegram: {
    handle: '@sites_ai_tasks',
    url: 'https://t.me/sites_ai_tasks',
    /** Название канала для отображения в отчётах */
    title: 'Сайты для бизнеса | AI и задачи',
    /** Название канала на английском (для EN-отчётов) */
    titleEn: 'Sites for Business | AI & Tasks',
    /** Название канала на немецком (для DE-отчётов) */
    titleDe: 'Websites für Unternehmen | KI & Aufgaben',
  },

  /** ВКонтакте автора */
  vk: {
    handle: 'id1130637537',
    url: 'https://vk.ru/id1130637537',
  },

  /** Портфолио автора на GitHub Pages */
  portfolio: {
    url: 'https://vitwill.github.io/',
    title: 'VITWILL Portfolio',
  },

  /** Бот для приёма заявок (используется в маркетинговом блоке) */
  orderBot: {
    handle: '@pervyy_zakaz_bot',
    url: 'https://t.me/pervyy_zakaz_bot',
  },

  /** Канал в Telegram для обратной связи с автором */
  contactBot: {
    handle: '@pervyy_zakaz_bot',
  },
} as const;

/**
 * Тип `LINKS` — на случай, если где-то понадобится передавать
 * его целиком в функцию.
 */
export type Links = typeof LINKS;