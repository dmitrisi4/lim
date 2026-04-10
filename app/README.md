# Frontend (Web MVP): Final Architecture on Qwik City

## 1) Goal
Build a web MVP with a useful learning feed where the user:
- watches short educational cards;
- regularly completes interactive exercises;
- sees progress growth (XP, streak, daily goal);
- does not fall into meaningless passive scrolling.

## 2) Selected Stack
- `Qwik` + `Qwik City` + `TypeScript`
- `Qwik Scoped CSS` (`useStylesScoped$` + `*.css?inline`)
- `Vitest`
- `Playwright`

Why this fits the MVP:
- `Qwik City` provides SSR + file-based routing + data/actions in one framework;
- fast first load on mobile thanks to resumability;
- BFF logic can live in route loaders/actions without a separate frontend API-layer server.

### Gemini chat (vocabulary)
To enable the AI chat in `/vocabulary`, configure the environment variables (see `.env.example`):
- `GEMINI_API_KEY` — Gemini API key (used only on the server in `routes/api/vocabulary/chat`).
- `GEMINI_MODEL` — model name (default: `gemini-1.5-flash`).
- `GEMINI_API_BASE_URL` — Gemini API base URL (default: `https://generativelanguage.googleapis.com/v1beta`).
- `PUBLIC_API_BASE_URL` — optional base URL for the frontend HTTP client (if empty, same-origin is used).

## 3) Architectural Style
Final choice: `Feature-sliced + thin routes`.

Rule: `routes` only orchestrate screens and invoke loaders/actions, while business logic lives in `features` and `entities`.

Layers:
- `routes`: URL, page composition, `routeLoader$`, `routeAction$`.
- `features`: use-case layer (`feed`, `interactions`, `gamification`, `recommendation-ui`).
- `entities`: domain entities and their UI/models (`card`, `user-progress`, `streak`).
- `shared`: infrastructure (HTTP client, config, analytics, UI primitives, helpers).

## 4) Dependency Rules
Allowed dependencies:
- `routes -> features/entities/shared`
- `features -> entities/shared`
- `entities -> shared`
- `shared -> (nobody)`

Forbidden:
- `shared` imports `entities/features/routes`;
- `entities` import `features/routes`;
- `features` import `routes`.

## 5) Target Folder Structure
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

## 6) How We Build a Route in Qwik City
Example for `src/routes/feed/index.tsx`:
1. `routeLoader$` fetches a batch of cards (`cursor`, `limit`, user context).
2. `routeAction$` accepts interactive completion submissions.
3. The page component:
- reads loader data;
- renders `features/feed/ui/FeedList`;
- passes the action handler into `CardRenderer`.

The route must not contain:
- reward calculation;
- card payload validation;
- complex anti-doomscroll logic.

That belongs in `features/*/model` and `entities/*/model`.

## 7) Card Contract (MVP)
Required fields:
- `id`
- `type` (`video | carousel | quiz | match | mini_game | recap`)
- `title`
- `description`
- `payload`
- `interaction`
- `reward`
- `tracking`

Single render entry point: `entities/card/ui/CardRenderer.tsx`.

## 8) Data Flow
1. The user opens `/feed`.
2. `routeLoader$` loads cards + a progress snapshot.
3. `FeedList` displays the feed.
4. When an interaction is completed, `routeAction$` is called.
5. The server returns the result (`xp_delta`, `streak_delta`, `next_hint`).
6. The UI updates the card/progress and loads the next batch when needed.

Content note:
1. `slides/modules/<level>/<category>/*` contains learning modules.
2. Current production start: serve content only from level `A1`.
3. `slides/engine/select-slides.ts` ranks and mixes cards based on the learner profile.
4. `shared/api/mock-db.ts` uses that engine to produce the feed.

## 9) Useful Scroll (Frontend Rules)
- After `N` passive swipes, insert an interactive card.
- Every `M` cards, insert a `recap`.
- Do not show more than `K` cards of the same `type` in a row.
- If completion drops below a threshold, mix in easier cards.

Rules in code: `features/feed/model/anti-doomscroll.ts`.

## 10) Testing Strategy
`Vitest`:
- unit: anti-doomscroll rules, card guards, reward preview;
- component: `CardRenderer`, `FeedList`, `QuizCard`.

`Playwright`:
- smoke: `/ -> /feed -> complete interaction`;
- critical path: XP/streak update after submit.

## 11) Implementation Plan (8 Sprints)
1. Initialize Qwik City, scoped CSS, test configs, and base layout.
2. `routes/feed` + loader + basic card delivery.
3. `CardRenderer` + `video/carousel/quiz`.
4. `match/mini_game/recap` + submit action.
5. Progress widgets (`XP`, `streak`, `daily goal`).
6. Anti-doomscroll rules and balancing of card types.
7. Analytics events + feature flags for experiments.
8. Performance, tests, hardening, beta-ready polish.

## 12) Definition of Done
- The feed is stable on mobile web.
- All MVP card types render through a single `CardRenderer`.
- `routeAction$` correctly updates progress after interactions.
- Unit/component tests and e2e smoke tests pass.
- Architectural dependency rules are respected across all layers.
