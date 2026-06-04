---
phase: 1
slug: app-shell-authentication
status: approved
nyquist_compliant: true
wave_0_complete: true
created: 2026-06-04
---

# Phase 1 — Validation Strategy

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
- **Before `/gsd-verify-work`:** Full suite must be green + manual UAT checklist below
- **Max feedback latency:** 60 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 01-01-01 | 01 | 1 | UX-01, AUTH-FE-02 | T-01-01 | Token in localStorage only; Bearer header set | build+rg | `cd frontend && npm run build && npm run lint` | ✅ | ⬜ pending |
| 01-01-02 | 01 | 1 | AUTH-FE-02, AUTH-FE-05 | T-01-06 | AuthGuard blocks unauthenticated /deeds | build+manual | `cd frontend && npm run build` | ✅ | ⬜ pending |
| 01-02-01 | 02 | 2 | AUTH-FE-01, UX-02 | T-01-07 | 409 inline on register only | build+rg | `cd frontend && npm run build` | ✅ | ⬜ pending |
| 01-02-02 | 02 | 2 | AUTH-FE-03 | T-01-09 | getMe hydrates session on refresh | build+manual | `cd frontend && npm run build` | ✅ | ⬜ pending |
| 01-03-01 | 03 | 3 | UX-03 | — | Responsive nav + stubs | build+rg | `cd frontend && npm run build` | ✅ | ⬜ pending |
| 01-03-02 | 03 | 3 | AUTH-FE-04, UX-02 | T-01-11 | Logout clears djosu_access_token | build+manual | `cd frontend && npm run build` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [x] Existing infrastructure covers all phase requirements — Next.js scaffold + ESLint present
- [ ] No new test framework in Phase 1 (deferred per PROJECT.md / SKELETON.md)

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Login → /deeds walking skeleton | AUTH-FE-02 | No FE E2E yet | Start Mongo + backend :3001 + frontend :3000; login; confirm /deeds stub |
| Register + inline 409 | AUTH-FE-01 | API interaction | Register duplicate email; inline field error under email or tag |
| Session persists on refresh | AUTH-FE-03 | Browser localStorage | Reload /deeds; user stays authenticated |
| Logout clears protected access | AUTH-FE-04 | Browser navigation | Log out; visit /deeds → redirect /login |
| Session expired banner | UX-02 | Query param UX | Expire/clear token server-side or wait; 401 → /login?reason=session_expired |
| Mobile hamburger nav | UX-03 | Viewport | Resize &lt; md; toggle menu; navigate links |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or manual-only mapping above
- [x] Sampling continuity: build after every task
- [x] Wave 0: existing infra sufficient
- [x] No watch-mode flags
- [x] Feedback latency &lt; 60s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-06-04
