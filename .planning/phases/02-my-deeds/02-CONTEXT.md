# Phase 2: My Deeds - Context

**Gathered:** 2026-06-04
**Status:** Ready for planning

<domain>
## Phase Boundary

Users manage their own deeds end-to-end on `/deeds`: see a list with planned/done status, create deeds with title and optional description, edit fields, mark done (and revert to planned), delete deeds, and see validation errors for empty/whitespace titles. Replaces the Phase 1 stub. Does not include friends' deeds, profile/settings, or full list UX polish (UX-04 — Phase 4).

</domain>

<decisions>
## Implementation Decisions

### List layout & status display
- **D-01:** Each deed renders as a **card** (rounded-xl, border, shadow-sm — consistent with Phase 1 AuthCard surfaces).
- **D-02:** Split list into two sections with headings **"Planned"** and **"Done"**; hide a section entirely when it has zero items.
- **D-03:** Show status as a small text **badge** ("Planned" / "Done") on each card.
- **D-04:** Sort within each section: **API default** (newest first by `createdAt`) — no client sort UI in Phase 2.
- **D-05:** When description exists, show a **1–2 line truncated snippet** on the card (`line-clamp`); full text in edit form only.

### Create & edit flow
- **D-06:** **Inline add form** at the top of `/deeds` (no `/deeds/new` route, no modal for create).
- **D-07:** **Edit inline** — "Edit" on a card expands that card into title + description fields (no separate `/deeds/[id]` page, no edit modal).
- **D-08:** Add form **collapsed by default** ("Add deed" control reveals form); when list is empty, auto-expand or prominently highlight add (planner discretion — see D-21).
- **D-09:** Edit cancel: explicit **"Cancel"** button collapses card without saving.
- **D-10:** Create/edit forms expose **title + optional description only** — status changes via mark-done buttons, not form fields.
- **D-11:** Form button copy: add **"Add deed"** / loading **"Adding…"**; edit **"Save changes"** / **"Saving…"** — no generic Submit/OK/Save (Phase 1 copywriting rule).

### Mark as done
- **D-12:** Primary action on planned cards: **"Mark done"** button → `PATCH` with `status: done`.
- **D-13:** On done cards: **"Mark planned"** button → reversible `PATCH` with `status: planned`.
- **D-14:** **No confirmation** before status change (reversible via D-13).
- **D-15:** During status PATCH: **disable action button** + loading label (e.g. "Marking done…") — no optimistic move in Phase 2.

### Delete flow
- **D-16:** Delete requires a **modal confirmation** (first destructive UX in the app).
- **D-17:** Delete control lives in the card **action row** alongside Edit and Mark done/planned (destructive TextButton style).
- **D-18:** Modal copy — title **"Delete deed?"**, body **"This can't be undone."**, primary **"Delete deed"** (destructive red), secondary **"Keep deed"** (not generic Cancel/OK).
- **D-19:** On successful delete (204): **card removed from list** via cache invalidation — **no success toast/banner**.

### Empty & loading (minimal — UX-04 deferred to Phase 4)
- **D-20:** Initial list fetch: centered **"Loading…"** text (match AuthGuard pattern from Phase 1 UI-SPEC).
- **D-21:** Zero deeds: dedicated **empty state** — heading "No deeds yet" + muted body + prompt toward add form (expand or highlight "Add deed").
- **D-22:** Hide section headings when that section has no items (applies when user has only planned or only done deeds).

### Claude's Discretion
- Auto-expand add form vs highlight button when list is empty (D-08 + D-21).
- Exact card action row layout and spacing; destructive button Tailwind classes.
- RTK Query endpoints (`deedsApi`), tag invalidation, and error mapping (reuse `validation-errors.ts` from Phase 1).
- Simple local modal component (no new UI library).
- Whether to show Edit on done cards only or both sections (default: both).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase scope & requirements
- `.planning/ROADMAP.md` — Phase 2 goal, success criteria, requirement IDs (DEED-01–05)
- `.planning/REQUIREMENTS.md` — Deed requirement definitions and traceability
- `.planning/PROJECT.md` — Stack constraints, API contract rules, no pagination in v1

