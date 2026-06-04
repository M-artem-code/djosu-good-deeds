---
phase: 03-friends-shared-deeds
plan: 02
subsystem: ui
tags: [friends, rtk-query, modals, add-friend, block-incoming]

requires:
  - phase: 03-friends-shared-deeds
    plan: 01
    provides: getFriends, FriendCard, FriendsList, friends page shell
provides:
  - mapFriendTagValidationErrors for add/block tag fields
  - addFriend, removeFriend, revokeIncoming mutations with LIST invalidation
  - AddFriendForm collapsed reveal with inline 400/404/409 errors
  - RemoveFriendModal and BlockIncomingSection/Modal with confirmations
  - FriendCard Remove control without Link navigation
affects: [03-03]

tech-stack:
  added: []
  patterns:
    - Form 400/404/409 inline only; 5xx via baseApi banner
    - Destructive modals mirror DeleteDeedModal (Escape, focus safe action)
    - Block 404 uses fixed D-12 copy, not API message

key-files:
  created:
    - frontend/src/components/friends/AddFriendForm.tsx
    - frontend/src/components/friends/RemoveFriendModal.tsx
    - frontend/src/components/friends/BlockIncomingSection.tsx
    - frontend/src/components/friends/BlockIncomingModal.tsx
  modified:
    - frontend/src/lib/api/validation-errors.ts
    - frontend/src/store/friendsApi.ts
    - frontend/src/components/friends/FriendCard.tsx
    - frontend/src/components/friends/FriendsList.tsx
    - frontend/src/app/(app)/friends/page.tsx

key-decisions:
  - "Remove button outside Link with stopPropagation wrapper to avoid card navigation"
  - "BlockIncomingModal receives normalized tag; D-12 message never uses API Friendship not found text"

patterns-established:
  - "AddFriendForm mirrors AddDeedForm reveal and auto-expand when friendCount === 0"
  - "Block flow opens modal on Block click; revokeIncoming only on confirm"

requirements-completed: [FRND-02, FRND-03, FRND-04]

duration: 25min
completed: 2026-06-04
---

# Phase 3 Plan 02: Friends Management Summary

**Add/remove/block friend flows on /friends with RTK mutations, collapsed add form, and destructive confirmation modals**

## Performance

- **Duration:** 25 min
- **Tasks:** 3
- **Files modified:** 10

## Accomplishments

- `mapFriendTagValidationErrors` and three write mutations on `friendsApi`
- AddFriendForm: collapsed reveal, normalizeTag on submit, inline 400/404/409
- RemoveFriendModal with D-08 copy; FriendCard Remove with stopPropagation
- BlockIncomingSection below list; BlockIncomingModal with D-10/D-11/D-12 behavior
- Friends page wires add form, list remove flow, and block section

## Task Commits

Each task was committed atomically in the frontend submodule:

1. **Task 1: mapFriendTagValidationErrors and friendsApi mutations** - `0d3a16a` (feat)
2. **Task 2: AddFriendForm with collapsed reveal and inline errors** - `239047f` (feat)
3. **Task 3: Remove friend modal, block section, FriendCard Remove** - `2099910` (feat)

## Files Created/Modified

- `frontend/src/lib/api/validation-errors.ts` - mapFriendTagValidationErrors
- `frontend/src/store/friendsApi.ts` - addFriend, removeFriend, revokeIncoming
- `frontend/src/components/friends/AddFriendForm.tsx` - collapsed add-by-tag form
- `frontend/src/components/friends/RemoveFriendModal.tsx` - D-08 confirmation
- `frontend/src/components/friends/BlockIncomingSection.tsx` - D-09 block section
- `frontend/src/components/friends/BlockIncomingModal.tsx` - D-10/D-11 block confirm
- `frontend/src/components/friends/FriendCard.tsx` - Remove control + article layout
- `frontend/src/components/friends/FriendsList.tsx` - onRemove prop
- `frontend/src/app/(app)/friends/page.tsx` - full management stack

## Decisions Made

- FriendCard uses article + Link for content and a separate Remove control with stopPropagation wrapper (TextButton onClick has no event parameter).
- Block modal displays normalized tag; section normalizes before opening modal.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## Self-Check: PASSED

- FOUND: frontend/src/components/friends/AddFriendForm.tsx
- FOUND: frontend/src/components/friends/RemoveFriendModal.tsx
- FOUND: frontend/src/components/friends/BlockIncomingSection.tsx
- FOUND: frontend/src/components/friends/BlockIncomingModal.tsx
- FOUND: frontend commit 0d3a16a
- FOUND: frontend commit 239047f
- FOUND: frontend commit 2099910
