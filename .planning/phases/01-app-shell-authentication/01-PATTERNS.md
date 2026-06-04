# Phase 1: App Shell & Authentication - Pattern Map

**Mapped:** 2026-06-04
**Files analyzed:** 24
**Analogs found:** 14 / 24

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `frontend/src/app/layout.tsx` | layout / provider host | transform | `frontend/src/app/layout.tsx` | exact (modify) |
| `frontend/src/components/providers/StoreProvider.tsx` | provider | transform | `frontend/src/app/layout.tsx` | role-match |
| `frontend/src/store/index.ts` | store | pub-sub | — | no analog |
| `frontend/src/store/authSlice.ts` | store slice | transform | — | no analog |
| `frontend/src/store/baseApi.ts` | service / API client | request-response | `backend/test/auth.e2e-spec.ts` | partial (API contract) |
| `frontend/src/lib/types/user.ts` | model / types | transform | `backend/src/common/dto/user-public.dto.ts` | exact (mirror) |
| `frontend/src/lib/types/auth.ts` | model / types | transform | `backend/src/auth/dto/auth-response.dto.ts` | exact (mirror) |
| `frontend/src/lib/auth/token.ts` | utility | file-I/O | — | no analog |
| `frontend/src/lib/api/validation-errors.ts` | utility | transform | `backend/src/auth/dto/register.dto.ts` | role-match |
| `frontend/src/app/(auth)/layout.tsx` | layout | transform | `frontend/src/app/layout.tsx` | role-match |
| `frontend/src/app/(auth)/login/page.tsx` | component / page | request-response | `frontend/src/app/page.tsx` | role-match |
| `frontend/src/app/(auth)/register/page.tsx` | component / page | request-response | `frontend/src/app/page.tsx` | role-match |
| `frontend/src/app/(app)/layout.tsx` | layout / guard host | request-response | `frontend/src/app/layout.tsx` + `backend/src/common/guards/jwt-auth.guard.ts` | partial |
| `frontend/src/components/auth/AuthGuard.tsx` | middleware / guard | request-response | `backend/src/common/guards/jwt-auth.guard.ts` | conceptual |
| `frontend/src/components/layout/AppNav.tsx` | component | request-response | `frontend/src/app/page.tsx` | partial (Tailwind nav) |
| `frontend/src/components/feedback/ErrorBanner.tsx` | component | event-driven | — | no analog |
| `frontend/src/components/auth/AuthCard.tsx` | component | transform | `frontend/src/app/page.tsx` | partial (card surface) |
| `frontend/src/components/ui/TextField.tsx` | component | transform | — | no analog |
| `frontend/src/components/ui/PrimaryButton.tsx` | component | transform | `frontend/src/app/page.tsx` | partial (CTA button) |
| `frontend/src/components/ui/TextButton.tsx` | component | transform | `frontend/src/app/page.tsx` | partial (muted link) |
| `frontend/src/app/(app)/deeds/page.tsx` | component / page | CRUD (stub) | `frontend/src/app/page.tsx` | role-match |
| `frontend/src/app/(app)/friends/page.tsx` | component / page | CRUD (stub) | `frontend/src/app/page.tsx` | role-match |
| `frontend/src/app/(app)/settings/page.tsx` | component / page | CRUD (stub) | `frontend/src/app/page.tsx` | role-match |
| `frontend/src/app/page.tsx` | route | request-response | `frontend/src/app/page.tsx` | exact (modify) |
| `frontend/src/app/globals.css` | config | transform | `frontend/src/app/globals.css` | exact (modify) |

---

## Pattern Assignments

### `frontend/src/app/layout.tsx` (layout, modify)

**Analog:** `frontend/src/app/layout.tsx`

**Imports pattern** (lines 1-3):
```typescript
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
```

**Font + HTML shell pattern** (lines 5-32):
```typescript
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
```

**Modification pattern:** Keep server component; wrap `{children}` with client `StoreProvider`. Update `metadata.title` to `"Djosu"`. Do not import Redux directly in this file — delegate to a `"use client"` provider wrapper per Next.js App Router convention.

---

### `frontend/src/components/providers/StoreProvider.tsx` (provider, transform)

**Analog:** `frontend/src/app/layout.tsx` (composition) + RTK `Provider` (no existing frontend file)

**Core pattern to implement:**
```typescript
"use client";

import { Provider } from "react-redux";
import { store } from "@/store";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
```

