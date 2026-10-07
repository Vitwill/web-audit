# Web-Audit

<img width="1200" height="628" alt="banner jpg" src="https://github.com/user-attachments/assets/029f029e-ad46-45c4-9889-ee06685fd90d" />


> Экспресс-аудит веб-страниц с AI-анализом: SEO, Core Web Vitals, структура и контент — за 30 секунд.

[🌐 Открыть сервис](https://vitwill.github.io/web-audit/) · [💼 Портфолио](https://vitwill.github.io/) · [📢 Telegram-канал](https://t.me/sites_ai_tasks) · [💬 ВКонтакте](https://vk.ru/id1130637537)

---

**Web-Audit** — портфолио-проект, демонстрирующий подход к веб-разработке и AI-автоматизации: функциональный инструмент, который помогает бизнесу расти, привлекать клиентов и экономить ресурсы за счёт автоматизации.

Проект создан специалистом по веб-разработке, проектированию пользовательских интерфейсов и автоматизации бизнес-процессов с использованием современных технологий и искусственного интеллекта.

Сервис работает полностью на бесплатной инфраструктуре: фронтенд — на GitHub Pages, бэкенд — на Cloudflare Workers, AI — на Google Gemini.

---

## Возможности

- ⚡ **Быстрый аудит** — результат за 30 секунд
- 🤖 **AI-анализ** — Gemini 3.8 понимает контекст сайта, а не просто считает теги
- 📊 **Core Web Vitals** — LCP, CLS, TBT, TTFB, FCP для Mobile и Desktop
- 🎯 **4 ключевых блока** — техническое SEO, видимость, интенты, контент
- ✍️ **«Было / Стало»** — готовые оптимизированные сниппеты
- 🌍 **Мультиязычность** — RU / EN / DE
- 📄 **Markdown-экспорт** — отчёт можно скачать
- 🔒 **Freemium-модель** — 5 бесплатных аудитов, дальше — подписка

## Стек

**Frontend:**
- React 19 · TypeScript · Vite 8
- Tailwind CSS 4
- Lucide Icons

**Backend (Cloudflare Workers):**
- Cloudflare Workers (V8 runtime)
- Cheerio (HTML-парсинг)
- Cloudflare KV (rate limiting, квота)
- Google Gemini 3.8 через REST API

**Инфраструктура:**
- GitHub Pages (хостинг фронта)
- Cloudflare Workers (API)
- GitHub Actions (автодеплой)
- Wrangler 4 (CLI)

## Архитектура

```
┌──────────────────────────────┐
│  GitHub Pages (статика)      │
│  vitwill.github.io/web-audit │
└──────────────┬───────────────┘
               │  HTTPS + CORS
               ▼
┌──────────────────────────────┐
│  Cloudflare Worker           │
│  web-audit.workers.dev       │
│                              │
│  /api/audit  → scrape → AI   │
│  /api/scrape → parse HTML    │
│                              │
│  + SSRF-защита               │
│  + Rate limiting (KV)        │
│  + Квота 5 бесплатных        │
└──────────────┬───────────────┘
               │
               ▼
        ┌──────────────┐
        │ Gemini API   │
        │ (3.8-flash)  │
        └──────────────┘
```

## Запуск локально

**Требования:**
- Node.js 20+
- npm

**Установка:**

```bash
git clone https://github.com/Vitwill/web-audit.git
cd web-audit
npm install
```

**Dev-режим (два окна терминала):**

```bash
# Окно 1 — фронтенд
npm run dev:web      # → http://localhost:5173

# Окно 2 — Worker
npm run dev:worker   # → http://localhost:8787
```

## Деплой

```bash
# Фронтенд → GitHub Pages (автоматически через GitHub Actions при push)
git push origin main

# Бэкенд → Cloudflare Workers
npm run deploy:worker
```

**Секреты Worker'а** задаются через:

```bash
cd worker
npx wrangler secret put GEMINI_API_KEY
```

## Структура проекта

```
web-audit/
├── web/              # Фронтенд (React + Vite)
│   ├── src/
│   │   ├── components/    # UI-компоненты
│   │   ├── data/          # Переводы, пресеты
│   │   └── types/         # TypeScript типы
│   ├── public/            # Статика (логотип, favicon)
│   └── index.html
│
├── worker/           # Бэкенд (Cloudflare Worker)
│   ├── src/
│   │   ├── routes/        # /api/audit, /api/scrape
│   │   ├── scraper/       # fetchPage, parseHtmlData
│   │   ├── audit/         # Gemini, fallback, metrics
│   │   ├── security/      # SSRF, rate limit, quota
│   │   └── config/        # CORS, ссылки
│   └── wrangler.toml
│
└── shared/           # Общие типы
```

---

## Услуги

- 🔍 **Глубокий SEO-аудит** — полноценный анализ с планом работ, а не экспресс-проверка
- ⚡ **Оптимизация Core Web Vitals** — ускорение сайта до зелёных метрик Google
- 🛠 **Доработка на WordPress** — кастомные темы, плагины, интеграции
- 🤖 **AI-автоматизация** — чат-боты, парсеры, генераторы контента
- 💼 **Сквозная аналитика** и интеграции с CRM

**Формат работы:** фикс-цена или почасовая. Первая консультация — бесплатно.

## Другие проекты

**AI-проекты:**
- [SmartParser](https://github.com/Vitwill/smart-parser) — автоматический сбор данных с сайтов с экспортом в Excel
- [WB SEO Generator](https://github.com/Vitwill/wb-seo-generator) — AI-генерация SEO-описаний для Wildberries и Ozon
- [TG Content Planner](https://github.com/Vitwill/tg-content-planner) — AI-контент-план для Telegram-каналов

**Приложения:**
- **DashBook** — персональный органайзер с AI-помощником
- **FB Leads** — CRM для управления лидами из Meta Ads
- **YouTube Analyzer** — аналитика YouTube-каналов по нишам и регионам

## Контакты

- 🌐 **Портфолио:** [vitwill.github.io](https://vitwill.github.io/)
- 📢 **Telegram-канал:** [@sites_ai_tasks](https://t.me/sites_ai_tasks) — сайты для бизнеса, AI-автоматизация
- 💬 **Telegram для задач:** [@pervyy_zakaz_bot](https://t.me/pervyy_zakaz_bot)
- 💼 **ВКонтакте:** [vk.ru/id1130637537](https://vk.ru/id1130637537)
- 👨‍💻 **GitHub:** [@Vitwill](https://github.com/Vitwill)

---

## Готовы обсудить ваш проект?

Опишите задачу — специалист подготовит коммерческое предложение в течение **24 часов**.

👉 **[Написать в Telegram](https://t.me/pervyy_zakaz_bot)** · **[Оставить заявку на сайте](https://vitwill.github.io/#contact)**

---

*Made with care · Germany · 2026*
