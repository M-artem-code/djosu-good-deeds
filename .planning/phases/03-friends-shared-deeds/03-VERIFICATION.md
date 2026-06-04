---
phase: 03-friends-shared-deeds
verified: 2026-06-04T18:00:00Z
status: passed
score: 9/9
overrides_applied: 0
re_verification: false
human_verification:
  - test: "With backend running, sign in and open /friends — add a friend by tag, then add the same tag again"
    expected: "First add succeeds and list refreshes; second attempt shows inline 409 message under the tag field (not a global banner)"
    why_human: "409 inline mapping depends on live RTK error shape and visible form state"
  - test: "Remove an outgoing friend via card Remove → modal → confirm"
    expected: "Modal copy matches spec (Remove friend? / Keep friend); row disappears after 204; card Link does not navigate when clicking Remove"
    why_human: "stopPropagation and modal confirm flow are interaction-level"
  - test: "Block incoming: enter a tag with no incoming friendship, confirm Block in modal"
    expected: "Inline message reads exactly \"No one with that tag has added you\" — not API Friendship not found or User not found"
    why_human: "D-12 anti-enumeration copy must be confirmed against real 404 from DELETE /friends/incoming/:tag"
  - test: "Open /friends/{nonexistent-or-non-friend-tag} directly in the browser"
    expected: "Centered panel shows \"You can't view this user's deeds\" and Back to friends — same copy for unknown tag and valid tag you do not follow; no email; no raw API 403 text"
    why_human: "Unified 403 UX (FRND-06) requires live API; static grep cannot prove both cases render identically"
  - test: "From /friends, click a friend card; browse Planned/Done read-only deeds"
    expected: "Header shows @{tag}'s deeds and displayName when available; deeds have no edit/delete/status controls; empty friend shows No deeds yet"
    why_human: "Read-only DeedCard mode and section layout need visual confirmation with real data"
---

# Phase 3: Friends & Shared Deeds Verification Report

**Phase Goal:** User can manage friends (add by tag, remove outgoing, block incoming) and view friends' deeds read-only at `/friends/[tag]` with privacy-safe 403 handling.

**Verified:** 2026-06-04T18:00:00Z  
**Status:** human_needed  
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths (Roadmap + Privacy Contract)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | User sees friends list with tag and displayName on `/friends` | ✓ VERIFIED | `useGetFriendsQuery` in `friends/page.tsx`; `FriendCard` renders `@{friend.tag}` + `displayName`; `UserByTag` type excludes email |
| 2 | User can add friend by tag; duplicate shows 409 with clear message | ✓ VERIFIED | `AddFriendForm` → `useAddFriendMutation` + `normalizeTag`; 409 → `getApiMessage` inline on `tag` field |
| 3 | User can remove outgoing friendship from the list | ✓ VERIFIED | `FriendCard` Remove → `RemoveFriendModal` → `useRemoveFriendMutation(friendshipId)`; LIST invalidation |
| 4 | User can revoke incoming friendship by tag (block flow) | ✓ VERIFIED | `BlockIncomingSection` + `BlockIncomingModal` → `useRevokeIncomingMutation`; Block verb (D-11) |
| 5 | User can open `/friends/[tag]` and see friend's deeds without email or private fields | ✓ VERIFIED | `getFriendDeeds` + `FriendDeedList` + `DeedCard` `readOnly`; no `email` in friends app/components |
| 6 | Non-friend or unknown tag on deeds fetch shows unified 403 error — not user-not-found copy | ✓ VERIFIED | `[tag]/page.tsx` branches `status === 403` → D-15 copy only; never renders API message or 404 user copy for deeds auth |
| 7 | D-12: revoke 404 shows generic block message (anti-enumeration) | ✓ VERIFIED | `BLOCK_NOT_FOUND_MESSAGE` in `BlockIncomingSection.tsx`; modal 404 calls `onNotFound` only |
| 8 | D-15: 403 uses dedicated UI copy with Back to friends | ✓ VERIFIED | `ForbiddenDeedsState` — not raw backend `"You can only view deeds of your friends"` |
| 9 | Friend surfaces never render email | ✓ VERIFIED | `UserByTag` has no email field; grep across `components/friends` and `app/(app)/friends` — no email usage |

