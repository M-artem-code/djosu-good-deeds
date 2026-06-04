# Frontend FSD (Djosu Good Deeds)

## `src/views/` — FSD pages layer

Screen code lives in **`src/views/<screen>/`**. Do not create **`src/pages/`** (Next.js Pages Router).

| Segment | Role |
|---------|------|
| `ui/` | Page component (default export) |
| `model/` | Hooks and page-local state |
| `index.ts` | Public API: `export { default } from "./ui/..."` |

Routes import screens as **`@/views/<screen>`** (via `@/*` → `src/*`).

## `src/app/` — Next.js routes

**Route groups** (скобки в пути — не в URL): отдельные зоны для гостя и для залогиненного пользователя.

| Group | Routes (URL) | Layout |
|-------|----------------|--------|
| `(authenticated)/` | `/deeds`, `/friends`, `/friends/[tag]`, `/settings` | `authenticated-layout.tsx` (nav + AuthGuard) |
| `(auth)/` | `/login`, `/register` | `guest-layout.tsx` (GuestAuthGuard) |
| `app/` root | `/` | root `layout.tsx` only |

`page.tsx` в группах: `export { default } from "@/views/<screen>"`.

Shared layout modules: `app/authenticated-layout.tsx`, `app/guest-layout.tsx`, `app/app-nav/`.

## Layers

| Layer | Path | Import example |
|-------|------|----------------|
| app | `src/app/` | `@/app/app-nav` |
| pages | `src/views/` | `@/views/deeds` |
| features | `src/features/<slice>/` | `@/features/deed/create` |
| entities | `src/entities/<entity>/` | `@/entities/deed` |
| shared | `src/shared/` | `@/shared/ui`, `@/shared/api` |

## Dependency rule

```
app → views, features, entities, shared
views → features, entities, shared
features → entities, shared
entities → shared only
```

Page chrome (`PageShell`, `PageHeader`, `ListQueryState`) is in **`shared/ui`**. **`AppNav`** is in **`app/app-nav`** (uses auth features).

## Adding a screen

1. `src/views/<name>/ui/<Name>Page.tsx` — default export.
2. `src/views/<name>/index.ts` — re-export default from `ui/`.
3. Protected → `src/app/(authenticated)/<route>/page.tsx`; guest → `src/app/(auth)/<route>/page.tsx`.
4. `export { default } from "@/views/<name>"` — layout от группы `(authenticated)` или `(auth)`.

## RTK

- Store: `@/shared/api`
- Endpoints: `entities/*/api`, `features/auth/api`
