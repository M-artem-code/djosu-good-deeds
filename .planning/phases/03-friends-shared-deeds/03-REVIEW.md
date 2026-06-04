---
phase: 03-friends-shared-deeds
reviewed: 2026-06-04T18:00:00Z
depth: standard
files_reviewed: 18
files_reviewed_list:
  - frontend/src/lib/types/friend.ts
  - frontend/src/lib/utils/normalize-tag.ts
  - frontend/src/lib/api/validation-errors.ts
  - frontend/src/store/baseApi.ts
  - frontend/src/store/friendsApi.ts
  - frontend/src/store/usersApi.ts
  - frontend/src/store/index.ts
  - frontend/src/components/friends/AddFriendForm.tsx
  - frontend/src/components/friends/RemoveFriendModal.tsx
  - frontend/src/components/friends/BlockIncomingSection.tsx
  - frontend/src/components/friends/BlockIncomingModal.tsx
  - frontend/src/components/friends/FriendCard.tsx
  - frontend/src/components/friends/FriendsList.tsx
  - frontend/src/components/friends/FriendDeedList.tsx
  - frontend/src/components/deeds/DeedCard.tsx
  - frontend/src/app/(app)/friends/page.tsx
  - frontend/src/app/(app)/friends/[tag]/page.tsx
findings:
  critical: 1
  warning: 2
  info: 1
  total: 4
status: issues_found
---

# Phase 3: Code Review Report

**Reviewed:** 2026-06-04  
**Depth:** standard  
**Files Reviewed:** 18  
**Status:** issues_found

## Summary

Phase 03 friends-shared-deeds frontend was reviewed across all three plan summaries (list, management, friend deeds). Scope covers `components/friends/`, `/friends` routes, `friendsApi.ts`, `usersApi.ts`, and `DeedCard` read-only mode. RTK wiring, 403 branching, D-12 block copy, and read-only deed surfaces align with `03-UI-SPEC.md` and backend anti-enumeration on **deeds** fetches.

The primary defect is **client-side authorization drift**: `removeFriend` does not invalidate `FriendDeed` cache entries, so a user can still see a former friend’s deeds from RTK cache after removal (browser back or remount) until a background refetch completes. Secondary issues are silent add-friend failures when 404/409 bodies lack `message`, and redundant 5xx/FETCH error surfacing on the friend-deeds page.

## Critical Issues

### CR-01: Removed friends’ deeds can render from stale RTK cache

**File:** `frontend/src/store/friendsApi.ts:19-25`  
**Issue:** `removeFriend` only invalidates `{ type: "Friend", id: "LIST" }`. `getFriendDeeds` provides `{ type: "FriendDeed", id: tag }` but nothing clears that tag on remove. After removing a friend, navigating to `/friends/{tag}` (e.g. browser back) can immediately render the previous successful `getFriendDeeds` payload while refetch is in flight — exposing deeds the user is no longer authorized to view (FRND-06 / privacy regression).  
**Fix:**

```ts
removeFriend: builder.mutation<void, string>({
  query: (friendshipId) => ({
    url: `friends/${friendshipId}`,
    method: "DELETE",
  }),
  invalidatesTags: [
    { type: "Friend", id: "LIST" },
    { type: "FriendDeed" },
  ],
}),
```

`{ type: "FriendDeed" }` without `id` invalidates all per-tag deed queries. Optionally also invalidate on `revokeIncoming` if a viewer had cached deeds for the blocked tag.

## Warnings

### WR-01: Add-friend 404/409 can fail silently when API omits `message`

**File:** `frontend/src/components/friends/AddFriendForm.tsx:73-78`  
**Issue:** For `status === 404 || status === 409`, inline `fieldErrors` are set only when `getApiMessage(error)` returns a string. If Nest returns an empty body or non-standard shape, the form shows no field error and no local feedback (5xx still hits `ErrorBanner`, but 404/409 do not). User may think submit did nothing.  
**Fix:**

```ts
if (status === 404 || status === 409) {
  const message = getApiMessage(error);
  setFieldErrors({
    tag: message ?? (status === 404 ? "User not found" : "Already friends"),
  });
  return;
}
```

Align strings with backend defaults or UI-SPEC if product copy differs.

### WR-02: Friend-deeds non-403 errors may double-notify (inline + banner)

**File:** `frontend/src/app/(app)/friends/[tag]/page.tsx:61-71`  
**Issue:** For network/5xx failures, the page renders an inline “Could not load deeds…” message while `baseQueryWithReauth` also dispatches `setBannerMessage` for `FETCH_ERROR` and `status >= 500`. Same request can surface two error UIs (D-22 allows banner or inline, not both).  
**Fix:** Either rely on `ErrorBanner` only for non-403 errors (remove inline block) or skip banner dispatch for friend-deeds endpoints in `baseApi` (narrower). Simplest: drop the inline `isError` branch and document that D-22 is satisfied by the global banner for non-403 failures.

## Info

### IN-01: Modals lack focus trap (consistent with Phase 2)

**File:** `frontend/src/components/friends/RemoveFriendModal.tsx:22-33`, `frontend/src/components/friends/BlockIncomingModal.tsx:25-36`  
**Issue:** Escape and initial focus on “Keep” match `DeleteDeedModal`, but Tab can move focus behind the overlay. Same accessibility gap noted in `02-REVIEW.md`; not a functional bug for v1.  
**Fix:** Add a focus trap (e.g. `focus-trap-react` or manual tab-cycle) when modals are standardized in Phase 4.

---

_Reviewed: 2026-06-04_  
_Reviewer: Claude (gsd-code-reviewer)_  
_Depth: standard_
