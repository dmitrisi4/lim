# Lim — Анализ проекта

> Дата: 2026-03-31 | Стек: Qwik City · TypeScript · Vite · SSR

---

## 1. Фронтенд архитектура

### Стек

| Слой | Технология |
|---|---|
| Framework | Qwik + Qwik City 1.8 |
| Language | TypeScript 5.7 |
| Build | Vite 6 + vite-tsconfig-paths (алиас `~`) |
| Styling | Qwik Scoped CSS (`useStylesScoped$` + `*.css?inline`) |
| Unit tests | Vitest 2 |
| E2E tests | Playwright |
| Runtime | SSR (`bun run dev --mode ssr`) |
| Ext. lib | Swiper 11 (CDN, swiper-element) |

### Архитектурный стиль

**Feature-Sliced Design (FSD) + thin routes**

```
routes         →  features / entities / shared
features       →  entities / shared
entities       →  shared
shared         →  (никто)
slides         →  shared/entities  (отдельный домен контента)
```

### Маршруты и страницы

| Route | Описание | Размер page файла |
|---|---|---|
| `/` | Home, LearningOverview | 1.9 KB |
| `/feed` | Лента карточек | 8.1 KB |
| `/vocabulary` | Словарь + AI-чат (Gemini) | 18.5 KB |
| `/language-map` | Карта языка | 32 KB |
| `/quests` | Квесты | 10.5 KB |
| `/profile` | Профиль, история | 2.2 KB |

### State management

- **Серверный стейт** — `routeLoader$` / `routeAction$` (Qwik City)
- **i18n** — Qwik Context (`I18N_CONTEXT`) через `useContextProvider` в layout
- **Прогресс** — in-memory singleton `userStateStore: Map` в `mock-db.ts`
- **UI стейт** — отсутствует (нет Zustand/Redux)

---

## 2. Контент

### Уровни (EnglishLevel)

| Уровень | Статус |
|---|---|
| `a1` | Active (EN + ES) |
| `a2` | Архитект. резерв (пусто) |
| `b1` | Частично (1 модуль EN) |
| `b2` | Пусто |
| `c1` | Пусто |

### Контентные модули EN A1

| Категория | Модули |
|---|---|
| grammar | `present-simple`, `articles`, `to-be-basics`, `flashcards-en-rules` |
| vocabulary | `travel`, `daily-routine`, `flashcards-en-words` |
| listening | `numbers`, `classroom` |
| speaking | `introductions`, `small-talk` |
| reading | `city-signs` |

### Gamification

| Механика | Описание |
|---|---|
| XP | За каждую карточку/правильный ответ |
| Level | `floor(xp / 120) + 1` |
| Streak | Ежедневные дни подряд |
| Daily Goal | `dailyGoal: 120 XP` |

---

## 3. Находки

### Критично

| # | Проблема | Файл |
|---|---|---|
| 1 | `userStateStore` — in-memory Map, сбрасывается при рестарте | `shared/api/mock-db.ts` |
| 2 | `card-renderer/ui/` — пустая папка, feature не реализована | `features/card-renderer/ui/` |
| 3 | A2, B2, C1 — уровни полностью пустые | `slides/core/registry.ts` |

### Заметно

| # | Проблема | Файл |
|---|---|---|
| 4 | `language-map/index.tsx` (32 KB) — монолитный файл | `routes/language-map/` |
| 5 | `flashcards-en-words.module.ts` (39 KB) — inline-контент в коде | `slides/modules/a1/vocabulary/` |
| 6 | `body lang="ru"` в root.tsx — захардкожен русский | `src/root.tsx` |
| 7 | Swiper CDN в `<head>` — блокирует рендер | `src/root.tsx:12` |

### Сильные стороны

- Чёткое FSD разделение слоёв, задокументировано в README
- i18n через Qwik Context — правильная архитектура для SSR
- Slides domain изолирован, добавление модуля — 3 шага
- Engine ранжирования покрыт unit-тестами
- Scoped CSS — нет глобального загрязнения стилей