### Phase 1 context & UI (carry forward)
- `.planning/phases/01-app-shell-authentication/01-CONTEXT.md` — RTK Query, error handling, `/deeds` landing, inline 400 vs banner
- `.planning/phases/01-app-shell-authentication/01-UI-SPEC.md` — Spacing, typography, colors, TextField/PrimaryButton/TextButton, copywriting rules, app shell layout
- `.planning/phases/01-app-shell-authentication/01-PATTERNS.md` — File locations, RTK Query analogs, component patterns

### Backend deeds contract
- `backend/src/deeds/deeds.controller.ts` — `GET/POST /api/deeds`, `GET/PATCH/DELETE /api/deeds/:id`
- `backend/src/deeds/dto/create-deed.dto.ts` — title (required, trim, max 120), description (optional, max 500)
- `backend/src/deeds/dto/update-deed.dto.ts` — partial update; `status` enum `planned` | `done`
- `backend/src/deeds/dto/deed-public.dto.ts` — Response shape for list and mutations
- `backend/src/deeds/schemas/deed.schema.ts` — `DeedStatus`, index `ownerId + createdAt desc`
- `backend/src/common/validators/assert-at-least-one-field.ts` — PATCH must include at least one field

### Frontend integration (Phase 1 deliverables)
- `frontend/src/app/(app)/deeds/page.tsx` — Replace stub with real CRUD
- `frontend/src/store/baseApi.ts` — Extend with deeds endpoints; Bearer + 401 handling
- `frontend/src/components/ui/TextField.tsx` — Form fields + inline errors
- `frontend/src/components/ui/PrimaryButton.tsx` — Form submit buttons
- `frontend/src/components/ui/TextButton.tsx` — Card actions, Keep deed secondary
- `frontend/src/lib/api/validation-errors.ts` — Map NestJS 400 to inline field errors (DEED-05)
- `.planning/codebase/INTEGRATIONS.md` — API groups and CORS

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `frontend/src/app/(app)/deeds/page.tsx` — Stub to replace; stays under `(app)` layout with AppNav + ErrorBanner.
- `frontend/src/app/(app)/layout.tsx` — Protected shell; deeds page inherits max-w-3xl content area.
- `frontend/src/components/ui/TextField.tsx`, `PrimaryButton.tsx`, `TextButton.tsx` — Deed forms and card actions.
- `frontend/src/components/feedback/ErrorBanner.tsx` — Non-field API errors on deeds page.
- `frontend/src/lib/api/validation-errors.ts` — Reuse for empty/whitespace title 400 (DEED-05).

### Established Patterns
- RTK Query on `baseApi` with Bearer from `djosu_access_token` — add `deeds` endpoints + cache tags.
- Inline field errors for 400; global banner for 5xx/network (Phase 1 `uiSlice`).
- Tailwind v4 + Geist; card surfaces per UI-SPEC (no shadcn).
- No toasts on success (auth redirects without toast — same for delete/status).

### Integration Points
- Replace stub copy on `/deeds` with list + add form + sections.
- New types: `frontend/src/lib/types/deed.ts` mirroring `DeedPublicDto`.
- Optional components: `DeedCard`, `DeedList`, `AddDeedForm`, `DeleteDeedModal` under `frontend/src/components/deeds/`.
- `PATCH /api/deeds/:id` for edit fields and status; `DELETE` returns 204.

</code_context>

<specifics>
## Specific Ideas

- First destructive UX in the app — modal sets precedent for account delete in Phase 4.
- Status is reversible (Mark planned) — do not treat done as terminal in UI.
- Phase 4 owns skeleton loaders and rich empty-state polish; Phase 2 still needs a real empty state for DEED-01.
- Forbidden generic labels remain: no Submit, OK, Cancel on deed flows (use specific copy from D-11, D-18).

</specifics>

<deferred>
## Deferred Ideas

- Skeleton card loading placeholders — Phase 4 (UX-04).
- Search, filter, sort UI — out of scope per PROJECT.md (API returns full array).
- Friends' deeds, deed sharing — Phase 3.
- Status dropdown in edit form — rejected; use Mark done / Mark planned buttons only.

</deferred>

---

*Phase: 2-My Deeds*
*Context gathered: 2026-06-04*
