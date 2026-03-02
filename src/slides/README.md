# Slides architecture

## Что это
`src/slides` — домен модульных слайдов для английского.
Каждый модуль описывает:
- уровень (`a1`..`c1`);
- категорию (`grammar`, `vocabulary`, `speaking`, `listening`, `reading`);
- rule tags;
- список карточек (`Card[]`) со своей логикой интерактива.

## Текущий принцип запуска
- Стартовый уровень платформы: только `A1`.
- Расширение на `A2+` заложено архитектурно через папки уровней и registry.

## Структура
- `core/types.ts`: базовые типы модулей и профиля ученика.
- `core/tracking.ts`: нормализация `CardTracking` и генерация id карточек.
- `core/registry.ts`: регистрация модулей по уровням.
- `engine/select-slides.ts`: отбор карточек под профиль пользователя.
- `modules/<level>/<category>/*.module.ts`: учебные модули по схеме уровень -> категория.

Пример:
- `modules/a1/grammar/present-simple.module.ts`
- `modules/a1/vocabulary/travel.module.ts`
- `modules/b1/vocabulary/work.module.ts` (future tier)

## Как добавить новый модуль
1. Создай файл в `modules/<level>/<category>/<name>.module.ts`.
2. Экспортируй `SlideModule` с `meta` и `cards`.
3. Зарегистрируй модуль в `core/registry.ts` в соответствующем уровне.
4. Добавь rule tags, чтобы engine мог таргетировать модуль.

## Как формируется лента
1. Профиль задает целевой уровень(и), категории и focus rules.
2. Engine сначала фильтрует модули по уровням.
3. Затем считает score (категория + rule focus) и сортирует модули.
4. Карточки интерливятся между модулями для разнообразия.
5. Возвращается slice по `cursor/limit`.
