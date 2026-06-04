---
phase: 3
slug: friends-shared-deeds
status: approved
nyquist_compliant: true
wave_0_complete: true
created: 2026-06-04
---

# Phase 3 — Validation Strategy

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
| 03-01-01 | 01 | 1 | FRND-01 | T-03-01 | UserByTag excludes email; Bearer on GET friends | build+rg | `cd frontend && npm run build` | ⬜ | ⬜ pending |
| 03-01-02 | 01 | 1 | FRND-01 | — | FriendCard You follow + Link to /friends/[tag] | lint+rg | `cd frontend && npm run lint` | ⬜ | ⬜ pending |
| 03-01-03 | 01 | 1 | FRND-01 | — | List error not masquerading as empty | build+rg | `cd frontend && npm run build` | ⬜ | ⬜ pending |
| 03-02-01 | 02 | 2 | FRND-02–04 | T-03-04–07 | Mutations + inline errors; modals before DELETE | build+rg | `cd frontend && npm run build` | ⬜ | ⬜ pending |
| 03-02-02 | 02 | 2 | FRND-02 | T-03-04 | normalizeTag before POST; 409/404 inline | lint+rg | `cd frontend && npm run lint` | ⬜ | ⬜ pending |
| 03-02-03 | 02 | 2 | FRND-03, FRND-04 | T-03-06–07 | Remove/block modals; D-12 generic 404 | build+rg | `cd frontend && npm run build` | ⬜ | ⬜ pending |
| 03-03-01 | 03 | 3 | FRND-05 | T-03-08–11 | readOnly DeedCard; getFriendDeeds | build+rg | `cd frontend && npm run build` | ⬜ | ⬜ pending |
| 03-03-02 | 03 | 3 | FRND-05 | — | FriendDeedList Planned/Done read-only | lint+rg | `cd frontend && npm run lint` | ⬜ | ⬜ pending |
| 03-03-03 | 03 | 3 | FRND-05, FRND-06 | T-03-08 | 403 unified copy; never user not found on deeds | build+rg | `cd frontend && npm run build` | ⬜ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [x] Existing infrastructure covers phase — Next.js + ESLint + RTK Query from Phases 1–2
- [x] Backend friends API validated (`backend/test/friends.e2e-spec.ts`); manual UAT needs running API + Mongo

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Friends list loads | FRND-01 | API + auth | Login; visit /friends; see cards with @tag + displayName |
| Add friend 409 | FRND-02 | API interaction | Add same tag twice; inline Already friends under field |
| Add unknown tag 404 | FRND-02 | API interaction | Add nonexistent tag; inline User not found |
| Remove friend modal | FRND-03 | UX flow | Remove → modal → confirm; row disappears |
| Block incoming 404 | FRND-04 | API interaction | Block tag with no incoming; D-12 generic inline |
| Friend deeds read-only | FRND-05 | Navigation | Click card; Planned/Done sections; no edit/delete |
| Non-friend deeds 403 | FRND-06 | Privacy | Open /friends/{stranger}; unified 403 + Back to friends |
| One-way intro copy | D-01–D-03 | Copy review | Intro blurb + You follow badge visible |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or manual-only mapping above
- [x] Sampling continuity: build after every task
- [x] Wave 0: existing infra sufficient
- [x] No watch-mode flags
- [x] Feedback latency < 60s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-06-04