**Bootstrap pattern (from CONTEXT D-02):** On mount, read `localStorage.getItem("djosu_access_token")`; if present, dispatch auth slice `setToken` and trigger RTK Query `getMe` endpoint to hydrate user. No separate user JSON in localStorage.

---

### `frontend/src/store/index.ts` (store, pub-sub)

**Analog:** None — first Redux store in codebase

**Recommended structure** (from `frontend/package.json` deps + `.planning/codebase/STRUCTURE.md`):
```typescript
import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./baseApi";
import authReducer from "./authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

**Location convention:** `frontend/src/store/` per STRUCTURE.md; use `@/*` path alias from `frontend/tsconfig.json`.

---

### `frontend/src/store/authSlice.ts` (store slice, transform)

**Analog:** None — mirror backend auth state shape from `AuthResponseDto`

**State shape pattern** (derived from `backend/src/auth/dto/auth-response.dto.ts` + CONTEXT D-01/D-02):
```typescript
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { UserPublic } from "@/lib/types/user";

interface AuthState {
  accessToken: string | null;
  user: UserPublic | null;
  isHydrating: boolean;
}

const initialState: AuthState = {
  accessToken: null,
  user: null,
  isHydrating: true,
};

// Reducers: setCredentials({ accessToken, user }), clearSession(), setHydrating(bool)
// setCredentials also writes/removes localStorage key "djosu_access_token"
```

**Logout / 401 pattern (CONTEXT D-03/D-13):** `clearSession` removes token from localStorage, resets slice, used by baseQuery 401 handler and logout button.

---

### `frontend/src/store/baseApi.ts` (service, request-response)

**Analog:** `backend/test/auth.e2e-spec.ts` (Bearer header + endpoint paths)

**API contract from e2e** (lines 22-61):
```typescript
// POST /api/auth/register → 201 { accessToken, user }
// POST /api/auth/login → 200 { accessToken, user }
// GET /api/users/me + Authorization: Bearer ${accessToken} → 200 user
// GET /api/users/me without token → 401
```

**baseQuery pattern to implement:**
```typescript
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/api`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken
        ?? (typeof window !== "undefined"
          ? localStorage.getItem("djosu_access_token")
          : null);
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: () => ({}),
});
```

**401 global handler (CONTEXT D-03):** Wrap `baseQuery` with `fetchBaseQuery` + custom `baseQueryWithReauth` that on 401: dispatch `clearSession()`, redirect to `/login?reason=session_expired`.

**Env pattern:** Read `NEXT_PUBLIC_API_URL` from `frontend/.env.example` (default `http://localhost:3001`); append `/api` to match backend global prefix in `backend/src/common/bootstrap/configure-app.ts` line 6.

---

### `frontend/src/lib/types/user.ts` (model, transform)

**Analog:** `backend/src/common/dto/user-public.dto.ts`

**Mirror exactly** (lines 3-21):
```typescript
export interface UserPublic {
  _id: string;
  email: string;
  displayName: string;
  tag: string;
  createdAt: string; // ISO date from JSON
  updatedAt: string;
}
```

Do not change field names — API contract is fixed per PROJECT.md constraints.

---

### `frontend/src/lib/types/auth.ts` (model, transform)

**Analog:** `backend/src/auth/dto/auth-response.dto.ts`

**Mirror exactly** (lines 4-10):
```typescript
import type { UserPublic } from "./user";

export interface AuthResponse {
  accessToken: string;
  user: UserPublic;
}
```

---

### `frontend/src/lib/auth/token.ts` (utility, file-I/O)

**Analog:** None

**Constants pattern:**
```typescript
export const ACCESS_TOKEN_KEY = "djosu_access_token";

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function clearStoredToken(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}
```

Key must be exactly `djosu_access_token` per CONTEXT D-01.

---

### `frontend/src/lib/api/validation-errors.ts` (utility, transform)

**Analog:** `backend/src/auth/dto/register.dto.ts` + NestJS `ValidationPipe`

**Backend validation rules to map** (register.dto.ts lines 7-36):
```typescript
// email: trim + lowercase, @IsEmail()
// password: @MinLength(6) @MaxLength(128)
// displayName: trim, @MinLength(1) @MaxLength(64)
// tag: normalizeTag + @IsTag() — pattern ^[a-z0-9_]{3,32}$
```

**Tag constants mirror** (`backend/src/common/validators/tag.constants.ts`):
```typescript
export const TAG_PATTERN = /^[a-z0-9_]{3,32}$/;
export const TAG_VALIDATION_MESSAGE =
  "tag must be 3-32 chars: lowercase letters, numbers, underscore";
```

**NestJS 400 response shape** (from `configure-app.ts` ValidationPipe):
```typescript
// { statusCode: 400, message: string | string[], error: "Bad Request" }
// Map message[] entries to field keys by matching property names in error text
```

**409 mapping** (`backend/src/users/users.service.ts` line 67):
```typescript
// ConflictException('Email or tag already exists')
// Map to inline field error under email or tag based on message substring
```

---

### `frontend/src/app/(auth)/login/page.tsx` (component/page, request-response)

**Analog:** `frontend/src/app/page.tsx` (Tailwind page structure)

**Page layout pattern** (page.tsx lines 4-6 — adapt for auth):
```tsx
export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-12 py-48 dark:bg-zinc-950">
      {/* AuthCard with form */}
    </div>
  );
}
```

**Form submit pattern:** `"use client"` page or extracted client form component; call RTK Query `login` mutation; on success dispatch `setCredentials` + `router.push("/deeds")` (CONTEXT D-09). On 401 show banner with `INVALID_CREDENTIALS_MESSAGE` from backend (`backend/src/common/constants/auth.constants.ts`: `'Invalid credentials'`).

**Cross-link pattern** (page.tsx lines 21-34 — muted anchor):
```tsx
<a className="font-medium text-zinc-950 dark:text-zinc-50" href="/register">
  Create account
