---
phase: 04-profile-settings-polish
plan: 02
subsystem: ui
tags: [settings, account-delete, auth, modal]

requires:
  - phase: 04-profile-settings-polish
    provides: Live /settings page shell from Plan 01
provides:
  - deleteMe DELETE mutation on usersApi
  - DeleteAccountModal mirroring DeleteDeedModal a11y
  - Settings delete trigger and login account_deleted banner
affects: []

tech-stack:
  added: []
  patterns:
    - clearSession before router.replace on 204
    - Dismissible ErrorBanner on login for account_deleted reason

key-files:
  created:
    - frontend/src/components/settings/DeleteAccountModal.tsx
  modified:
    - frontend/src/store/usersApi.ts
    - frontend/src/app/(app)/settings/page.tsx
    - frontend/src/app/(auth)/login/LoginPageContent.tsx

key-decisions:
  - "Simple modal only — no type-tag confirmation (D-10)"
  - "Initial focus on Keep account; Escape closes when not loading"
  - "TextButton variant destructive for delete trigger (D-12)"

patterns-established:
  - "Post-delete redirect /login?reason=account_deleted with dismissible banner"

requirements-completed: [PROF-03]

duration: 15min
completed: 2026-06-04
---

# Phase 4 Plan 02: Delete Account Summary

**Users confirm account deletion in a brief modal; 204 clears session and lands on login with a deleted-account message**

## Performance

- **Duration:** 15 min
- **Tasks:** 3
- **Files modified:** 4

## Accomplishments

- Added `deleteMe` mutation (DELETE users/me, void response)
- Created `DeleteAccountModal` with UI-SPEC copy and clearSession + redirect
- Wired destructive TextButton on settings and `account_deleted` login banner

## Self-Check: PASSED

- Modal contains Delete account?, Keep account, clearSession
- Login page handles account_deleted query param
