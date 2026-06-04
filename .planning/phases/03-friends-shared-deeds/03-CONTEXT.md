# Phase 3: Friends & Shared Deeds - Context

**Gathered:** 2026-06-04
**Status:** Ready for planning

<domain>
## Phase Boundary

Users manage one-way friendships and view friends' deeds by tag: list friends (tag, displayName), add by tag (409 on duplicate, 404 on unknown tag), remove outgoing friendships, revoke incoming access by tag, and open `/friends/[tag]` for read-only deed lists. No email or private fields on friend surfaces. API privacy rules apply (403 unified for non-friend/unknown tag on deed reads; 404 on add for unknown tag). Does not include profile/settings (Phase 4) or full list UX polish / skeleton loaders (UX-04 — Phase 4).

</domain>

<decisions>
## Implementation Decisions

### One-way friendship messaging
- **D-01:** Show a **brief intro blurb** at the top of `/friends` explaining directed friendships, plus a **one-line hint** near the add-friend form.
- **D-02:** Use **plain, direct** copy — e.g. "Adding someone lets you see their deeds. They won't see yours unless they add you."
- **D-03:** On each outgoing friend row, show a subtle **"You follow"** label so users don't assume mutual friendship.
- **D-04:** On add-by-tag, **normalize input** before submit (strip leading `@`, lowercase via same rules as backend `normalizeTag`); show **inline field error** for 400 self-add and other field-level failures.

### Friends list & add-by-tag
- **D-05:** Friends render as **card rows** (rounded border — consistent with Phase 2 `DeedCard` surfaces).
- **D-06:** **@tag primary**, `displayName` **secondary muted** on each card.
- **D-07:** **Inline add form at top** — collapsed by default; **"Add friend"** control reveals tag field (mirror Phase 2 add-deed pattern).
- **D-08:** **Remove outgoing** friendship (`DELETE /friends/:friendshipId`) requires a **confirmation modal** (first destructive action on friends flows).

### Revoke incoming access (no incoming-list API)
- **D-09:** **Separate section** on `/friends` below the friends list — **"Block someone who added you"** with tag input (backend: `DELETE /friends/incoming/:tag`).
- **D-10:** Block action uses a **confirmation modal** before submit — e.g. "Block @tag? They won't see your deeds if they added you."
- **D-11:** User-facing verb: **"Block"** (button/modal), not "Revoke" or "Remove follower".
- **D-12:** On revoke 404, show **generic inline** under the field: **"No one with that tag has added you"** — do not distinguish unknown tag vs no incoming friendship (matches API anti-enumeration).

### Friend deeds page (`/friends/[tag]`)
- **D-13:** **Click entire friend card** on `/friends` to navigate to `/friends/[tag]`.
- **D-14:** Friend deeds **mirror My Deeds layout** — **Planned** / **Done** sections, **read-only** cards (no edit, delete, or status-change controls).
- **D-15:** On 403 (not friend or unknown tag — same API message), show a **dedicated error state** on the page: **"You can't view this user's deeds"** with a link back to `/friends` (do not redirect away silently).
- **D-16:** Page header: **"@tag's deeds"** with **`displayName` subtitle**.

### Empty & loading (minimal — UX-04 deferred to Phase 4)
- **D-17:** Initial friends list fetch: centered **"Loading…"** (match `/deeds` and Phase 1 UI-SPEC).
- **D-18:** Zero friends: empty state with heading + prompt toward add form (expand or highlight "Add friend" — planner discretion).
- **D-19:** Friend with zero deeds: empty state on `/friends/[tag]` (e.g. "No deeds yet" — read-only, no add form).

### API error handling (friends-specific)
- **D-20:** Add friend **409** ("Already friends"): **inline** under tag field with API message.
- **D-21:** Add friend **404** ("User not found"): **inline** under tag field.
- **D-22:** Friend deeds fetch errors other than 403: **banner or inline page message** per Phase 1 pattern; **403** uses D-15 dedicated state only.

### Claude's Discretion
- Exact intro/hint copy wording (must satisfy D-02 meaning).
- "You follow" badge placement and Tailwind classes on friend cards.
- Remove-friend and block modals: button labels (avoid generic Cancel/OK — use "Keep friend" / "Remove friend", "Keep" / "Block @tag" or similar).
- RTK Query `friendsApi` endpoints, cache tags, and invalidation after add/remove/block.
- Whether friend deeds page loads `displayName` via `GET /users/by-tag/:tag` or passes from list navigation (prefer fetch for direct URL visits).
- Read-only deed card component: reuse `DeedCard` with `readOnly` prop vs separate `FriendDeedCard`.
- Auto-expand add form when friends list is empty (mirror Phase 2 D-08 discretion).
- List fetch failure UX (Phase 2 review noted deeds masquerading as empty — friends list should show explicit error, not empty state).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase scope & requirements
- `.planning/ROADMAP.md` — Phase 3 goal, success criteria, requirement IDs (FRND-01–06)
- `.planning/REQUIREMENTS.md` — Friends requirement definitions; one-way model out-of-scope note
- `.planning/PROJECT.md` — API contract rules, privacy, no pagination in v1

