# Phase 4: Profile, Settings & Polish - Context

**Gathered:** 2026-06-04
**Status:** Ready for planning

<domain>
## Phase Boundary

Users manage profile and account on `/settings`: view email (read-only), displayName, and tag; update displayName/tag with inline validation (400) and conflict handling (409); delete account with confirmation and post-delete redirect. List pages `/deeds` and `/friends` receive UX-04 polish — skeleton loading placeholders, improved empty-state copy, and explicit fetch-error states (not empty). Does not include email/password change UI (no backend API), pagination, or polish on `/friends/[tag]` (friend deeds page keeps Phase 3 minimal pattern).

</domain>

<decisions>
## Implementation Decisions

### Settings page layout
- **D-01:** **Single scrollable page** — profile block at top, delete account control at bottom (no separate tabs or routes).
- **D-02:** **Email** shown as **label + plain text** row (view-only), not a disabled `TextField`.
- **D-03:** Page heading **"Settings"** only — no `@tag` or `displayName` subtitle in the header.
- **D-04:** Profile fields live inside a **rounded border card** (consistent with `DeedCard` / friend card surfaces from Phases 2–3).

### Profile editing
- **D-05:** **Always editable** — `displayName` and `tag` fields visible and editable on page load (no "Edit profile" toggle).
- **D-06:** **One "Save changes" button** — `PATCH /api/users/me` sends only changed fields (backend `UpdateProfileDto` supports partial update; respect `assertAtLeastOneField` — disable Save when nothing changed).
- **D-07:** **No tag-change warning** beyond inline validation — no confirmation modal when tag changes.
- **D-08:** **Normalize tag before submit** — strip leading `@`, lowercase (same rules as Phase 3 add-friend / backend `normalizeTag`).
- **D-09:** **400** validation: inline field errors under `displayName` / `tag` (Phase 1 pattern). **409** tag conflict: inline under `tag` with API message. Non-field errors: global banner.

### Delete account
- **D-10:** Confirmation is a **simple modal** only (mirror delete-deed pattern) — no type-tag or checkbox gate.
- **D-11:** Modal copy **brief** — title **"Delete account?"**, body **"This can't be undone."**; primary **"Delete account"** (destructive), secondary **"Keep account"** (not generic Cancel/OK).
- **D-12:** Entry point: **red `TextButton` "Delete account"** at **bottom of page**, below profile card (visual separation via gap).
- **D-13:** On **204**: call **`clearSession`**, redirect to **`/login`** with user-visible message (e.g. query param or banner) that account was deleted — same token cleanup as logout.

### List UX polish (UX-04)
- **D-14:** Replace centered **"Loading…"** on **`/deeds`** and **`/friends`** with **skeleton card rows** (pulse placeholders matching list card layout).
- **D-15:** **Do not** upgrade loading/empty on **`/friends/[tag]`** in this phase — keep Phase 3 minimal pattern there.
- **D-16:** **Empty states**: **copy polish only** — clearer headings/helpers; same layout (no icons or illustrations).
- **D-17:** On list **fetch error** (`isError`): **explicit error state** with message + **retry** — never show empty state when the request failed (fix gap noted in Phase 2 review; apply to deeds and friends lists).

### Claude's Discretion
- Exact empty-state and login redirect message copy (must satisfy D-11/D-13 intent).
- Skeleton count and dimensions (match 2–3 placeholder cards per list).
- `usersApi` endpoints: `getMe`, `updateMe`, `deleteMe`; cache invalidation and **sync `authSlice.user`** after successful profile PATCH (header `@tag` must update).
- Settings page initial load: use `GET /users/me` vs hydrated `authSlice.user` (prefer fresh fetch or refetch on mount).
- Save button disabled state when form pristine or while mutation in flight.
- Reusable `SkeletonCard` vs inline pulse divs in page files.
- Retry implementation (`refetch` from RTK Query vs remount).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase scope & requirements
- `.planning/ROADMAP.md` — Phase 4 goal, success criteria, requirement IDs (PROF-01–03, UX-04)
- `.planning/REQUIREMENTS.md` — Profile/settings and UX-04 definitions; out-of-scope email/password change
- `.planning/PROJECT.md` — API contract rules, Bearer JWT, `UserPublicDto` shape

