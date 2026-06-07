# План: эталонная FSD-архитектура и максимально прокачанный фронтенд

> Документ-роадмап для рефакторинга `frontend/`. Цель — довести проект до состояния
> «эталонный FSD + production-grade UI»: строгие архитектурные границы, единая
> дизайн-система, переиспользуемые хуки, тесты UI, доступность и производительность.

## 0. Где мы сейчас (аудит)

Текущее состояние уже **хорошее**: слои FSD разделены (`app → views → features → entities → shared`),
вся бизнес-логика вынесена в `model/*.ts`-хуки, компоненты маленькие, есть public API
через `index.ts`, RTK Query настроен, cross-imports оформлены через `@x`.

Слабые места, которые и закрывает этот план:

| # | Проблема | Где видно |
|---|----------|-----------|
| A | Границы FSD описаны в доке, но **ничем не проверяются** | `docs/FSD.md` есть, линта-стража нет |
| B | **Нет дизайн-системы**: длинные Tailwind-классы скопированы по компонентам, цвета (`zinc-900`, `red-600`) захардкожены | `PrimaryButton`, `TextField`, `AppNav` |
| C | **Стили дефолтные** от `create-next-app`: только `--background/--foreground`, тема лишь через `prefers-color-scheme` | `app/globals.css` |
| D | **UI не тестируется**: vitest в окружении `node`, покрыты только helpers | `vitest.config.ts`, `*.test.ts` |
| E | **Дублирование форм-логики**: каждый `useXxxForm` повторяет `useState` на поле + `fieldErrors` + `handleSubmit` | `useLoginForm`, `useDeedEditForm`, `useRegisterForm`, ... |
| F | Примитивы UI без вариантов/состояний (нет `loading`, `variant`, `size`, иконок) | `PrimaryButton`, `TextButton` |
| G | Нет `loading.tsx` / `error.tsx` / error boundary в App Router | `app/**` |
| H | Жёсткий редирект через `window.location.href` при 401 | `base-api.ts` |
| I | Нет Prettier-конфига, `tsconfig.target: ES2017`, нет typecheck-скрипта | конфиги |
| J | Нет оптимистичных апдейтов и нормализованного кэша RTK | `entities/*/api` |

---

## Фаза 1 — Фундамент архитектуры и тулинг

Цель: зафиксировать правила, чтобы дальнейший рефакторинг не «поплыл».

### 1.1 Enforcement границ FSD
- Подключить **`eslint-plugin-boundaries`** (или `@feature-sliced/steiger-plugin` + Steiger CLI).
- Описать слои как элементы: `app, views(pages), features, entities, shared`.
- Правила:
  - `entities` ← только `shared`;
  - `features` ← `entities, shared`;
  - `views` ← `features, entities, shared`;
  - `app` ← всё;
  - запрет импорта «вбок» внутри одного слоя минуя `@x`;
  - запрет deep-import в обход `index.ts` (public API).
- Добавить `npm run lint:fsd` (Steiger) и завести его в CI.

### 1.2 Tooling
- Добавить **Prettier** (`.prettierrc`) + `eslint-config-prettier`, скрипт `format`.
- Добавить **`typecheck`**: `tsc --noEmit`; включить в CI рядом с `lint`/`test`/`build`.
- Поднять `tsconfig.target` до `ES2022`, включить `noUncheckedIndexedAccess` и `verbatimModuleSyntax`.
- Husky + lint-staged: pre-commit `eslint --fix` + `prettier` + `tsc`.
- (Опц.) `knip` — поиск мёртвого кода и неиспользуемых экспортов из `index.ts`.

### 1.3 Унификация public API
- Прогнать аудит: у каждого слайса ровно один `index.ts`, наружу торчит только он.
- Любые `import "../model/..."` из чужого слайса заменить на импорт через public API.

**Готово, когда:** `lint`, `lint:fsd`, `typecheck` зелёные в CI; нарушений границ — ноль.

---

## Фаза 2 — Дизайн-система (ядро «вау»-фронта)

Цель: единый визуальный язык, ноль повторяющихся class-строк.