**Score:** 9/9 truths verified in codebase (automated). Live API / interaction checks deferred to human verification below.

### Required Artifacts

| Artifact | Expected | Status | Details |
| -------- | ----------- | ------ | ------- |
| `frontend/src/lib/types/friend.ts` | UserByTag, FriendItem | ✓ VERIFIED | 17 lines; no email on `UserByTag` |
| `frontend/src/lib/utils/normalize-tag.ts` | normalizeTag + TAG_PATTERN | ✓ VERIFIED | Mirrors backend trim/lowercase/strip `@` |
| `frontend/src/store/friendsApi.ts` | CRUD + getFriendDeeds | ✓ VERIFIED | 47 lines; all five endpoints wired |
| `frontend/src/store/usersApi.ts` | getUserByTag | ✓ VERIFIED | Imported in `store/index.ts` |
| `frontend/src/components/friends/FriendCard.tsx` | Card + Link + Remove | ✓ VERIFIED | WIRED via `FriendsList` / `friends/page.tsx` |
| `frontend/src/components/friends/FriendsList.tsx` | List + empty state | ✓ VERIFIED | D-18 empty copy present |
| `frontend/src/components/friends/AddFriendForm.tsx` | Collapsed add form | ✓ VERIFIED | D-07/D-20/D-21 inline errors |
| `frontend/src/components/friends/RemoveFriendModal.tsx` | Confirm remove | ✓ VERIFIED | D-08 copy; `role=dialog` |
| `frontend/src/components/friends/BlockIncomingSection.tsx` | Block section | ✓ VERIFIED | D-09 heading; opens modal |
| `frontend/src/components/friends/BlockIncomingModal.tsx` | Confirm block | ✓ VERIFIED | `revokeIncoming`; Block @{tag} |
| `frontend/src/components/friends/FriendDeedList.tsx` | Planned/Done read-only | ✓ VERIFIED | `DeedCard readOnly` per section |
| `frontend/src/app/(app)/friends/page.tsx` | Live friends hub | ✓ VERIFIED | Loading/error/list/forms wired |
| `frontend/src/app/(app)/friends/[tag]/page.tsx` | Friend deeds + 403 | ✓ VERIFIED | normalizeTag; 403 branch; empty state |
| `frontend/src/components/deeds/DeedCard.tsx` | readOnly mode | ✓ VERIFIED | Discriminated union; `DeedCardReadOnlyView` |

### Key Link Verification

| From | To | Via | Status | Details |
| ---- | --- | --- | ------ | ------- |
| `friends/page.tsx` | GET `/api/friends` | `useGetFriendsQuery` | ✓ WIRED | Query + loading/error guards |
| `FriendCard.tsx` | `/friends/[tag]` | `Link href` | ✓ WIRED | `/friends/${friend.tag}` |
| `AddFriendForm.tsx` | POST `/api/friends` | `useAddFriendMutation` | ✓ WIRED | `normalizeTag` on submit |
| `RemoveFriendModal.tsx` | DELETE `/api/friends/:id` | `useRemoveFriendMutation` | ✓ WIRED | `friendshipId` from list item |
| `BlockIncomingModal.tsx` | DELETE `/api/friends/incoming/:tag` | `useRevokeIncomingMutation` | ✓ WIRED | `encodeURIComponent` in API layer |
| `[tag]/page.tsx` | GET `/api/friends/:tag/deeds` | `useGetFriendDeedsQuery` | ✓ WIRED | Skip when tag empty |
| `[tag]/page.tsx` | GET `/api/users/by-tag/:tag` | `useGetUserByTagQuery` | ✓ WIRED | Subtitle only on success path |
| `FriendDeedList.tsx` | `DeedCard` | `readOnly` prop | ✓ WIRED | No edit/delete props passed |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
| -------- | ------------- | ------ | ------------------ | ------ |
| `friends/page.tsx` | `friends` | `useGetFriendsQuery()` | RTK → GET `friends` | ✓ FLOWING |
| `FriendsList` | `friends` prop | Parent query result | Mapped to `FriendCard` | ✓ FLOWING |
| `[tag]/page.tsx` | `deeds` | `useGetFriendDeedsQuery(tag)` | RTK → GET `friends/:tag/deeds` | ✓ FLOWING |
| `[tag]/page.tsx` | `userByTag` | `useGetUserByTagQuery(tag)` | Optional subtitle; not used on 403 branch | ✓ FLOWING |
| `AddFriendForm` | `tag` field | User input → `normalizeTag` → mutation | POST body | ✓ FLOWING |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
| -------- | ------- | ------ | ------ |
| Frontend compiles | `npm run build` in `frontend/` | Exit 0; routes `/friends`, `/friends/[tag]` | ✓ PASS |
| friendsApi endpoints | `rg "getFriends\|addFriend\|removeFriend\|revokeIncoming\|getFriendDeeds" friendsApi.ts` | All five present | ✓ PASS |
| Unified 403 copy | `rg "You can't view" [tag]/page.tsx` | D-15 string; no API message passthrough | ✓ PASS |
| D-12 generic block | `rg "No one with that tag" BlockIncomingSection.tsx` | Constant used for 404 path | ✓ PASS |

