# Backend (API): архитектура и план реализации

## 1) Цель backend
Обеспечить API для персонализированной ленты, интерактивных карточек и геймификации с упором на измеримость и масштабирование после MVP.

Основные задачи:
- выдача релевантной и разнообразной ленты;
- обработка результатов интерактивов;
- расчет XP, стриков и daily goal;
- сбор событий для аналитики и обучения ранжирования.

## 2) Технологический стек
- `NestJS` + `TypeScript`
- `PostgreSQL` + `Prisma ORM`
- `Redis` (кеш, rate limit, сессии, быстрые счетчики)
- `BullMQ` (очереди фоновых задач)
- `S3-compatible storage` + CDN для медиа
- `OpenAPI/Swagger` для контрактов
- `Pino` + `OpenTelemetry` для логов/трейсов
- `PostHog`/event pipeline для продуктовой аналитики

## 3) Архитектурный стиль
Для MVP: модульный монолит с четкими bounded contexts.

Модули:
- `AuthModule`
- `UserModule`
- `FeedModule`
- `CardModule`
- `InteractionModule`
- `GamificationModule`
- `RecommendationModule`
- `MediaModule`
- `AnalyticsModule`
- `AdminModule`

Позже без перелома архитектуры можно вынести `Recommendation` и `Analytics` в отдельные сервисы.

## 4) Доменные сущности
- `User`
- `UserPreference`
- `Card`
- `CardVariant`
- `FeedSession`
- `FeedImpression`
- `InteractionAttempt`
- `UserProgress`
- `Streak`
- `DailyGoal`
- `RewardTransaction`

Ключевой объект `Card`:
- `type` (`video`, `carousel`, `quiz`, `match`, `mini_game`);
- `payload` (контент);
- `interaction_schema` (правила проверки);
- `difficulty`, `tags`, `estimated_time_sec`.

## 5) API-контракты (MVP)
### Auth/User
- `POST /auth/login`
- `GET /me`
- `PATCH /me/preferences`

### Feed
- `GET /feed?cursor=...`
- `POST /feed/impression`
- `POST /feed/action` (like/save/share/skip)

### Interactions
- `POST /interactions/:cardId/submit`
- `GET /interactions/history`

### Gamification
- `GET /progress`
- `GET /streak`
- `GET /daily-goal`

### Admin
- `POST /admin/cards`
- `PATCH /admin/cards/:id`
- `POST /admin/cards/:id/publish`

## 6) Логика полезного скролла
Сервис ранжирования рассчитывает score:
- интерес пользователя (теги, прошлые completion);
- обучающая ценность (пробелы в знаниях);
- сложность и темп;
- разнообразие форматов.

Анти-думскролл правила:
- ограничение подряд пассивных свайпов;
- вставка интерактива при низкой вовлеченности;
- recap-карточка по завершению пачки.

MVP-реализация: rule-based engine + простые веса в конфиге.

## 7) Поток обработки интерактива
1. Клиент отправляет `submit` с ответом и метаданными.
2. `InteractionModule` валидирует ответ по `interaction_schema`.
3. `GamificationModule` считает XP/бонусы/стрик.
4. В транзакции обновляются `UserProgress`, `Streak`, `RewardTransaction`.
5. Событие уходит в очередь аналитики.
6. Ответ клиенту: результат, объяснение, награда, рекомендации следующего шага.

## 8) Хранение и кеширование
- PostgreSQL: источник истины;
- Redis:
  - кеш выдачи feed-блока;
  - ограничение частоты запросов;
  - временные счетчики стриков и сессий;
- TTL кеша ленты 30–120 секунд для снижения latency.

## 9) Безопасность и надежность
- JWT access + refresh tokens;
- rate limit на auth и submit endpoints;
- input validation через DTO + `class-validator`;
- idempotency key для `submit`, чтобы исключить двойные начисления;
- миграции БД только через versioned Prisma migrations;
- ежедневный backup БД.

## 10) Наблюдаемость
- структурированные логи с `request_id`, `user_id`, `card_id`;
- метрики: RPS, p95 latency, error rate, feed CTR, interaction completion;
- алерты: рост 5xx, деградация completion rate, скачок latency.

## 11) План реализации backend (8 спринтов по 1 неделе)
1. Базовый каркас: NestJS, Prisma, Auth, User, OpenAPI.
2. Модуль карточек и админ-загрузка контента.
3. Feed API v1 (cursor pagination, базовый скоринг).
4. Interactions API + валидация ответов.
5. Gamification (XP, стрик, daily goal, транзакции наград).
6. Recommendation rules + анти-думскролл правила.
7. Analytics pipeline (очередь + экспорт событий).
8. Hardening: кеши, rate limits, тесты, нагрузочный прогон, beta readiness.

## 12) Definition of Done для MVP backend
- Все публичные endpoints задокументированы в OpenAPI;
- Корректно работают выдача ленты, submit интерактива, начисление наград;
- События аналитики доставляются без потерь;
- p95 основных endpoints в пределах целевого SLA;
- есть интеграционные тесты для критических user flows.
