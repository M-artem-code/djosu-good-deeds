# План: эталонная FSD-архитектура и улучшенный фронтенд

> Документ описывает целевую архитектуру фронтенда `djosu-good-deeds` и пошаговый план рефакторинга.
> Цель — довести проект до «эталонного» FSD: убрать дублирование и лишнюю логику из каждого слоя,
> выстроить переиспользуемые хуки и примитивы, усилить UI/UX, тесты, безопасность и качество кода.

## Статус реализации

| Фаза | Содержание | Статус |
|------|------------|--------|
| 0 | Инструменты: `steiger` (FSD-линтер), `prettier`, `vitest`+`jsdom`+RTL, скрипты `typecheck`/`fsd:lint`/`format`; CI расширен | ✅ Готово |
| 1 | `shared`: `cn()`, движок форм `useMutationForm` + `buildPatch`, хуки `useDisclosure`/`useSelection`/`useTheme`, zod-валидация, `shared/config` (routes) | ✅ Готово |
| 2 | Все form-хуки (auth/deed/profile/friend) переведены на движок; дублирующиеся мапперы вынесены в `shared/api`; маршруты централизованы | ✅ Готово |
| 3 | Дизайн-система: `cva`-варианты `Button`, варианты полей, токены, `cn()` в примитивах | ✅ Готово |
| 4 | UX: `ErrorBoundary`, плавающий `Toaster`, тема light/dark/system с переключателем и no-flash | ✅ Готово |
| 5 | Тесты RTL/unit для движка форм, валидации, хуков и UI; CI-гейты | ✅ Готово |
| 6 | Безопасность сессии (httpOnly cookie / middleware), e2e Playwright, генерация типов из OpenAPI | ⏳ Запланировано (см. §5, §6) |

Остальная часть документа — исходный план и нереализованные направления (этап 6).

---

## 1. Где мы сейчас (аудит)

Стек: **NestJS 11 + MongoDB** · **Next.js 16 (App Router) + Redux Toolkit + RTK Query + Tailwind CSS 4**.

Сильные стороны (это уже хорошо, не ломаем):

- Чёткие слои FSD: `app → views → features → entities → shared` (см. `frontend/docs/FSD.md`).
- Публичные API через `index.ts` в каждом слайсе.
- Кросс-импорты сущностей через `@x` (`entities/deed/@x/friend.ts`, `entities/user/@x/friend.ts`).
- RTK Query через `baseApi.injectEndpoints`, теги инвалидации (`User/Deed/Friend/FriendDeed`),
  единый перехват ошибок и reauth в `shared/api/rtk/base-api.ts`.
- Разделение «модель/UI» внутри слайсов (`model/` хуки + `ui/` компоненты).

Слабые места и «лишняя логика», которую нужно вынести:

| # | Проблема | Файлы-примеры |
|---|----------|---------------|
| A | Дублирование form-хуков: одинаковый каркас `useState` для полей + `fieldErrors`/`formError` + `handleSubmit` | `features/auth/login/model/useLoginForm.ts`, `features/auth/register/model/useRegisterForm.ts`, `features/profile/update/model/useProfileForm.ts` |
| B | Повтор `mapDeedFieldErrors` и состояния `title/description` в двух местах | `features/deed/create/model/useAddDeedForm.ts`, `features/deed/edit/model/useDeedEditForm.ts` |
| C | Ручная валидация на клиенте дублирует DTO бэкенда, нет единой схемы | `backend/src/**/dto/*`, `shared/api/validation-errors.ts` |
| D | Нет enforcement границ FSD — ESLint только next-defaults | `frontend/eslint.config.mjs` |
| E | UI-примитивы хранят длинные Tailwind-строки инлайн, нет вариантов/токенов | `shared/ui/primary-button`, `shared/ui/text-field`, `app/globals.css` |
| F | Токен в `localStorage`, гард только клиентский, жёсткий `window.location` редирект | `shared/lib/auth/token.ts`, `features/auth/guard/ui/AuthGuard.tsx`, `base-api.ts` |
| G | Тестов почти нет (только unit на хелперы), нет тестов компонентов/хуков/e2e | `vitest.config.ts`, CI |
| H | Глобальный UX ошибок — один баннер; нет тостов, error boundary, темы | `shared/api/rtk/ui-slice.ts` |
| I | Хардкод строк UI (английский), нет i18n и слоя `shared/config` | весь `ui/` |

