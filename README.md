# Frontend (Web MVP): финальная архитектура на Qwik City

## 1) Цель
Собрать web MVP с полезной лентой, где пользователь:
- смотрит короткие обучающие карточки;
- регулярно проходит интерактив;
- видит рост прогресса (XP, стрик, daily goal);
- не уходит в бессмысленный пассивный скролл.

## 2) Выбранный стек
- `Qwik` + `Qwik City` + `TypeScript`
- `Qwik Scoped CSS` (`useStylesScoped$` + `*.css?inline`)
- `Vitest`
- `Playwright`

Почему для MVP это подходит:
- `Qwik City` дает SSR + file-based routing + data/actions в одном каркасе;
- быстрый first load на mobile за счет resumability;
- можно держать BFF-логику в route loaders/actions без отдельного frontend API layer-сервера.

### Gemini chat (vocabulary)
Для рабочего AI-чата в `/vocabulary` настроить env-переменные (см. `.env.example`):
- `GEMINI_API_KEY` — ключ Gemini API (используется только на сервере в `routes/api/vocabulary/chat`).
- `GEMINI_MODEL` — модель (по умолчанию `gemini-1.5-flash`).
- `GEMINI_API_BASE_URL` — базовый URL Gemini API (по умолчанию `https://generativelanguage.googleapis.com/v1beta`).
- `PUBLIC_API_BASE_URL` — опционально, base URL для frontend HTTP-клиента (если пусто, используется same-origin).

## 3) Архитектурный стиль
Финальный вариант: `Feature-sliced + thin routes`.

Правило: `routes` только оркестрируют экран и вызывают загрузчики/экшены, а бизнес-логика находится в `features` и `entities`.

Слои:
- `routes`: URL, page composition, `routeLoader$`, `routeAction$`.
- `features`: use-case уровень (`feed`, `interactions`, `gamification`, `recommendation-ui`).
- `entities`: доменные сущности и их UI/модели (`card`, `user-progress`, `streak`).
- `shared`: инфраструктура (HTTP client, config, analytics, ui primitives, helpers).

## 4) Правила зависимостей
Допустимые зависимости:
- `routes -> features/entities/shared`
- `features -> entities/shared`
- `entities -> shared`
- `shared -> (никто)`

Запрещено:
- `shared` импортирует `entities/features/routes`;
- `entities` импортируют `features/routes`;
- `features` импортируют `routes`.

## 5) Целевая структура папок
```text
app/
  README.md
  package.json
  vite.config.ts
  tsconfig.json
  vitest.config.ts
  playwright.config.ts
  src/
    root.tsx
    entry.dev.tsx
    entry.ssr.tsx
    global.css

    routes/
      layout.css
      layout.tsx
      index.css
      index.tsx
      feed/
        index.css
        index.tsx
      profile/
        index.css
        index.tsx
      api/
        feed/
          index.ts
        interactions/
          submit/index.ts

    features/
      feed/
        model/
          get-feed.ts
          anti-doomscroll.ts
        ui/
          FeedList.css
          FeedList.tsx
          FeedHeader.css
          FeedHeader.tsx
      interactions/
        model/
          submit-interaction.ts
        ui/
          QuizCard.tsx
          MatchCard.tsx
      gamification/
        model/
          calc-reward-preview.ts
        ui/
          ProgressPill.css
          ProgressPill.tsx
          StreakBadge.css
          StreakBadge.tsx

    entities/
      card/
        model/
          types.ts
          guards.ts
        ui/
          CardRenderer.css
          CardRenderer.tsx
      user-progress/
        model/
          types.ts
      streak/
        model/
          types.ts

    shared/
      api/
        client.ts
        endpoints.ts
      analytics/
        events.ts
      config/
        env.ts
      ui/
        Button.css
        Button.tsx
        CardShell.css
        CardShell.tsx
      lib/
        date.ts
        numbers.ts

    slides/
      README.md
      core/
        types.ts
        tracking.ts
        registry.ts
      engine/
        select-slides.ts
      modules/
        a1/
          grammar/
          vocabulary/
          speaking/
          listening/
        b1/
          vocabulary/

  tests/
    e2e/
      smoke.spec.ts
```

## 6) Как строим route в Qwik City
Пример для `src/routes/feed/index.tsx`:
1. `routeLoader$` получает пачку карточек (`cursor`, `limit`, user context).
2. `routeAction$` принимает завершение интерактива.
3. Page-компонент:
- читает loader данные;
- рендерит `features/feed/ui/FeedList`;
- прокидывает action handler в `CardRenderer`.

Роут не содержит:
- расчета наград;
- валидации payload карточек;
- сложной логики анти-думскролла.

Это уходит в `features/*/model` и `entities/*/model`.

## 7) Контракт карточки (MVP)
Обязательные поля:
- `id`
- `type` (`video | carousel | quiz | match | mini_game | recap`)
- `title`
- `description`
- `payload`
- `interaction`
- `reward`
- `tracking`

Единый вход рендера: `entities/card/ui/CardRenderer.tsx`.

## 8) Data flow
1. Пользователь открывает `/feed`.
2. `routeLoader$` загружает карточки + прогресс snapshot.
3. `FeedList` показывает ленту.
4. При завершении интерактива вызывается `routeAction$`.
5. Сервер возвращает результат (`xp_delta`, `streak_delta`, `next_hint`).
6. UI обновляет карточку/прогресс и при необходимости догружает следующую пачку.

Дополнение по контенту:
1. `slides/modules/<level>/<category>/*` содержат учебные модули.
2. Текущий production-start: выдача только с уровня `A1`.
3. `slides/engine/select-slides.ts` ранжирует и миксует карточки под профиль ученика.
4. `shared/api/mock-db.ts` использует этот engine для выдачи ленты.

## 9) Полезный скролл (frontend правила)
- После `N` пассивных свайпов вставлять интерактивную карточку.
- Каждые `M` карточек вставлять `recap`.
- Не показывать подряд более `K` карточек одного `type`.
- Если completion падает ниже порога, подмешивать более простые карточки.

Правила в коде: `features/feed/model/anti-doomscroll.ts`.

## 10) Тестовая стратегия
`Vitest`:
- unit: anti-doomscroll правила, guards карточек, reward preview;
- component: `CardRenderer`, `FeedList`, `QuizCard`.

`Playwright`:
- smoke: `/ -> /feed -> complete interaction`;
- critical path: обновление XP/стрика после submit.

## 11) План реализации (8 спринтов)
1. Инициализация Qwik City, scoped CSS, тестовые конфиги, base layout.
2. `routes/feed` + loader + базовая выдача карточек.
3. `CardRenderer` + `video/carousel/quiz`.
4. `match/mini_game/recap` + submit action.
5. Progress widgets (`XP`, `streak`, `daily goal`).
6. Anti-doomscroll правила и балансировка типов карточек.
7. Analytics events + feature flags для экспериментов.
8. Performance, тесты, hardening, beta-ready.

## 12) Definition of Done
- Лента стабильна на mobile web.
- Все типы карточек MVP рендерятся через один `CardRenderer`.
- `routeAction$` корректно обновляет прогресс после интерактива.
- Unit/component тесты и e2e smoke проходят.
- Архитектурные правила зависимостей соблюдаются во всех слоях.
