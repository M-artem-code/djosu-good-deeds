---
phase: 03-friends-shared-deeds
plan: 03
subsystem: ui
tags: [friends, deeds, rtk-query, read-only, privacy, anti-enumeration]

requires:
  - phase: 03-friends-shared-deeds
    plan: 01
    provides: FriendCard navigation, normalizeTag, friendsApi
  - phase: 03-friends-shared-deeds
    plan: 02
    provides: friends management flows
provides:
  - getFriendDeeds query with FriendDeed cache tags
  - usersApi getUserByTag for displayName on direct URL visits
  - DeedCard readOnly mode (title, badge, description only)
  - FriendDeedList Planned/Done read-only sections
  - /friends/[tag] page with unified 403, loading, empty states
affects: [04-profile-settings-polish]

tech-stack:
  added: []
  patterns:
    - Deeds authorization source of truth on getFriendDeeds; 403 before other errors
    - D-15 UI copy replaces raw API 403 message (FRND-06)
    - Discriminated DeedCard props with DeedCardEditable subcomponent for hooks

key-files:
  created:
    - frontend/src/store/usersApi.ts
    - frontend/src/components/friends/FriendDeedList.tsx
    - frontend/src/app/(app)/friends/[tag]/page.tsx
  modified:
    - frontend/src/store/friendsApi.ts
    - frontend/src/store/index.ts
    - frontend/src/components/deeds/DeedCard.tsx

key-decisions:
  - "DeedCard readOnly via discriminated union; DeedCardEditable extracted to satisfy react-hooks/rules-of-hooks"
  - "Empty/invalid tag shows same ForbiddenDeedsState as 403 (anti-enumeration consistent UX)"
  - "getUserByTag skipped when tag empty; subtitle optional when profile 404 but deeds authorized"

patterns-established:
  - "Friend deeds page branches deedsError.status === 403 before generic isError"
  - "FriendDeedList mirrors DeedList sections; parent owns D-19 empty state"

requirements-completed: [FRND-05, FRND-06]

duration: 20min
completed: 2026-06-04
---

# Phase 3 Plan 03: Friend Deeds Page Summary

**Read-only `/friends/[tag]` with getFriendDeeds, usersApi displayName header, and unified 403 panel that never exposes tag enumeration**

## Performance

- **Duration:** 20 min
- **Tasks:** 3
- **Files modified:** 7

## Accomplishments

- `getFriendDeeds` and `getUserByTag` RTK queries with encoded tag URLs
- `DeedCard` `readOnly` mode hides all mutation controls (D-14)
- `FriendDeedList` renders Planned/Done sections with `gap-6`
- `/friends/[tag]` page: normalizeTag, loading, D-15 403, D-19 empty, D-16 header
- FRND-05 and FRND-06 satisfied end-to-end from FriendCard navigation

## Task Commits

Each task was committed atomically in the frontend submodule:

1. **Task 1: getFriendDeeds query, usersApi getUserByTag, DeedCard readOnly** - `5ea5622` (feat)
2. **Task 2: FriendDeedList with Planned/Done sections** - `77fd20e` (feat)
3. **Task 3: /friends/[tag] page with header, 403 state, loading, empty** - `1da0c3e` (feat)

## Files Created/Modified

- `frontend/src/store/friendsApi.ts` - `getFriendDeeds` query and hook export
- `frontend/src/store/usersApi.ts` - `getUserByTag` for displayName subtitle
- `frontend/src/store/index.ts` - registers usersApi side-effect import
- `frontend/src/components/deeds/DeedCard.tsx` - readOnly view + DeedCardEditable
- `frontend/src/components/friends/FriendDeedList.tsx` - read-only Planned/Done sections
- `frontend/src/app/(app)/friends/[tag]/page.tsx` - friend deeds page with 403/empty/loading

## Decisions Made

- Extracted `DeedCardEditable` so hooks are not called after early return for readOnly
- Invalid/empty normalized tag uses same `ForbiddenDeedsState` as API 403

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] React hooks called conditionally in DeedCard**
- **Found during:** Task 2 (lint verification)
- **Issue:** Early return for `readOnly` before `useUpdateDeedMutation` / `useState` violated `react-hooks/rules-of-hooks`
- **Fix:** Moved editable logic into `DeedCardEditable` subcomponent; `DeedCard` only routes readOnly vs editable
- **Files modified:** `frontend/src/components/deeds/DeedCard.tsx`
- **Verification:** `npm run lint` passes
- **Committed in:** `77fd20e` (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1)
**Impact on plan:** Required for lint/build correctness; no scope change.

## Issues Encountered

None

## Next Phase Readiness

- Phase 3 frontend complete: manage friends + view friend deeds E2E
- Ready for phase verification (`/gsd-verify-work` or phase verifier)
- Phase 4 can proceed with profile/settings polish

## Self-Check: PASSED

- FOUND: `frontend/src/store/usersApi.ts`
- FOUND: `frontend/src/components/friends/FriendDeedList.tsx`
- FOUND: `frontend/src/app/(app)/friends/[tag]/page.tsx`
- FOUND: commit `5ea5622`
- FOUND: commit `77fd20e`
- FOUND: commit `1da0c3e`

---
*Phase: 03-friends-shared-deeds*
*Completed: 2026-06-04*