---

## 2. Целевая архитектура

### 2.1 Карта слоёв (без изменения принципов FSD)

```
app/        Next.js routes, провайдеры, layout-зоны, навигация
  └─ зависит от: views, features, entities, shared
views/      экраны (pages-слой FSD): композиция фич/сущностей
  └─ зависит от: features, entities, shared
features/   пользовательские сценарии (create/edit/delete/auth/…)
  └─ зависит от: entities, shared
entities/   бизнес-сущности (deed/friend/user): api + model + ui + @x
  └─ зависит от: shared
shared/     переиспользуемое: ui-kit, lib, api(rtk), config, types
  └─ зависит от: ничего из вышестоящего
```

### 2.2 Сегменты внутри слайса (стандартизируем для всех)

```
<slice>/
  ui/        презентационные компоненты
  model/     хуки, состояние, селекторы, типы состояния
  api/       endpoints RTK Query (только entities/* и features/*/api)
  lib/       чистые функции/мапперы данного слайса
  config/    константы/енумы данного слайса (опционально)
  @x/        точки кросс-импорта между сущностями
  index.ts   публичный API слайса (единственная точка импорта)
```

### 2.3 Новый/расширенный слой `shared`

- `shared/ui` — дизайн-система на токенах + `cva` + `tailwind-merge` (см. §4).
- `shared/lib/forms` — **движок форм** (см. §3), хуки `useForm`, `useMutationForm`.
- `shared/lib/hooks` — общие хуки: `useDisclosure`, `useDebouncedValue`, `useIsClient`, `useCollapsibleForm` (переезжает сюда).
- `shared/api` — без изменений принципов: `rtk/`, мапперы ошибок, провайдер store.
- `shared/config` — `env` (типобезопасный доступ к `process.env`), маршруты (`routes.ts`), querystring-причины (`?reason=`), теги кэша.
- `shared/validation` — zod-схемы, переиспользуемые формами (зеркалят DTO бэкенда).

---

## 3. Главная цель: убрать дублирующуюся логику форм (хуки)

Сейчас в каждом form-хуке руками: `useState` на каждое поле, `fieldErrors`, `formError`,
`event.preventDefault()`, `try/await unwrap()/catch → handle*MutationError`. Это «лишняя логика»,
рассыпанная по фичам. Выносим в переиспользуемые примитивы.

### 3.1 Базовый движок форм — `shared/lib/forms`

Рекомендуемый путь — **React Hook Form + Zod** (резолвер) как индустриальный стандарт, либо
лёгкий собственный `useForm`, если не хотим зависимости. Целевой публичный хук:

```ts
// shared/lib/forms/useMutationForm.ts (контракт)
const form = useMutationForm({
  schema: deedFormSchema,                 // zod-схема из shared/validation
  defaultValues: { title: "", description: "" },
  mutation: useCreateDeedMutation,        // RTK Query hook
  toRequest: (values) => ({ title: values.title.trim(), description: values.description.trim() || undefined }),
  onSuccess: () => { /* reset / redirect */ },
  errorMappers: { map400: mapDeedFieldErrors }, // переиспользуем shared/api
});
// form.register / form.fieldError("title") / form.formError / form.isLoading / form.handleSubmit
```

Что инкапсулируем внутри: состояние полей, `fieldErrors`, `formError`, submit-flow,
`unwrap()`+`handleFormMutationError`. Фичи становятся декларативными.

### 3.2 Конкретные рефакторинги (что во что превращается)

- **Auth (A):** `useLoginForm` и `useRegisterForm` → общий `useAuthForm(schema, mutation, { handle409, defaultFormError })`,
  который инкапсулирует `establishAuthSession(dispatch, …) + router.push("/deeds")` и
  `handleAuthMutationError`. Останется только описание полей и схемы.