### Prior phase context & UI (carry forward)
- `.planning/phases/01-app-shell-authentication/01-CONTEXT.md` — RTK Query, `clearSession`, inline 400 vs banner, `/settings` nav
- `.planning/phases/01-app-shell-authentication/01-UI-SPEC.md` — Spacing, typography, form components, destructive styling, copywriting rules
- `.planning/phases/01-app-shell-authentication/01-PATTERNS.md` — File locations, RTK Query inject pattern
- `.planning/phases/02-my-deeds/02-CONTEXT.md` — Card layout, delete modal pattern, minimal loading baseline
- `.planning/phases/02-my-deeds/02-REVIEW.md` — List fetch must not masquerade as empty (apply in UX-04)
- `.planning/phases/02-my-deeds/02-UI-SPEC.md` — Card and modal specs
- `.planning/phases/03-friends-shared-deeds/03-CONTEXT.md` — Tag normalize-before-submit, inline 409/404, friend list patterns

### Backend users contract
- `backend/src/users/users.controller.ts` — `GET/PATCH/DELETE /api/users/me`, `GET /api/users/by-tag/:tag`
- `backend/src/users/dto/update-profile.dto.ts` — Optional `displayName`, `tag`; trim/normalize transforms
- `backend/src/common/dto/user-public.dto.ts` — Response shape (`id`, `email`, `displayName`, `tag`)
- `backend/src/common/validators/assert-at-least-one-field.ts` — PATCH must include at least one field
- `backend/src/common/validators/is-tag.ts` — Tag format rules
- `backend/docs/DECISIONS.md` — JWT, tag rules, account deletion cascade

### Frontend integration (existing)
- `frontend/src/app/(app)/settings/page.tsx` — Replace stub with profile + delete UI
- `frontend/src/store/usersApi.ts` — Extend beyond `getUserByTag` (add me endpoints)
- `frontend/src/store/authSlice.ts` — `setUser` / `clearSession` after profile update or delete
- `frontend/src/store/baseApi.ts` — Bearer + 401 handling
- `frontend/src/app/(app)/deeds/page.tsx` — UX-04 skeleton + error/empty polish
- `frontend/src/app/(app)/friends/page.tsx` — UX-04 skeleton + error/empty polish
- `frontend/src/components/ui/TextField.tsx` — Editable fields + inline errors
- `frontend/src/components/deeds/DeleteDeedModal.tsx` — Modal pattern analog for delete account

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `TextField`, `PrimaryButton`, `TextButton` — profile form and delete trigger
- `DeleteDeedModal` / `RemoveFriendModal` — confirmation modal structure and destructive button styling
- `usersApi` + `baseApi` — extend with `getMe`, `updateMe`, `deleteMe` mutations
- `authSlice.setUser` / `clearSession` — post-PATCH profile sync and post-delete cleanup
- `DeedCard` / friend card row styling — skeleton dimensions and card wrapper for settings profile block

### Established Patterns
- RTK Query inject endpoints; inline 400/409 on forms; banner for non-field errors
- Destructive flows: modal confirm, no success toast on delete (deeds precedent)
- List pages: `isLoading` / `isError` / empty branching — upgrade loading to skeletons and fix error vs empty conflation

### Integration Points
- `/settings` under `(app)` layout — already protected; nav link exists
- Header `@tag` from `authSlice.user` — must update after tag PATCH
- `GET /users/me` on app hydrate (Phase 1) — align settings data source with existing session flow

</code_context>

<specifics>
## Specific Ideas

- Settings layout mirrors a simple account page: one card for profile, delete separated at bottom (not a labeled "danger zone" section — user chose single-page flow without extra section chrome).
- Delete account should feel as lightweight as delete deed — brief modal, no typed confirmation.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 4-Profile, Settings & Polish*
*Context gathered: 2026-06-04*