### 2.1 Design tokens
- В `app/globals.css` (Tailwind v4 `@theme`) ввести семантические токены:
  `--color-bg`, `--color-surface`, `--color-border`, `--color-text`, `--color-muted`,
  `--color-primary`, `--color-success`, `--color-danger`, радиусы, тени, spacing-scale,
  z-index-scale, длительности анимаций.
- Палитру `zinc/red/...` заменить на токены → смена темы = смена переменных.

### 2.2 Тема (light/dark/system)
- `shared/theme`: провайдер + хук `useTheme()` (`light | dark | system`), запись в
  `localStorage`, синхронизация с `data-theme` на `<html>` + анти-FOUC inline-скрипт.
- Переключатель темы в `AppNav`.

### 2.3 Переиспользуемые примитивы (`shared/ui`)
- Ввести **`cva`/`tailwind-variants`** для вариантов, убрать длинные строки из JSX.
- Прокачать/добавить:
  - `Button`: `variant` (primary/secondary/ghost/danger), `size`, `isLoading` (спиннер), `leftIcon/rightIcon`, `asChild`.
  - `Input/TextField`, `Textarea`, `Select`, `Checkbox`, `Switch` — единый стиль, состояния error/disabled, `aria-*`.
  - `Card`, `Badge`(на базе `StatusBadge`), `Modal/Dialog` (на базе `ConfirmDialog`, с focus-trap и `Esc`), `Tooltip`, `Toast`, `Skeleton`, `Spinner`, `IconButton`, `Avatar`, `EmptyState` (есть — причесать).
- Все иконки — в `shared/ui/icon` (вынести инлайновый SVG из `AppNav`).

### 2.4 Микро-анимации и полировка
- Подключить **Framer Motion**: появление карточек (stagger), переходы модалок, layout-анимации списка дел, hover/press-состояния.
- Респект к `prefers-reduced-motion`.

### 2.5 Storybook
- Поднять **Storybook 8** для `shared/ui`, истории на каждый примитив (варианты/состояния), визуальная документация дизайн-системы.

**Готово, когда:** в `features/entities/views` нет «сырых» длинных Tailwind-строк под кнопки/инпуты/карточки — только примитивы из `shared/ui`; работает переключение темы; Storybook собирается.

---

## Фаза 3 — Хуки и переиспользуемая логика

Цель: убрать дублирование, вынести «лишнюю логику» из компонентов и слайсов.

### 3.1 Обобщённый `useForm`
- В `shared/lib/form` сделать типобезопасный `useForm<TValues>`:
  значения, `setField`, `errors`, `isSubmitting`, `handleSubmit(onValid)`, интеграция с
  `handleFormMutationError`/`handleAuthMutationError`.
- (Опц.) валидация схемой **Zod** + `zodResolver` — единый источник правил.
- Переписать `useLoginForm`, `useRegisterForm`, `useAddDeedForm`, `useDeedEditForm`,
  `useAddFriendForm`, `useProfileForm` поверх `useForm` → каждый худеет до схемы + сабмита.

### 3.2 Каталог общих хуков (`shared/lib/hooks`)
Вынести из компонентов повторяющиеся паттерны:
- `useDisclosure` (open/close/toggle — заменит россыпь `useState(false)` под модалки/меню в `AppNav` и фичах);
- `useMediaQuery`, `useIsMobile`;
- `useDebouncedValue`, `useDebouncedCallback`;
- `useLocalStorage`;
- `useClickOutside`, `useFocusTrap`, `useLockBodyScroll` (для модалок/меню);
- `useCopyToClipboard` (для `@tag`).
- `useCollapsibleForm` — оставить, но переосмыслить через `useDisclosure`.

### 3.3 Типизированные RTK-хелперы
- `useAppDispatch/useAppSelector` уже есть — добавить мемоизированные селекторы
  (`createSelector`) для `auth.user`, `ui.banner` и т.п., чтобы убрать инлайновые селекторы из компонентов.

**Готово, когда:** ни один форм-хук не дублирует boilerplate; в JSX/компонентах нет «лишней» локальной логики, которую можно переиспользовать.

---

## Фаза 4 — Данные, состояние, надёжность