</a>
```
Use `TextButton` + Next.js `Link` per UI-SPEC; copy from copywriting contract.

**Session expired** (CONTEXT D-13): Read `searchParams.reason === "session_expired"`; show `ErrorBanner` above card.

---

### `frontend/src/app/(auth)/register/page.tsx` (component/page, request-response)

**Analog:** `frontend/src/app/page.tsx` + `backend/src/auth/auth.controller.ts`

**API endpoint pattern** (auth.controller.ts lines 21-26):
```typescript
@Post('register')
@ApiCreatedResponse({ type: AuthResponseDto })
@ApiConflictResponse({ description: 'Email or tag already exists' })
register(@Body() dto: RegisterDto) {
  return this.authService.register(dto);
}
```

**Fields:** email, password, displayName, tag — match `RegisterDto`. Tag input: decorative `@` prefix in UI only (UI-SPEC); submit normalized tag without `@`.

**409 inline errors (CONTEXT D-14):** Map conflict message to email or tag field, not banner-only.

---

### `frontend/src/app/(app)/layout.tsx` (layout/guard host, request-response)

**Analog:** `frontend/src/app/layout.tsx` + `backend/src/common/guards/jwt-auth.guard.ts`

**Shell structure (UI-SPEC):**
```tsx
// AuthGuard wraps children
// AppNav (56px header) + ErrorBanner slot + main content area
<div className="flex min-h-full flex-col bg-zinc-50 dark:bg-zinc-950">
  <AppNav />
  <ErrorBanner /> {/* global API errors */}
  <main className="mx-auto w-full max-w-3xl flex-1 p-6 lg:p-8">{children}</main>
