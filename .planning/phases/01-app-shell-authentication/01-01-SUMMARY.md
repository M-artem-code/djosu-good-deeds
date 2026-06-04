---
phase: 01-app-shell-authentication
plan: 01
subsystem: auth
tags: [redux, rtk-query, jwt, nextjs, login]

requires: []
provides:
  - Redux store with auth slice and RTK Query baseApi
  - Bearer token in localStorage (djosu_access_token)
  - Login page and protected /deeds stub with AuthGuard
affects: [01-02, 01-03, phase-2-deeds]

tech-stack:
  added: []
  patterns:
    - RTK Query baseQueryWithReauth for 401 session expiry
    - Client AuthGuard in (app) route group

key-files:
  created:
    - frontend/src/store/index.ts
    - frontend/src/store/authSlice.ts
    - frontend/src/store/baseApi.ts
    - frontend/src/store/authApi.ts
    - frontend/src/lib/auth/token.ts
    - frontend/src/app/(auth)/login/LoginPageContent.tsx
    - frontend/src/app/(app)/deeds/page.tsx
  modified:
    - frontend/src/app/layout.tsx
    - frontend/src/app/page.tsx

key-decisions:
  - "Skip global 401 redirect on auth/login and auth/register endpoints so invalid login shows inline error"

patterns-established:
  - "Mirror UserPublicDto/AuthResponseDto field names exactly (_id)"
  - "Token-only localStorage persistence; user hydrated via GET /users/me"

requirements-completed: [AUTH-FE-02, AUTH-FE-05, UX-01]

duration: 45min
completed: 2026-06-04
---

# Phase 1 Plan 01 Summary

**Redux + RTK Query walking skeleton: login → JWT in localStorage → protected /deeds stub**

## Accomplishments
- Store layer with typed hooks, auth slice, and RTK Query auth endpoints
- Login form per UI-SPEC with cross-link to register
- AuthGuard protects (app) routes; home redirects by auth state

## Deviations from Plan

None - plan executed as written. Login/register 401 handling excludes public auth endpoints from session-expired redirect (required by acceptance criteria).

## Next Phase Readiness
- Register mutation stubbed in authApi for Plan 02 reuse
- Ready for register page and GuestAuthGuard