- **Deed (B):** вынести `mapDeedFieldErrors` в `entities/deed/lib/` (или `features/deed/lib/`) — один источник.
  Состояние `title/description` инкапсулировать в `useMutationForm` со схемой `deedFormSchema`.
  `useAddDeedForm`/`useDeedEditForm` становятся тонкими обёртками (create vs update + collapse-поведение).
- **Profile (профиль, §A):** `useProfileForm` использует тот же движок + хелпер «dirty/diff»
  (`buildPatch(current, initial)`), вынесенный в `shared/lib/forms` — убираем ручную сборку `body`.
- **Disclosure-состояние:** `useDeedListState`, `useSettingsPage` (модалки/editingId) → общий
  `useDisclosure()` и `useSelection<T>()` в `shared/lib/hooks`.

### 3.3 Единая клиентская валидация (C)

- Завести `shared/validation` с zod-схемами: `emailSchema`, `passwordSchema`, `tagSchema`,
  `deedFormSchema`, `profileFormSchema` — правила синхронны с DTO бэкенда
  (`register.dto.ts`, `create-deed.dto.ts`, `update-profile.dto.ts`, `is-tag.ts`).
- Серверные ошибки (400/409) по-прежнему мапятся через `shared/api/*` — клиентская
  валидация лишь улучшает UX (мгновенная обратная связь), сервер остаётся источником истины.

---

## 4. Дизайн-система и «невероятно крутой» фронт (E, H, I)

### 4.1 Токены и утилиты

- Расширить `app/globals.css` / `@theme` токенами: цвета (brand/surface/muted/danger/success),
  радиусы, тени, отступы, типографика. Тёмная тема — через токены, а не дублирование классов.
- Ввести `class-variance-authority (cva)` + `tailwind-merge` + хелпер `cn()` в `shared/lib/cn.ts`.
  Длинные инлайн-классы из `PrimaryButton`/`TextField` переезжают в варианты (`variant`, `size`, `state`).

### 4.2 UI-kit (`shared/ui`)

- Привести примитивы к единому API: `Button` (variant: primary/secondary/ghost/danger; size; loading),
  `Input`/`TextArea` (через `forwardRef`, совместимы с RHF `register`), `Field` (label+error+hint обёртка),
  `Card`, `Modal`/`Dialog` (на нативном `<dialog>` или Radix), `Skeleton`, `Badge`, `Toast`.
- Заменить единичный баннер (`ui-slice`) на **toast-систему** (очередь сообщений) + сохранить
  `ErrorBanner` для inline-кейсов. Добавить глобальный `ErrorBoundary` на уровне `app`.

### 4.3 UX-улучшения

- Анимации/переходы (Framer Motion или CSS) для модалок, появления карточек, смены статусов дел.
- Скелетоны уже есть — связать их единообразно через `ListQueryState`.
- Тема: явный переключатель light/dark/system (хранить в `localStorage` + `shared/lib/hooks/useTheme`).
- Доступность (a11y): фокус-ловушки в модалках, `aria-*`, навигация с клавиатуры, контраст.
- i18n: вынести строки в `shared/config/messages` (готовность к `next-intl`), убрать хардкод.

---

## 5. Безопасность и сессия (F)

- Перевести JWT из `localStorage` в **httpOnly cookie** + обновить `prepareHeaders`/CORS на бэкенде,
  либо явно зафиксировать trade-off в доке (для теста допустимо, но описать риск XSS).
- Защита маршрутов через **Next.js `middleware.ts`** (редирект неавторизованных до рендера),
  оставив `AuthGuard` как клиентский запасной слой. Убрать жёсткий `window.location.href` в пользу
  навигации Next, где возможно.
- Гидрация сессии: вынести логику `setHydrating`/чтения токена в один `SessionProvider` (app-слой),
  чтобы убрать «мигание» и гонки.

---

## 6. Тестирование и качество (D, G)

- **Границы FSD (D):** добавить `steiger` (FSD-линтер) + `eslint-plugin-boundaries` или
  `eslint-plugin-import` с правилами: запрет восходящих импортов, импорт слайса только через `index.ts`,
  запрет прямых кросс-импортов сущностей мимо `@x`.