</div>
```

---

### `frontend/src/components/auth/AuthGuard.tsx` (middleware/guard, request-response)

**Analog:** `backend/src/common/guards/jwt-auth.guard.ts` (conceptual — client-side equivalent)

**Backend guard pattern** (jwt-auth.guard.ts lines 12-23):
```typescript
canActivate(context: ExecutionContext) {
  const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
    context.getHandler(),
    context.getClass(),
  ]);

  if (isPublic) {
    return true;
  }

  return super.canActivate(context);
}
```

**Frontend equivalent (CONTEXT D-10/D-11):**
```tsx
"use client";
// If isHydrating → full-page "Loading…" (text-zinc-500, centered)
// If !accessToken → redirect to /login
// If token but !user → wait for getMe or clear on failure
// Render children when authenticated
```

Inverse guard on `(auth)/` routes: if valid token, redirect to `/deeds`.

---

### `frontend/src/components/layout/AppNav.tsx` (component, request-response)

**Analog:** `frontend/src/app/page.tsx` (flex + Tailwind typography)

**Nav link styling from scaffold** (page.tsx lines 37-41 — adapt from pill to UI-SPEC):
```tsx
// Active link: text-base font-semibold + border-b-2 border-zinc-900 dark:border-zinc-50
// Inactive: text-base font-normal text-zinc-600 dark:text-zinc-400
```

**Header layout (UI-SPEC):** `h-14` (56px), `bg-white dark:bg-zinc-900`, `border-b border-zinc-200 dark:border-zinc-700`. Left: "Djosu"; center: Deeds/Friends/Settings; right: `@tag` in `font-mono text-sm` + Logout `TextButton`.

**Mobile (CONTEXT D-06):** Hamburger below `md`; inline SVG icons 20px; `aria-label` toggle; stacked links in dropdown panel.

**Logout:** dispatch `clearSession()`, `router.push("/login")` — no confirmation modal.

---

### `frontend/src/components/feedback/ErrorBanner.tsx` (component, event-driven)

**Analog:** None

**Implementation contract (UI-SPEC):**
```tsx
// role="alert"
// bg-red-50 dark:bg-red-950/40, full-width below nav
// Dismiss via × button; state in Redux or local shell state
// Props: message: string, onDismiss?: () => void
```

Connected to RTK Query global error state or auth slice `apiError` field.

---

### `frontend/src/components/auth/AuthCard.tsx` (component, transform)

**Analog:** `frontend/src/app/page.tsx` (card-like main surface)

**Surface pattern** (page.tsx line 6 — adapt):
```tsx
<div className="w-full max-w-[420px] rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900 lg:p-8">
  {children}
</div>
```

Title uses Display typography: `text-[28px] font-semibold leading-tight`.

---

### `frontend/src/components/ui/TextField.tsx` (component, transform)

**Analog:** None — first form control

**Input spec (UI-SPEC):**
```tsx
// <label htmlFor={id}> + <input id={id} />
// h-11 (44px), rounded-lg, border border-zinc-200 dark:border-zinc-700, px-3
// focus: ring-2 ring-zinc-900 dark:ring-zinc-50 ring-offset-2
// error state: border-red-600 + inline error text-sm text-red-600 below
```

---

### `frontend/src/components/ui/PrimaryButton.tsx` (component, transform)

**Analog:** `frontend/src/app/page.tsx` (primary CTA)

**Button pattern** (page.tsx lines 38-41 — change rounded-full → rounded-lg per UI-SPEC):
```tsx
<button
  type="submit"
  disabled={isLoading}
  className="flex h-11 min-h-[44px] w-full items-center justify-center rounded-lg bg-zinc-900 px-5 text-base font-normal text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900"
>
  {isLoading ? "Signing in…" : "Sign in"}
</button>
```

---

### `frontend/src/components/ui/TextButton.tsx` (component, transform)

**Analog:** `frontend/src/app/page.tsx` (muted text link)

**Link pattern** (page.tsx lines 21-25):
```tsx
<button
  type="button"
  className="text-sm font-normal text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
>
  Log out
