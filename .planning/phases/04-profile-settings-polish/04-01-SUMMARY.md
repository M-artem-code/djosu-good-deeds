---
phase: 04-profile-settings-polish
plan: 01
subsystem: ui
tags: [settings, profile, rtk-query, users-api]

requires:
  - phase: 01-app-shell-authentication
    provides: authSlice.setUser, RTK Query baseApi, validation error mappers
provides:
  - getMe / updateMe RTK Query endpoints with User ME cache tag
  - ProfileSettingsCard with email read-only row, partial PATCH, inline 400/409
  - Live /settings page with profile load, error retry, auth sync after PATCH
affects: [04-02, 04-03]

tech-stack:
  added: []
  patterns:
    - Partial PATCH body with only changed displayName/tag keys
    - setUser dispatch on updateMe success for AppNav @tag sync

key-files:
  created:
    - frontend/src/components/settings/ProfileSettingsCard.tsx
  modified:
    - frontend/src/store/usersApi.ts
    - frontend/src/app/(app)/settings/page.tsx

key-decisions:
  - "Email as label + plain text, not disabled TextField (D-02)"
  - "ProfileSettingsCard remounts via key={user.updatedAt} after save — no effect sync"
  - "Form-level ErrorBanner for non-field errors; 400/409 inline on fields"

patterns-established:
  - "Settings profile card matches DeedCard rounded-xl border surface"
  - "Save changes disabled when pristine or in-flight"

requirements-completed: [PROF-01, PROF-02]

duration: 25min
completed: 2026-06-04
---

# Phase 4 Plan 01: Profile Settings Summary

**Settings page shows email read-only, editable display name and tag, partial PATCH with inline validation, and AppNav tag sync after save**

## Performance

- **Duration:** 25 min
- **Tasks:** 3
- **Files modified:** 3

## Accomplishments

- Extended `usersApi` with `getMe` and `updateMe` (User ME tag)
- Built `ProfileSettingsCard` with Save changes, normalizeTag, mapValidationErrors/mapConflictError
- Replaced settings stub with live profile load, skeleton, and error + Try again

## Self-Check: PASSED

- `npm run build` and `npm run lint` pass in frontend
- getMe/updateMe hooks exported; Save changes and email row present in ProfileSettingsCard
