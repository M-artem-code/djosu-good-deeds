# Phase 1: App Shell & Authentication - Context

**Gathered:** 2026-06-04
**Status:** Ready for planning

<domain>
## Phase Boundary

Users can register, log in, stay authenticated across browser refresh, log out, and navigate a protected app shell. The global API client attaches Bearer tokens to `/api` requests; auth and API errors surface user-visible messages. Phase 1 delivers the shell and auth flow — deeds, friends, and settings pages may be stubs until later phases fill them in.

</domain>

<decisions>
## Implementation Decisions

### Token storage & session persistence
- **D-01:** Store JWT in `localStorage` under key `djosu_access_token` (not httpOnly cookie — backend only accepts `Authorization: Bearer` today).
- **D-02:** On app load, if token exists, hydrate Redux auth slice and re-fetch `GET /api/users/me` for fresh profile (do not persist user JSON separately in localStorage).
- **D-03:** On any API 401, clear token from localStorage and Redux, then redirect to `/login` with a user-visible "Session expired" message.

### App shell & navigation
- **D-04:** Top navigation bar layout — logo/app name left, section links center, `@tag` + Logout right.
- **D-05:** Nav links active in Phase 1: Deeds (`/deeds`), Friends (`/friends`), Settings (`/settings`) — stub pages acceptable until Phases 2–4.
- **D-06:** Mobile: hamburger menu below `md` breakpoint (Tailwind, no extra deps).
- **D-07:** Authenticated header shows user's `@tag` (or displayName if preferred for readability) plus Logout — no user dropdown required.

### Auth pages & route protection
- **D-08:** Separate routes: `/login` and `/register` with cross-links between them.
- **D-09:** After successful login or register, redirect to `/deeds`.
- **D-10:** Protect authenticated routes via client-side `AuthGuard` in a protected `(app)` route-group layout (not middleware-only — middleware cannot read localStorage).
- **D-11:** If user already has a valid token, redirect away from `/login` and `/register` to `/deeds`.

### API error handling
- **D-12:** Global error banner in the app shell for general API failures (RTK Query baseQuery or middleware-level handler).
- **D-13:** 401 handling: clear session + redirect to `/login?reason=session_expired` (or equivalent) with banner text "Session expired — please log in again."
- **D-14:** 409 Conflict on register: show inline field errors under the relevant field (email vs tag) using API message text.
- **D-15:** 400 validation on auth forms: map NestJS validation errors to inline field errors; use banner only for non-field errors.

### Claude's Discretion
- Exact Redux slice structure (`auth` slice fields, RTK Query `baseApi` file layout).
- Auth form styling (centered card vs full-page) — follow existing Tailwind/Geist scaffold aesthetic.
- Stub page copy for `/deeds`, `/friends`, `/settings` ("Coming soon" vs minimal placeholder).
- Whether header shows `@tag` or `displayName` when both are available (prefer `@tag` per D-07 but either is acceptable).
- Implementation of inline field-error mapping from NestJS `ValidationPipe` response shape.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase scope & requirements
- `.planning/ROADMAP.md` — Phase 1 goal, success criteria, requirement IDs (AUTH-FE-01–05, UX-01–03)
- `.planning/REQUIREMENTS.md` — Auth and UX requirement definitions and traceability
- `.planning/PROJECT.md` — Stack constraints, API contract rules, core value

### Backend auth contract
- `backend/docs/DECISIONS.md` — JWT access-only (§3), global guard + `@Public()` (§1), tag rules (§5)
- `backend/src/auth/dto/auth-response.dto.ts` — `{ accessToken, user: UserPublicDto }` response shape
- `backend/src/auth/dto/register.dto.ts` — Register fields: email, password, displayName, tag
- `backend/src/auth/auth.controller.ts` — `POST /api/auth/register`, `POST /api/auth/login`
- `backend/src/users/users.controller.ts` — `GET /api/users/me` for session hydration
- `backend/src/common/validators/tag.constants.ts` — Tag pattern `^[a-z0-9_]{3,32}$` and validation message

### Frontend integration
- `frontend/.env.example` — `NEXT_PUBLIC_API_URL` (default `http://localhost:3001`)
- `frontend/package.json` — Redux Toolkit + react-redux declared; wire in this phase
- `.planning/codebase/INTEGRATIONS.md` — CORS, Bearer auth, API groups, frontend gaps
- `.planning/codebase/STRUCTURE.md` — Recommended locations: `frontend/src/store/`, `frontend/src/lib/`, App Router routes

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `frontend/src/app/layout.tsx` — Root layout with Geist fonts, `min-h-full flex flex-col` body — wrap with Redux `Provider` here or in a client wrapper.
- `frontend/src/app/globals.css` — Tailwind v4 import; extend with app shell / form utility classes as needed.
- `backend/src/common/dto/user-public.dto.ts` — Type reference for auth user shape (mirror in frontend types, do not change API contract).

### Established Patterns
- RTK Query for API layer — decided in PROJECT.md; `@reduxjs/toolkit` already in dependencies but not wired.
- Bearer JWT only — no refresh token flow (backend DECISIONS §3).
- NestJS validation errors return structured 400 — map to inline field errors on auth forms.
- App Router file-based routing — protected group e.g. `frontend/src/app/(app)/` vs public `(auth)/`.

### Integration Points
- `layout.tsx` — Add Redux Provider + optional auth bootstrap (read token → dispatch → fetch `/users/me`).
- New routes: `(auth)/login/page.tsx`, `(auth)/register/page.tsx`, `(app)/layout.tsx` with AuthGuard + shell nav.
- Stub routes: `(app)/deeds/page.tsx`, `(app)/friends/page.tsx`, `(app)/settings/page.tsx`.
- RTK Query `baseQuery` — read `djosu_access_token` from localStorage, attach `Authorization` header, handle 401 globally per D-03/D-13.

</code_context>

<specifics>
## Specific Ideas

- localStorage key must be exactly `djosu_access_token`.
- Post-auth landing is always `/deeds` (not returnUrl / home dashboard).
- Phase 1 nav should expose all three main sections even if pages are stubs — users see the full app map from day one.
- 409 on register: inline under email or tag field, not only a global banner.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 1-App Shell & Authentication*
*Context gathered: 2026-06-04*
