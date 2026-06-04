# Walking Skeleton — Djosu Good Deeds

**Phase:** 1
**Generated:** 2026-06-04

## Capability Proven End-to-End

A user can sign in with email and password against the live NestJS API, land on `/deeds` inside a protected route group, and see their `@tag` in the app header after browser refresh — without manual API calls or Postman.

## Architectural Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Framework | Next.js 16 App Router (`frontend/`) | Already scaffolded; App Router route groups fit public `(auth)` vs protected `(app)` split |
| Data layer | MongoDB via existing NestJS API only | Brownfield: backend complete; frontend never talks to DB directly |
| Auth | Bearer JWT in `localStorage` key `djosu_access_token` | Backend accepts only `Authorization: Bearer` (DECISIONS §3); no refresh tokens in v1 |
| API client | Redux Toolkit + RTK Query `baseApi` | Locked in PROJECT.md; `@reduxjs/toolkit` already in `package.json` |
| Route protection | Client `AuthGuard` in `(app)/layout.tsx` | Middleware cannot read `localStorage` (CONTEXT D-10) |
| Deployment target | Local full-stack dev | `docker compose up mongo -d`, backend `:3001`, frontend `:3000`; production FE target deferred |
| Directory layout | `frontend/src/store/`, `frontend/src/lib/`, `frontend/src/components/`, App Router groups `(auth)` / `(app)` | Matches `.planning/codebase/STRUCTURE.md` and `01-PATTERNS.md` |

## Stack Touched in Phase 1

- [x] Project scaffold (Next.js, Tailwind v4, ESLint — pre-existing)
- [x] Routing — `/login`, `/register`, `/deeds`, `/friends`, `/settings`, `/` redirect
- [x] Database — read/write via API: `POST /api/auth/login`, `POST /api/auth/register`, `GET /api/users/me` (Mongo on backend)
- [x] UI — login/register forms, nav, logout, error banner wired to RTK Query
- [x] Deployment — documented local run: Mongo + `npm run start:dev` (backend) + `npm run dev` (frontend) with `NEXT_PUBLIC_API_URL=http://localhost:3001`

## Out of Scope (Deferred to Later Slices)

- Deed CRUD UI (Phase 2)
- Friends list / add / friend deeds by tag (Phase 3)
- Profile edit / account delete UI (Phase 4)
- Refresh tokens, password reset, email verification
- httpOnly cookie session (backend contract is Bearer-only today)
- Frontend unit/E2E test suite (add when stable; Phase 1 uses build/lint/grep gates)
- CI pipeline (OPS-01, v2)
- shadcn / icon npm packages

## Subsequent Slice Plan

Each later phase adds one vertical capability on this skeleton without renegotiating auth storage, RTK Query, or route groups:

- **Phase 2:** My Deeds — list/create/edit/delete own deeds on `/deeds`
- **Phase 3:** Friends & shared deeds — friends CRUD + `/friends/[tag]`
- **Phase 4:** Profile/settings polish — `GET/PATCH/DELETE /api/users/me`, loading/empty states (UX-04)
