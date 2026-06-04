---
phase: 03-friends-shared-deeds
plan: 01
subsystem: ui
tags: [friends, rtk-query, nextjs, one-way-friendships]

requires:
  - phase: 02-my-deeds
    provides: RTK Query inject pattern, card surfaces, page loading/error trilogy
provides:
  - Friend types (UserByTag, FriendItem) without email
  - normalizeTag utility and TAG_PATTERN for client validation
  - getFriends RTK Query endpoint with Friend LIST cache tag
  - FriendCard and FriendsList components
  - Live /friends page with intro, loading, error, and empty states
affects: [03-02, 03-03]

tech-stack:
  added: []
  patterns:
    - friendsApi injectEndpoints mirroring deedsApi
    - Parent page owns isLoading/isError; list renders empty only on success

key-files:
  created:
    - frontend/src/lib/types/friend.ts
    - frontend/src/lib/utils/normalize-tag.ts
    - frontend/src/store/friendsApi.ts
    - frontend/src/components/friends/FriendCard.tsx
    - frontend/src/components/friends/FriendsList.tsx
  modified:
    - frontend/src/store/baseApi.ts
    - frontend/src/store/index.ts
    - frontend/src/app/(app)/friends/page.tsx

key-decisions:
  - "UserByTag excludes email on all friend surfaces (privacy T-03-01)"
  - "List fetch errors show explicit message, not empty state (02-REVIEW / D-22)"
  - "AddFriendForm and BlockIncomingSection deferred to Plan 02 with placeholder comments"

patterns-established:
  - "Friend card row: rounded-lg border, @tag primary, displayName muted, You follow badge"
  - "FriendCard wraps entire row in Link to /friends/[tag] for D-13 navigation"

requirements-completed: [FRND-01]

duration: 20min
completed: 2026-06-04
---

# Phase 3 Plan 01: Friends List Summary

**Live /friends list with directed-friendship intro, getFriends RTK Query, and clickable friend cards linking to /friends/[tag]**

## Performance

- **Duration:** 20 min
- **Tasks:** 3
- **Files modified:** 8

## Accomplishments

- Friend types mirroring backend DTOs (no email on UserByTag)
- `normalizeTag` and `TAG_PATTERN` aligned with backend validation
- `getFriends` query registered with Friend LIST cache tag
- FriendCard shows @tag, displayName, "You follow" badge; links to friend deeds route
- Friends page replaces stub with intro blurb, Loading…, explicit error, and empty state

## Task Commits

Each task was committed atomically in the frontend submodule:

1. **Task 1: Friend types, normalizeTag, friendsApi getFriends, store wiring** - `fd811ad` (feat)
2. **Task 2: FriendCard and FriendsList components** - `581fc25` (feat)
3. **Task 3: Friends page with intro, loading, error, and live list** - `b6d2ae5` (feat)

## Files Created/Modified

- `frontend/src/lib/types/friend.ts` - UserByTag, FriendItem, AddFriendBody stub
- `frontend/src/lib/utils/normalize-tag.ts` - normalizeTag, TAG_PATTERN
- `frontend/src/store/friendsApi.ts` - getFriends query and useGetFriendsQuery hook
- `frontend/src/store/baseApi.ts` - Friend and FriendDeed tagTypes
- `frontend/src/store/index.ts` - side-effect import friendsApi
- `frontend/src/components/friends/FriendCard.tsx` - clickable card row
- `frontend/src/components/friends/FriendsList.tsx` - stack and empty state
- `frontend/src/app/(app)/friends/page.tsx` - live page with intro and state guards

## Decisions Made

- Followed deeds page error pattern but used UI-SPEC copy: "Couldn't load friends. Try again."
- Page title uses `text-[28px]` per 03-UI-SPEC (differs from deeds `text-xl`)
- Plan 02 sections left as comments only (no stub components)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- Parent repo tracks `frontend` as a git submodule; task commits live in `frontend/` repo (master branch).

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Foundation ready for Plan 02: addFriend, removeFriend, revokeIncoming mutations and forms/modals
- FriendCard links to `/friends/[tag]`; Plan 03 implements that route with getFriendDeeds

## Self-Check: PASSED

- `frontend/src/lib/types/friend.ts` - FOUND
- `frontend/src/store/friendsApi.ts` - FOUND
- `frontend/src/components/friends/FriendCard.tsx` - FOUND
- `frontend/src/app/(app)/friends/page.tsx` - FOUND
- Commits fd811ad, 581fc25, b6d2ae5 - FOUND in frontend submodule
- `npm run build` and `npm run lint` - pass

---
*Phase: 03-friends-shared-deeds*
*Completed: 2026-06-04*