### Probe Execution

Step 7c: **SKIPPED** — no phase-declared probes or `scripts/*/tests/probe-*.sh` for this UI integration phase.

### Requirements Coverage

| Requirement | Source Plan(s) | Description | Status | Evidence |
| ----------- | -------------- | ----------- | ------ | -------- |
| FRND-01 | 03-01 | List friends (tag, displayName) | ✓ SATISFIED | `getFriends` + `FriendCard` / `FriendsList` |
| FRND-02 | 03-02 | Add by tag; duplicate 409 | ✓ SATISFIED | `addFriend` + inline 409 in `AddFriendForm` |
| FRND-03 | 03-02 | Remove friendship | ✓ SATISFIED | `removeFriend` + `RemoveFriendModal` |
| FRND-04 | 03-02 | Revoke incoming by tag | ✓ SATISFIED | `revokeIncoming` via block modals |
| FRND-05 | 03-03 | Friend page + deeds read-only | ✓ SATISFIED | `[tag]/page.tsx` + `FriendDeedList` + `readOnly` |
| FRND-06 | 03-03 | Non-friend/unknown error per API privacy | ✓ SATISFIED | Deeds 403 → D-15 only; block 404 → D-12 generic; aligns with backend unified `ForbiddenException` in `friends.service.ts` |

No orphaned FRND IDs: all six requirements appear in plan `requirements` fields and have implementation evidence.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
| ---- | ---- | ------- | -------- | ------ |
| — | — | None in phase-scoped friends paths | — | No TBD/FIXME/stub markers; no `email` on friend surfaces |

### Human Verification Required

Automated verification confirms wiring, types, privacy copy, and build. The following need a running API and browser:

1. **Add friend + 409 inline** — duplicate tag shows field error, not banner.
2. **Remove outgoing with modal** — confirm removes row; Remove does not trigger card navigation.
3. **Block incoming 404** — generic D-12 message only.
4. **Unified 403 on `/friends/[tag]`** — same panel for non-friend vs unknown tag; no enumeration leak.
5. **Read-only friend deeds** — Planned/Done sections; no mutation controls.

### Gaps Summary

No codebase gaps found. Phase goal is **implemented in source**; status is `human_needed` because end-to-end friend management and anti-enumeration UX require live API confirmation (consistent with Phase 2 verification approach).

**Note:** ROADMAP progress table still shows Phase 3 as `2/3` plans — artifact drift only; Plan 03 code (`[tag]/page.tsx`, `FriendDeedList`, `getFriendDeeds`) is present and wired.

---

_Verified: 2026-06-04T18:00:00Z_  
_Verifier: Claude (gsd-verifier)_
