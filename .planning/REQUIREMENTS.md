# Requirements: Djosu — Good Deeds

**Defined:** 2026-06-04
**Core Value:** User can log in, manage own deeds, and view friends' deeds by tag — end-to-end in the UI.

## v1 Requirements

### Authentication (frontend)

- [ ] **AUTH-FE-01**: User can register with email, password, displayName, and tag
- [ ] **AUTH-FE-02**: User can log in and receive a persisted session (token storage)
- [ ] **AUTH-FE-03**: User stays logged in across browser refresh until token expires or logout
- [ ] **AUTH-FE-04**: User can log out and lose access to protected routes
- [ ] **AUTH-FE-05**: Unauthenticated access to protected routes redirects to login

### Profile & settings

- [ ] **PROF-01**: User can view own profile (email, displayName, tag) on settings page
- [ ] **PROF-02**: User can update displayName and tag with validation errors shown (400/409)
- [ ] **PROF-03**: User can delete account with confirmation; UI handles 204 and redirects

### Deeds (own)

- [ ] **DEED-01**: User can list own deeds with status (planned/done)
- [ ] **DEED-02**: User can create a deed with title (and optional description)
- [ ] **DEED-03**: User can edit deed fields and change status to done
- [ ] **DEED-04**: User can delete a deed
- [ ] **DEED-05**: Empty/whitespace title shows validation error (400)

### Friends

- [x] **FRND-01**: User can list friends (tag, displayName)
- [x] **FRND-02**: User can add friend by tag; duplicate shows 409
- [x] **FRND-03**: User can remove friendship
- [x] **FRND-05**: User can open friend page by tag and see friend's deeds (not own private fields)
- [x] **FRND-06**: Access to non-friend or unknown tag shows appropriate error (403/404 per API)

### App shell & UX

- [ ] **UX-01**: Global API client attaches Bearer token to `/api` requests
- [ ] **UX-02**: API errors display user-visible messages (401 → login, 409 conflict, etc.)
- [ ] **UX-03**: Responsive layout with Tailwind; navigation between main sections
- [ ] **UX-04**: Loading and empty states on list pages

## v2 Requirements

### Authentication

- **AUTH-FE-06**: Email verification flow
- **AUTH-FE-07**: Password reset via email

### Platform

- **OPS-01**: GitHub Actions CI (`check` + `test:e2e` with Mongo service)
- **OPS-02**: Cross-platform smoke script (non-PowerShell)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Password / email change UI | Not in backend API |
| Pagination UI | API returns arrays |
| Rate limiting / block | Not in backend |
| Refresh tokens | Access-only JWT by design |
| Mutual friendship / accept | One-way model in DECISIONS §2 |
| Revoke incoming friendship by tag (FRND-04) | Removed from product — no victim-side revoke UI or API in v1 |
| Backend feature changes | Backend validated; v1 is FE integration |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-FE-01 | Phase 1 | Pending |
| AUTH-FE-02 | Phase 1 | Pending |
| AUTH-FE-03 | Phase 1 | Pending |
| AUTH-FE-04 | Phase 1 | Pending |
| AUTH-FE-05 | Phase 1 | Pending |
| UX-01 | Phase 1 | Pending |
| UX-02 | Phase 1 | Pending |
| UX-03 | Phase 1 | Pending |
| DEED-01 | Phase 2 | Pending |
| DEED-02 | Phase 2 | Pending |
| DEED-03 | Phase 2 | Pending |
| DEED-04 | Phase 2 | Pending |
| DEED-05 | Phase 2 | Pending |
| FRND-01 | Phase 3 | Complete |
| FRND-02 | Phase 3 | Complete |
| FRND-03 | Phase 3 | Complete |
| FRND-04 | — | Out of scope |
| FRND-05 | Phase 3 | Complete |
| FRND-06 | Phase 3 | Complete |
| PROF-01 | Phase 4 | Pending |
| PROF-02 | Phase 4 | Pending |
| PROF-03 | Phase 4 | Pending |
| UX-04 | Phase 4 | Pending |

**Coverage:**
- v1 requirements: 22 total
- Mapped to phases: 22
- Unmapped: 0

---
*Requirements defined: 2026-06-04*
*Last updated: 2026-06-04 after roadmap creation*
