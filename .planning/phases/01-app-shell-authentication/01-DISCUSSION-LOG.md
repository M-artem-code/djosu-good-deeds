# Phase 1: App Shell & Authentication - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-04
**Phase:** 1-App Shell & Authentication
**Areas discussed:** Token storage, App shell & navigation, Auth page flow, API errors & 401 handling

---

## Token storage

| Option | Description | Selected |
|--------|-------------|----------|
| localStorage | Persist token across refresh; standard SPA + Bearer header | ✓ |
| httpOnly cookie | Would need backend/BFF changes — out of scope | |
| sessionStorage | Session-only; weaker persistence vs AUTH-FE-03 | |

| Option | Description | Selected |
|--------|-------------|----------|
| Redux only + re-fetch /users/me on app load | Single source of truth, fresh profile | ✓ |
| Redux + cache user JSON in localStorage | Faster render but stale risk | |
| No user in Redux until /users/me returns | Slower, no benefit | |

| Option | Description | Selected |
|--------|-------------|----------|
| djosu_access_token | Dedicated namespaced key | ✓ |
| rtk_auth_token | Coupled to library naming | |
| token | Generic short key | |

| Option | Description | Selected |
|--------|-------------|----------|
| Clear on 401 + redirect to login | Simple, matches UX-02 | ✓ |
| Proactive jwt-decode expiry check | Extra dependency | |
| Only clear on explicit logout | Confusing when token expires | |

**User's choice:** localStorage (`djosu_access_token`), Redux + `/users/me` refetch on load, clear on 401.

---

## App shell & navigation

| Option | Description | Selected |
|--------|-------------|----------|
| Top navigation bar | Logo left, links center, user right; hamburger on mobile | ✓ |
| Sidebar | Persistent left panel — heavier for MVP | |
| Minimal header only | Expand nav later — rework risk | |

| Option | Description | Selected |
|--------|-------------|----------|
| All three links with stubs | /deeds, /friends, /settings active in Phase 1 | ✓ |
| Home/dashboard only | Add links in Phase 2+ | |
| Deeds + Settings only | Friends link deferred to Phase 3 | |

| Option | Description | Selected |
|--------|-------------|----------|
| Hamburger menu on mobile | Standard Tailwind pattern | ✓ |
| Always horizontal links | Cramped on small screens | |
| Bottom tab bar on mobile | Different desktop/mobile pattern | |

| Option | Description | Selected |
|--------|-------------|----------|
| Display @tag + Logout in header | No dropdown required | ✓ |
| User dropdown menu | Extra chrome | |
| Logout only on Settings | Extra click to sign out | |

**User's choice:** Top nav, all section links (stubs OK), hamburger mobile, @tag + Logout in header.

---

## Auth page flow

| Option | Description | Selected |
|--------|-------------|----------|
| Separate /login and /register | Clear URLs, cross-links | ✓ |
| Single /auth with tabs | Fewer routes, more client state | |
| Modal on landing | Unusual for App Router MVP | |

| Option | Description | Selected |
|--------|-------------|----------|
| /deeds after login/register | Core value destination | ✓ |
| / home dashboard | Extra page to maintain | |
| returnUrl redirect | Nice UX, more logic | |

| Option | Description | Selected |
|--------|-------------|----------|
| Client AuthGuard in protected layout | Works with localStorage | ✓ |
| Next.js middleware only | Cannot read localStorage | |
| Middleware + client guard | Redundant with localStorage | |

| Option | Description | Selected |
|--------|-------------|----------|
| Redirect authenticated users away from auth pages | Standard pattern | ✓ |
| Allow access when logged in | Confusing | |
| Redirect from /login only | Edge case for register | |

**User's choice:** Separate auth pages, land on `/deeds`, client layout guard, redirect logged-in users from auth routes.

---

## API errors & 401 handling

| Option | Description | Selected |
|--------|-------------|----------|
| Global error banner in app shell | No extra dependency | ✓ |
| Toast notifications | Needs library | |
| Inline on forms only | Hard to surface global failures | |

| Option | Description | Selected |
|--------|-------------|----------|
| Redirect with "Session expired" message | Clear user feedback | ✓ |
| Silent redirect to /login | Minimal UX-02 | |
| Modal before redirect | Extra friction | |

| Option | Description | Selected |
|--------|-------------|----------|
| Inline under relevant field for 409 | email vs tag mapping | ✓ |
| Global banner with API message | Less precise | |
| Generic error only | Hides useful detail | |

| Option | Description | Selected |
|--------|-------------|----------|
| Inline field errors for 400 validation | Map NestJS validation array | ✓ |
| Banner with first message | Less polished | |
| Generic "Invalid input" | Ignores structured errors | |

**User's choice:** Global banner for general errors; 401 → session expired message; 409 and 400 → inline field errors on auth forms.

---

## Claude's Discretion

Auth form visual styling, Redux/RTK file layout, stub page copy, header @tag vs displayName display, NestJS error-to-field mapping implementation details.

## Deferred Ideas

None captured during this discussion.