### Prior phase context & UI (carry forward)
- `.planning/phases/01-app-shell-authentication/01-CONTEXT.md` — RTK Query, Bearer token, inline 400 vs banner, `/friends` nav stub
- `.planning/phases/01-app-shell-authentication/01-UI-SPEC.md` — Spacing, typography, colors, form components, copywriting rules
- `.planning/phases/01-app-shell-authentication/01-PATTERNS.md` — File locations, RTK Query analogs
- `.planning/phases/02-my-deeds/02-CONTEXT.md` — Card layout, sections, modals, empty/loading minimal pattern
- `.planning/phases/02-my-deeds/02-UI-SPEC.md` — Deed card/modal specs to mirror for read-only friend deeds
- `.planning/phases/02-my-deeds/02-PATTERNS.md` — `deedsApi` inject pattern, component analogs
- `.planning/phases/02-my-deeds/02-REVIEW.md` — List fetch must not masquerade as empty (apply to friends list)

### Backend friends contract
- `backend/docs/DECISIONS.md` — §2 One-way friendship, revoke semantics, 403 anti-enumeration on deed reads
- `backend/src/friends/friends.controller.ts` — `POST/GET/DELETE /api/friends`, `DELETE incoming/:tag`, `GET :tag/deeds`
- `backend/src/friends/dto/friend-item.dto.ts` — `{ _id, friend: UserByTagDto, createdAt }`
- `backend/src/friends/dto/add-friend.dto.ts` — Body `{ tag }` with `@IsTag()`
- `backend/src/common/dto/user-by-tag.dto.ts` — Public friend shape (no email)
- `backend/src/common/validators/tag.constants.ts` — Tag pattern for client-side normalize hint
- `backend/test/friends.e2e-spec.ts` — Status codes: 400 self, 404 add unknown, 409 duplicate, 403 deeds, 404 revoke

### Frontend integration
- `frontend/src/components/layout/AppNav.tsx` — `/friends` nav link (route must be implemented)
- `frontend/src/store/baseApi.ts` — Extend tagTypes for friends/deeds-by-friend
- `frontend/src/store/deedsApi.ts` — Section/card patterns to reuse read-only
- `frontend/src/components/deeds/DeedCard.tsx`, `DeedList.tsx`, `DeleteDeedModal.tsx` — Layout/modal precedents
- `frontend/src/lib/api/validation-errors.ts` — Inline field errors for add/block forms
- `.planning/codebase/INTEGRATIONS.md` — Friends API group

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `frontend/src/app/(app)/deeds/page.tsx` — Page structure, loading/error/empty patterns for `/friends`.
- `frontend/src/components/deeds/DeedCard.tsx`, `DeedList.tsx`, `StatusBadge.tsx` — Read-only friend deed display (strip actions).
- `frontend/src/components/deeds/DeleteDeedModal.tsx` — Modal pattern for remove-friend and block confirmations.
- `frontend/src/components/ui/TextField.tsx`, `PrimaryButton.tsx`, `TextButton.tsx` — Add/block forms and card actions.
- `frontend/src/components/layout/AppNav.tsx` — Friends nav already wired; needs `(app)/friends` routes.

### Established Patterns
- RTK Query on `baseApi` with Bearer + 401 session clear — add `friendsApi` endpoints.
- Inline field errors for 400/404/409 on forms; global banner for 5xx/network.
- Card surfaces per Phase 1/2 UI-SPEC; no shadcn; specific button copy (no generic Submit/OK/Cancel).
- One-way model: list endpoint returns **outgoing** friendships only; **no** incoming list API — block-by-tag is explicit user action (D-09).

### Integration Points
- New routes: `frontend/src/app/(app)/friends/page.tsx`, `frontend/src/app/(app)/friends/[tag]/page.tsx` under protected `(app)` layout.
- New store: `frontend/src/store/friendsApi.ts` (list, add, remove, revokeIncoming, getFriendDeeds).
- New types: `frontend/src/lib/types/friend.ts` mirroring `FriendItemDto` / `UserByTagDto`.
- Backend `GET /api/friends/:tag/deeds` returns `DeedPublicDto[]` — same shape as own deeds; read-only UI.

</code_context>

<specifics>
## Specific Ideas

- Directed friendship is a **product education** problem — intro + "You follow" badge prevent mutual-friends assumption.
- Block-by-tag is awkward without incoming list — dedicated section makes FRND-04 discoverable without Settings deferral.
- Friend deeds 403 must **not** leak whether tag exists — use API message or unified copy per D-15, never "user not found" for 403.
- First friends destructive UX: remove + block modals set precedent before account delete (Phase 4).

</specifics>

<deferred>
## Deferred Ideas

- Incoming friends list / notifications — no backend endpoint; would need API change (out of v1 scope).
- Mutual friendship / accept flow — rejected in `REQUIREMENTS.md` Out of Scope.
- Skeleton loaders and rich empty-state polish — Phase 4 (UX-04).
- Search, filter, sort on friends or friend deeds — out of scope per PROJECT.md.
- Settings-page placement for block-by-tag — rejected in favor of D-09 friends section.

</deferred>

---

*Phase: 3-Friends & Shared Deeds*
*Context gathered: 2026-06-04*
