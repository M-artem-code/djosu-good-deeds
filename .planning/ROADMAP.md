# Roadmap: Djosu — Good Deeds

## Overview

Brownfield v1 delivers the Next.js frontend as vertical MVP slices against the existing NestJS API. Each phase ships a complete user capability end-to-end: auth shell first, then own deeds, then friends and shared deeds, then profile/settings and UX polish. Backend rework is out of scope.

## Phases

**Phase Numbering:**

- Integer phases (1, 2, 3, 4): Planned milestone work
- Decimal phases (e.g. 2.1): Urgent insertions via `/gsd-phase insert`

- [x] **Phase 1: App Shell & Authentication** - Redux, RTK Query, login/register, protected routes, global API client
- [x] **Phase 2: My Deeds** - List, create, edit, delete own deeds with validation (completed 2026-06-04)
- [x] **Phase 3: Friends & Shared Deeds** - Friends list, add/remove, friend deeds by tag (completed 2026-06-04)
- [x] **Phase 4: Profile, Settings & Polish** - Profile CRUD, delete account, loading/empty states (completed 2026-06-04)

## Phase Details

### Phase 1: App Shell & Authentication

**Goal**: Users can register, log in, stay authenticated, and navigate the app with protected routes
**Mode:** mvp
**Depends on**: Nothing (backend validated; frontend scaffold exists)
**Requirements**: AUTH-FE-01, AUTH-FE-02, AUTH-FE-03, AUTH-FE-04, AUTH-FE-05, UX-01, UX-02, UX-03
**Success Criteria** (what must be TRUE):

  1. User can register with email, password, displayName, and tag; on success they are logged in and see the app shell
  2. User can log in and remain logged in after browser refresh until logout or token expiry
  3. User can log out and loses access to protected routes
  4. Unauthenticated access to protected routes redirects to login
  5. Responsive navigation between main sections works; Bearer token is attached to `/api` requests and API errors show user-visible messages (401 → login, 409 conflict, etc.)

**Plans**: 3 plans
**UI hint**: yes

Plans:
**Wave 1**

- [x] 01-01-PLAN.md — Walking skeleton: Redux/RTK Query, login, minimal AuthGuard, /deeds stub

**Wave 2** *(blocked on Wave 1 completion)*

- [x] 01-02-PLAN.md — Register flow, session refresh hydration, guest auth guard

**Wave 3** *(blocked on Wave 2 completion)*

- [x] 01-03-PLAN.md — App shell: AppNav, ErrorBanner, logout, friends/settings stubs

### Phase 2: My Deeds

**Goal**: Users can manage their own deeds list end-to-end in the UI
**Mode:** mvp
**Depends on**: Phase 1
**Requirements**: DEED-01, DEED-02, DEED-03, DEED-04, DEED-05
**Success Criteria** (what must be TRUE):

  1. User sees their deeds with planned/done status on the deeds page
  2. User can create a deed with title and optional description
  3. User can edit deed fields and change status to done
  4. User can delete a deed from the list
  5. Submitting empty or whitespace-only title shows validation error (400) without silent failure

**Plans**: 3 plans
**UI hint**: yes

Plans:
**Wave 1**

- [x] 02-01-PLAN.md — Deed types, getDeeds, view-only cards, sections, loading/empty (DEED-01)

**Wave 2** *(blocked on Wave 1 completion)*

- [x] 02-02-PLAN.md — AddDeedForm, createDeed, validation mapping (DEED-02, DEED-05)

**Wave 3** *(blocked on Wave 2 completion)*

- [x] 02-03-PLAN.md — Inline edit, status PATCH, delete modal (DEED-03, DEED-04)

### Phase 3: Friends & Shared Deeds

**Goal**: Users can manage friends and view friends' deeds by tag
**Mode:** mvp
**Depends on**: Phase 2
**Requirements**: FRND-01, FRND-02, FRND-03, FRND-05, FRND-06 (FRND-04 out of scope)
**Success Criteria** (what must be TRUE):

  1. User sees friends list with tag and displayName
  2. User can add a friend by tag; duplicate friendship shows 409 with a clear message
  3. User can remove an outgoing friendship from the list
  4. User can open `/friends/[tag]` and see that friend's deeds (no email or other private fields)
  5. Access to a non-friend or unknown tag shows the appropriate error (403 unified on deeds per API)

**Plans**: 3 plans
**UI hint**: yes

Plans:
**Wave 1**

- [x] 03-01-PLAN.md — Friends list: types, getFriends, intro blurb, cards, loading/error/empty (FRND-01)

**Wave 2** *(blocked on Wave 1 completion)*

- [x] 03-02-PLAN.md — Add friend, remove outgoing with modals (FRND-02, FRND-03)

**Wave 3** *(blocked on Wave 2 completion)*

- [x] 03-03-PLAN.md — Friend deeds page read-only, 403 state, usersApi displayName (FRND-05, FRND-06)

### Phase 4: Profile, Settings & Polish

**Goal**: Users can manage profile, delete their account, and experience polished list UX across the app
**Mode:** mvp
**Depends on**: Phase 3
**Requirements**: PROF-01, PROF-02, PROF-03, UX-04
**Success Criteria** (what must be TRUE):

  1. User can view own profile (email, displayName, tag) on the settings page
  2. User can update displayName and tag; validation errors (400) and conflicts (409) are shown inline
  3. User can delete account with confirmation; on 204 they are redirected out of the app (login or public page)
  4. List pages (deeds, friends) show loading indicators and helpful empty states when there is no data

**Plans**: 3 plans
**UI hint**: yes

Plans:
**Wave 1**

- [x] 04-01-PLAN.md — Profile view + edit: getMe/updateMe, ProfileSettingsCard, auth sync (PROF-01, PROF-02)

**Wave 2** *(blocked on Wave 1 completion)*

- [x] 04-02-PLAN.md — Delete account: deleteMe modal, clearSession redirect, login banner (PROF-03)

**Wave 3** *(blocked on Wave 1 completion; parallel-safe with Wave 2)*

- [x] 04-03-PLAN.md — List UX polish: skeletons, error+retry, empty copy on /deeds and /friends (UX-04)

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. App Shell & Authentication | 3/3 | Complete | 2026-06-04 |
| 2. My Deeds | 3/3 | Complete   | 2026-06-04 |
| 3. Friends & Shared Deeds | 2/3 | In Progress|  |
| 4. Profile, Settings & Polish | 3/3 | Complete   | 2026-06-04 |

---
*Roadmap created: 2026-06-04*
*Granularity: standard (4 phases, frontend vertical slices)*