- **Unit/Component:** перевести vitest на `jsdom` + `@testing-library/react`, добавить тесты хуков форм и UI-kit.
- **API-моки:** `msw` для изоляции RTK Query в тестах.
- **E2E:** `Playwright` — сценарии login/register, CRUD дел, друзья по tag, settings.
- **CI:** расширить `frontend` job: `lint` + `test` (с покрытием) + `typecheck` (`tsc --noEmit`) + `build` + `steiger` + e2e (smoke).
- **Prettier:** добавить на фронт (на бэке уже есть) для единого форматирования.

---

## 7. Бэкенд (точечно, для полноты)

Бэкенд уже аккуратно модульный (`auth/users/deeds/friends/common`). Предложения:

- Sentry/структурное логирование, rate-limiting на auth (`@nestjs/throttler`).
- Пагинация для `GET /deeds` и списков друзей (готовность к росту данных).
- Sync контрактов: генерация типов фронта из Swagger/OpenAPI (или общий `packages/contracts`),
  чтобы `entities/*/model/types.ts` не расходились с DTO.

---

## 8. Дорожная карта (этапы и Definition of Done)

Этапы упорядочены по зависимости; каждый — отдельный PR.

### Этап 0. Фундамент инструментов
- Подключить `steiger`, boundaries-правила ESLint, Prettier, `tsc --noEmit` в CI, vitest+jsdom+RTL+msw.
- **DoD:** CI красит нарушения границ; базовый тест-раннер компонентов работает.

### Этап 1. `shared` — движок форм и хуки
- `shared/lib/forms` (`useMutationForm`, `buildPatch`), `shared/lib/hooks` (`useDisclosure`, `useSelection`, `useTheme`), `shared/validation` (zod), `shared/config` (`routes`, `env`, `messages`), `cn()`.
- **DoD:** примитивы покрыты тестами, документированы в `index.ts`.

### Этап 2. Рефакторинг фич на новый движок
- Auth (login/register), Deed (create/edit), Profile, списки/модалки → через общие хуки.
- Удалить дублирующиеся `mapDeedFieldErrors`, ручные `useState`-каркасы.
- **DoD:** строки кода в `model/` фич сокращены, поведение не изменилось (тесты зелёные).

### Этап 3. Дизайн-система
- Токены в `globals.css`, `cva`-варианты, переписанные `Button/Input/Field/Modal/Toast`, тема.
- **DoD:** инлайн Tailwind-строки заменены вариантами; визуальный смоук пройден.

### Этап 4. UX и доступность
- Тосты вместо одиночного баннера, error boundary, анимации, a11y, скелетоны.
- **DoD:** базовый a11y-чек (axe) без критичных ошибок.

### Этап 5. Безопасность сессии
- Cookie-сессия или зафиксированный trade-off, `middleware.ts`, `SessionProvider`.
- **DoD:** защита маршрутов работает до рендера; нет «мигания» авторизации.

### Этап 6. Тесты и контракты
- Component/hook тесты, Playwright e2e, генерация типов из OpenAPI.
- **DoD:** ключевые сценарии покрыты e2e; типы фронта синхронны с бэком.

---

## 9. Принципы код-стайла (чтобы оставалось «эталонно»)

- Один слайс — одна ответственность; публичный API только через `index.ts`.
- В `ui/` — никакой бизнес-логики: только верстка + проп-колбэки из `model/`.
- В `model/` — никакого JSX; чистые мапперы — в `lib/`.
- Импорты строго по правилу зависимостей (enforced линтером).
- Никаких «магических» строк: пути/теги/сообщения — в `shared/config`.
- Дублирование > 2 раз → выносим в `shared`.

---

## 10. Быстрые победы (можно начать сразу)

1. Вынести `mapDeedFieldErrors` в один модуль (убрать копию).
2. Завести `cn()` + `tailwind-merge`, вынести классы `Button`/`TextField` в `cva`.
3. Добавить `tsc --noEmit` и `steiger` в CI.
4. `useDisclosure` вместо ручных `useState(false)` модалок.
5. `shared/config/routes.ts` вместо строковых путей (`/deeds`, `/login?reason=…`).
