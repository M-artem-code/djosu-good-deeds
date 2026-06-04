---
phase: 4
slug: profile-settings-polish
status: approved
nyquist_compliant: true
wave_0_complete: true
created: 2026-06-04
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> No RESEARCH.md for this phase — strategy derived from PLAN verify blocks and ROADMAP success criteria.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Next.js build + ESLint (no frontend test framework yet) |
| **Config file** | `frontend/eslint.config.mjs`, `frontend/tsconfig.json` |
| **Quick run command** | `cd frontend && npm run build` |
| **Full suite command** | `cd frontend && npm run build && npm run lint` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `cd frontend && npm run build`
- **After every plan wave:** Run `cd frontend && npm run build && npm run lint`
- **Before `/gsd-verify-work`:** Full suite green + manual UAT below
- **Max feedback latency:** 60 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 04-01-01 | 01 | 1 | PROF-01 | T-04-01 | getMe/updateMe Bearer-only; no password in UI | build+rg | `cd frontend && npm run build` | ⬜ | ⬜ pending |
| 04-01-02 | 01 | 1 | PROF-02 | T-04-02 | normalizeTag before PATCH; inline 400/409 | lint+rg | `cd frontend && npm run lint` | ⬜ | ⬜ pending |
| 04-01-03 | 01 | 1 | PROF-01, PROF-02 | — | Settings page live; setUser after PATCH | build+rg | `cd frontend && npm run build` | ⬜ | ⬜ pending |
| 04-02-01 | 02 | 2 | PROF-03 | T-04-03 | deleteMe mutation; modal before DELETE | build+rg | `cd frontend && npm run build` | ⬜ | ⬜ pending |
| 04-02-02 | 02 | 2 | PROF-03 | T-04-04 | Modal copy Delete account? / Keep account | lint+rg | `cd frontend && npm run lint` | ⬜ | ⬜ pending |
| 04-02-03 | 02 | 2 | PROF-03 | T-04-05 | 204 → clearSession → /login?reason=account_deleted | build+rg | `cd frontend && npm run build` | ⬜ | ⬜ pending |
| 04-03-01 | 03 | 3 | UX-04 | — | Skeleton cards pulse; presentational only | lint+rg | `cd frontend && npm run lint` | ⬜ | ⬜ pending |
| 04-03-02 | 03 | 3 | UX-04 | T-04-07 | Deeds error+retry; no Loading… text | build+rg | `cd frontend && npm run build` | ⬜ | ⬜ pending |
| 04-03-03 | 03 | 3 | UX-04 | T-04-08 | Friends error+retry; [tag] page unchanged | build+rg | `cd frontend && npm run build` | ⬜ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [x] Existing infrastructure covers phase — Next.js + ESLint + RTK Query from Phases 1–3
- [x] Backend users API validated (`backend/test/users.e2e-spec.ts` or smoke); manual UAT needs running API + Mongo

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| View profile | PROF-01 | API + auth | Login; visit /settings; see email (read-only), displayName, tag |
| Update displayName | PROF-02 | API interaction | Change name; Save; header/nav reflects if applicable |
| Tag conflict 409 | PROF-02 | API interaction | PATCH to existing tag; inline error under tag field |
| Validation 400 | PROF-02 | API interaction | Empty/invalid tag; inline field errors |
| Nav @tag sync | D-09 discretion | UI | Change tag; save; AppNav shows new @tag |
| Delete account | PROF-03 | Destructive | Delete account → modal → confirm; redirect login with banner |
| Skeleton loading | UX-04 | Visual | Throttle network; /deeds and /friends show 3 pulse cards |
| Error vs empty | UX-04 | API failure | Stop API; lists show error + Try again, not empty/add forms |
| Friend deeds unchanged | D-15 | Scope | /friends/[tag] still Phase 3 loading pattern |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or manual-only mapping above
- [x] Sampling continuity: build after every task
- [x] Wave 0: existing infra sufficient
- [x] No watch-mode flags
- [x] Feedback latency < 60s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-06-04
