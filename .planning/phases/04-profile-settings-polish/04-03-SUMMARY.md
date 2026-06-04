---
phase: 04-profile-settings-polish
plan: 03
subsystem: ui
tags: [ux, skeleton, loading-states, deeds, friends]

requires:
  - phase: 02-my-deeds
    provides: /deeds list page and DeedCard layout
  - phase: 03-friends-shared-deeds
    provides: /friends list page and FriendsList empty copy
provides:
  - DeedSkeletonCard and FriendSkeletonCard pulse placeholders
  - /deeds and /friends skeleton loading, error + Try again refetch, polished empty copy
affects: []

tech-stack:
  added: []
  patterns:
    - Three skeleton rows with aria-busy on list container
    - isError branch never shows empty state or add forms

key-files:
  created:
    - frontend/src/components/ui/DeedSkeletonCard.tsx
    - frontend/src/components/ui/FriendSkeletonCard.tsx
  modified:
    - frontend/src/app/(app)/deeds/page.tsx
    - frontend/src/app/(app)/friends/page.tsx

key-decisions:
  - "/friends/[tag] unchanged per D-15"
  - "Removed centered Loading… text in favor of skeleton stacks"

patterns-established:
  - "Error state: semibold heading + helper + TextButton Try again calling refetch"

requirements-completed: [UX-04]

duration: 15min
completed: 2026-06-04
---

# Phase 4 Plan 03: List UX Polish Summary

**Deeds and friends list routes use skeleton loading, explicit fetch-error retry, and UI-SPEC empty copy — friend deeds route untouched**

## Performance

- **Duration:** 15 min
- **Tasks:** 3
- **Files modified:** 4

## Accomplishments

- Added presentational skeleton cards matching deed/friend card dimensions
- Refactored /deeds: 3 DeedSkeletonCard, Couldn't load your deeds + Try again
- Refactored /friends: 3 FriendSkeletonCard, error retry; intro/add only after success

## Self-Check: PASSED

- No Loading… text on deeds page; FriendSkeletonCard used on friends page
- friends/[tag]/page.tsx not modified