### 4.1 RTK Query прокачка
- Оптимистичные апдейты (`onQueryStarted` + `updateQueryData`) для создания/редактирования/
  удаления дел и друзей.
- Точечная инвалидация по тегам (id-теги вместо `LIST`-инвалидаций где можно).
- Вынести общие трансформации/`providesTags` в хелперы `shared/api`.

### 4.2 Обработка ошибок и сессии
- Заменить `window.location.href` на навигацию роутера (через слушатель/эффект),
  чтобы не терять SPA-состояние.
- Глобальный `error.tsx` и `not-found.tsx` в App Router; `loading.tsx` для маршрутов.
- React **Error Boundary** в `app/` + дружелюбный fallback из `shared/ui`.
- Тосты для сетевых ошибок вместо одного баннера (на базе `ui-slice`).

### 4.3 Безопасность токена (вне MVP-ограничений)
- Зафиксировать как отдельную задачу: переезд с `localStorage` на httpOnly-cookie + refresh-флоу (требует изменений на backend).

---

## Фаза 5 — Доступность (a11y) и UX

- Аудит фокус-стилей, контрастности токенов (WCAG AA).
- Семантика: `nav/main/header`, `aria-current` на активной ссылке в `AppNav`.
- Модалки: `role="dialog"`, focus-trap, возврат фокуса, закрытие по `Esc`/overlay.
- Формы: связка `label`/`aria-describedby` для ошибок, `aria-invalid`.
- Прогон `eslint-plugin-jsx-a11y` + ручная проверка клавиатурой и скринридером.
- Скелетоны/`aria-busy` для лоадингов (частично есть — унифицировать).

---

## Фаза 6 — Тестирование и качество

### 6.1 Тесты UI
- Перевести vitest на **jsdom** + **@testing-library/react** + `@testing-library/jest-dom`;
  отдельный проект/конфиг, чтобы node-тесты helpers остались как есть.
- Покрыть тестами: примитивы `shared/ui`, форм-хуки, ключевые сценарии `views`
  (рендер списка дел, пустое состояние, ошибка+retry).
- MSW для мока API в тестах хуков/страниц.

### 6.2 E2E (опц., но желательно)
- **Playwright**: smoke сценарии login → создать дело → отметить done → разлогиниться.

### 6.3 CI
- Дополнить workflow шагами: `typecheck`, `lint:fsd`, `test` (с UI), `build`, (опц.) Storybook build, Playwright.

**Готово, когда:** значимое покрытие UI и хуков; CI гоняет полный набор проверок.

---

## Фаза 7 — Производительность и DX

- Code-splitting тяжёлых модалок/форм через `next/dynamic`.
- `next/font` уже используется — проверить мемоизацию списков (`React.memo`,
  стабильные ключи, вынос `renderCard`).
- Анализ бандла (`@next/bundle-analyzer`).
- `next.config`: включить нужные `experimental`/`images`/`headers` по необходимости.
- Обновить `docs/FSD.md` и `README` под новые правила и дизайн-систему.

---

## Порядок выполнения и зависимости

```
Фаза 1 (границы+тулинг)
   └─> Фаза 2 (дизайн-система) ──┐
   └─> Фаза 3 (хуки) ────────────┼─> Фаза 4 (данные/ошибки)
                                  ├─> Фаза 5 (a11y)
                                  └─> Фаза 6 (тесты) ─> Фаза 7 (perf/DX)
```

Рекомендуется вести **по PR на фазу** (а внутри — по слайсу), чтобы ревью оставалось обозримым.

## Definition of Done (итог)
- `eslint` + `lint:fsd` + `typecheck` + `test` + `build` — зелёные в CI.
- Ноль нарушений границ FSD, у каждого слайса единый public API.
- В `features/entities/views` нет «сырых» Tailwind-строк под примитивы — только `shared/ui`.
- Светлая/тёмная/системная темы на семантических токенах.
- Форм-логика — на едином `useForm`, общие хуки вынесены в `shared/lib`.
- Оптимистичные апдейты, дружелюбные ошибки, a11y-модалки/формы.
- Storybook + тесты UI как живая документация.
