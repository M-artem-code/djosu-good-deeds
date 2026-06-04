# Frontend FSD (Djosu Good Deeds)

## `src/views/` + import `@/pages/*`

Next.js reserves a top-level **`src/pages/`** directory for the **Pages Router**. Any `index.ts` / `entry.ts` there that re-exports a page component can register duplicate routes (`/deeds`, `/login`, …) alongside `src/app/`.

The FSD **pages** layer therefore lives in **`src/views/`**, imported as **`@/pages/<screen>`** via `tsconfig` paths (FSD name = pages, physical folder = views).

## Layers

| Layer | Path | Import |
|-------|------|--------|
| app | `src/app/` | — |
| pages | `src/views/` | `@/pages/deeds`, `@/pages/login`, … |
| widgets | `src/widgets/` | `@/widgets` |
| features | `src/features/` | `@/features/<slice>` |
| entities | `src/entities/` | `@/entities/<entity>` |
| shared | `src/shared/` | `@/shared/ui`, `@/shared/api`, `@/shared/lib` |

Public API per screen: `src/views/<screen>/entry.ts` (not `index.ts`) — **only** `export { default }` from the page component; hooks stay in `model/` and are imported relatively from `ui/`.

## Dependency rule

```
app → pages, widgets, shared
pages → widgets, features, entities, shared
widgets → features, entities, shared
features → entities, shared
entities → shared only
```

**entities must not import features.** Deed lists use `DeedGroupedList` + `renderCard`. Own deeds: `EditableDeedCard` (`features/deed/edit`). Friend deeds (read-only): `DeedCardReadOnlyView` from `entities/deed` — not `EditableDeedCard`.

## Adding a screen

1. `src/views/<name>/ui/<Name>Page.tsx` — default export; add `Suspense` here when using `useSearchParams`.
2. `src/views/<name>/entry.ts` — `export { default } from "./ui/..."` only (no hook re-exports).
3. `src/app/.../page.tsx` — `export { default } from "@/pages/<name>"`.

## RTK

- Store: `@/shared/api`
- Endpoints: `entities/*/api`, `features/auth/api`