</button>
```

Use for Logout and auth cross-links; no accent fill.

---

### `frontend/src/app/(app)/deeds|friends|settings/page.tsx` (component/page, CRUD stub)

**Analog:** `frontend/src/app/page.tsx`

**Stub content pattern:**
```tsx
export default function DeedsPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-xl font-semibold leading-tight text-zinc-900 dark:text-zinc-50">
        My Deeds
      </h1>
      <p className="text-base font-normal leading-normal text-zinc-500 dark:text-zinc-400">
        Your good deeds list will appear here. Full deed management arrives in the next update.
      </p>
    </div>
  );
}
```

Copy from UI-SPEC copywriting contract; left-aligned within `max-w-3xl` main from app layout.

---

### `frontend/src/app/page.tsx` (route, modify)

**Analog:** Self

**Modification:** Redirect `/` to `/deeds` if authenticated, else `/login` — or simple link hub. Minimal change preferred; post-auth landing is always `/deeds` per CONTEXT.

---

### `frontend/src/app/globals.css` (config, modify)

**Analog:** `frontend/src/app/globals.css`

**Existing theme tokens** (lines 1-26):
```css
@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #171717;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}
```

**Modification:** Optionally align `:root` with UI-SPEC zinc palette; ensure `body` uses `font-family: var(--font-geist-sans)` instead of Arial fallback on line 25. Keep Tailwind v4 `@import "tailwindcss"` pattern.

---

## Shared Patterns

### Path alias (`@/*`)

**Source:** `frontend/tsconfig.json` lines 21-23

**Apply to:** All new frontend files
```json
"paths": {
  "@/*": ["./src/*"]
}
```

Import as `@/store`, `@/components/...`, `@/lib/...`.

---

### API base URL & prefix

**Source:** `frontend/.env.example` + `backend/src/common/bootstrap/configure-app.ts`

**Apply to:** `baseApi.ts`, all RTK Query endpoints
```typescript
// NEXT_PUBLIC_API_URL=http://localhost:3001
// fetch baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/api`
```

CORS origin defaults to `http://localhost:3000` on backend; frontend dev on port 3000.

---

### Bearer JWT authentication

**Source:** `backend/test/auth.e2e-spec.ts` lines 49-57

**Apply to:** `baseApi.ts` prepareHeaders, all authenticated endpoints
```typescript
.set("Authorization", `Bearer ${accessToken}`)
```

No refresh token; access-only JWT per backend DECISIONS §3.

---

### Public vs protected routes

**Source:** `backend/src/common/decorators/public.decorator.ts` + `backend/src/auth/auth.controller.ts`

**Apply to:** AuthGuard, RTK Query endpoint definitions
```typescript
// Public (no Bearer required): POST /api/auth/register, POST /api/auth/login
// Protected (Bearer required): GET /api/users/me, all deeds/friends routes
@Public()  // backend pattern — frontend mirrors with route groups (auth) vs (app)
```

---

### Error HTTP semantics

**Source:** `backend/src/users/users.service.ts`, `backend/src/auth/auth.service.ts`

**Apply to:** Form error mapping, baseQuery 401 handler, ErrorBanner

| Status | Backend message | Frontend action |
|--------|-----------------|-----------------|
| 401 | Unauthorized / Invalid credentials | Clear session → `/login?reason=session_expired` or inline on login |
| 409 | Email or tag already exists | Inline field error on register |
| 400 | ValidationPipe message[] | Map to field keys on auth forms |
| 5xx / network | — | ErrorBanner with fallback copy |

---

### Tailwind + dark mode scaffold

**Source:** `frontend/src/app/page.tsx`

**Apply to:** All pages and components
```tsx
// Page bg: bg-zinc-50 dark:bg-zinc-950
// Surface: bg-white dark:bg-zinc-900
// Text hierarchy: text-zinc-900 dark:text-zinc-50 (headings), text-zinc-500 dark:text-zinc-400 (muted)
// Layout: flex flex-col, max-w-3xl mx-auto, gap-* spacing
```

Use `"use client"` only where needed (forms, guards, nav interactivity); keep layouts server components when possible.

---

### Client component boundary

**Source:** Next.js App Router convention (no existing file — standard pattern)

**Apply to:** StoreProvider, AuthGuard, AppNav, auth forms, ErrorBanner
```tsx
"use client";
// Required for useState, useEffect, useRouter, useDispatch, useSelector, event handlers
```

Root `layout.tsx` stays a Server Component; import client providers as child.

---

## No Analog Found

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `frontend/src/store/index.ts` | store | pub-sub | Redux not wired; `@reduxjs/toolkit` in package.json only |
| `frontend/src/store/authSlice.ts` | store slice | transform | No frontend state management exists |
| `frontend/src/lib/auth/token.ts` | utility | file-I/O | No localStorage/token utilities in frontend |
| `frontend/src/components/feedback/ErrorBanner.tsx` | component | event-driven | No feedback/banner components |
| `frontend/src/components/ui/TextField.tsx` | component | transform | No form components; scaffold has no inputs |

**Planner guidance for no-analog files:** Use RTK Query official docs (`createApi`, `fetchBaseQuery`, `injectEndpoints`) and UI-SPEC.md dimensions for styling. API shapes come from backend DTOs and e2e tests — do not invent response types.

---

## Metadata

**Analog search scope:** `frontend/src/**`, `backend/src/auth/**`, `backend/src/common/**`, `backend/test/auth.e2e-spec.ts`, `.planning/codebase/STRUCTURE.md`, `.planning/codebase/INTEGRATIONS.md`

**Files scanned:** 18

**Pattern extraction date:** 2026-06-04

**Note:** No `01-RESEARCH.md` exists for this phase. Backend API contract and frontend scaffold are the primary analog sources. Frontend is greenfield beyond `layout.tsx`, `page.tsx`, and `globals.css`.
