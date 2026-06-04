---
phase: 2
slug: my-deeds
status: approved
shadcn_initialized: false
preset: none
created: 2026-06-04
reviewed_at: 2026-06-04
---

# Phase 2 — UI Design Contract

> Visual and interaction contract for My Deeds. Inherits Phase 1 tokens (`01-UI-SPEC.md`) and implements locked decisions in `02-CONTEXT.md`.

---

## Design System

| Property | Value |
|----------|-------|
| Tool | none (Tailwind utility-first; no shadcn) |
| Preset | not applicable |
| Component library | none — extend Phase 1 local components |
| Icon library | inline SVG (Heroicons-style outline, 20px) — same as Phase 1 |
| Font | Geist Sans (`layout.tsx`); Geist Mono not used on deeds UI |

**Rationale:** Phase 1 established Tailwind v4 + Geist + local `TextField` / `PrimaryButton` / `TextButton`. Phase 2 adds deed-specific surfaces (cards, modal) without new design-system dependencies.

**Phase 1 carry-forward:** Spacing scale, typography roles, 60/30/10 color contract, focus rings, and forbidden generic labels remain binding unless overridden below.

---

## Spacing Scale

Inherited from Phase 1 (multiples of 4):

| Token | Value | Phase 2 usage |
|-------|-------|---------------|
| xs | 4px | Badge padding-x, action row icon gaps |
| sm | 8px | Card internal field gaps, badge margin-top |
| md | 16px | Card padding, section heading margin-bottom, form field stack |
| lg | 24px | Gap between page sections (add block → list), modal padding |
| xl | 32px | Page title to first section |
| 2xl | 48px | — not used in Phase 2 |
| 3xl | 64px | — reserved |

**Phase 2 additions:**

| Token | Value | Usage |
|-------|-------|-------|
| card-pad | 16px (`p-4`) | Deed card interior |
| section-gap | 24px (`gap-6`) | Between "Planned" and "Done" sections |
| card-stack | 16px (`gap-4`) | Vertical stack of deed cards within a section |

Exceptions:
- **44px** min touch target on primary buttons, card action text buttons, and modal primary/secondary actions
- Modal max-width **400px** (`max-w-[400px]`) — not on 4px grid; justified for readable confirm copy

---

## Typography

Inherited from Phase 1:

| Role | Size | Weight | Line Height | Tailwind |
|------|------|--------|-------------|----------|
| Body | 16px | 400 | 1.5 | `text-base font-normal leading-normal` |
| Label | 14px | 400 | 1.4 | `text-sm font-normal leading-snug` |
| Heading | 20px | 600 | 1.2 | `text-xl font-semibold leading-tight` |
| Display | 28px | 600 | 1.2 | `text-[28px] font-semibold leading-tight` |

**Phase 2 role mapping (no new sizes — reuse Phase 1 four-size scale):**

| Role | Maps to | Tailwind | Usage |
|------|---------|----------|-------|
| Card title | Body + semibold | `text-base font-semibold leading-normal` | Deed title on card (view mode) |
| Section heading | Label + semibold | `text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400` | "Planned" / "Done" section labels |
| Status badge | Label + semibold | `text-sm font-semibold` + badge padding | "Planned" / "Done" pill on card |
| Modal title | Heading | `text-xl font-semibold leading-tight` | Delete confirmation |
| Muted helper | Label | `text-sm font-normal text-zinc-500 dark:text-zinc-400` | Description snippet, empty state body, optional field hint |

**Active sizes in Phase 2:** 14px (label), 16px (body), 20px (heading) — Display (28px) not used on `/deeds`.

**Weight rule:** Only **400** and **600** (unchanged).

---

## Color

Inherited from Phase 1:

| Role | Light | Dark | Usage |
|------|-------|------|-------|
| Dominant (60%) | zinc-50 | zinc-950 | Page background (via app layout) |
| Secondary (30%) | white | zinc-900 | Deed cards, add-form surface, modal panel |
| Accent (10%) | zinc-900 | zinc-50 | Add deed reveal control (TextButton with accent underline optional), primary form CTAs, focus rings |
| Muted text | zinc-500 | zinc-400 | Snippets, empty state, section headings |
| Border | zinc-200 | zinc-700 | Cards, modal, inputs |
| Destructive | red-600 | red-400 | Delete control, modal confirm button, field errors |
| Error banner bg | red-50 | red-950/40 | Global API errors (unchanged) |

**Status badges (semantic, not accent):**

| Status | Light classes | Dark classes |
|--------|---------------|--------------|
| Planned | `bg-zinc-100 text-zinc-700` | `bg-zinc-800 text-zinc-300` |
| Done | `bg-emerald-50 text-emerald-800` | `bg-emerald-950/50 text-emerald-300` |

**Destructive button (modal primary only):**
`bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-500` — min-h-11, rounded-lg, full-width on mobile stack.

**Accent reserved for (Phase 2):**
- Primary form submit: "Add deed", "Save changes"
- Focus rings on inputs and buttons
- Optional: "Add deed" reveal link may use `text-zinc-900 dark:text-zinc-50 font-semibold` (not filled accent — text emphasis only)

**NOT accent:** Mark done / Mark planned / Edit / Delete / Keep deed — use TextButton or outlined secondary styles.

---

## Visual Hierarchy

### `/deeds` (primary screen)

| Priority | Element | Notes |
|----------|---------|-------|
| 1st (focal) | Add-deed block OR first section with cards | When list empty: empty state + expanded add form draw eye; when populated: collapsed "Add deed" control then Planned section |
| 2nd | Deed cards in active sections | Card title + status badge |
| 3rd | Section headings "Planned" / "Done" | Uppercase muted labels — subordinate to cards |
| 4th | Page title "My Deeds" | `text-xl` heading, top of content |

**Page layout (within `max-w-3xl` main):**

```
┌─────────────────────────────────────────────┐
│ My Deeds                          (Heading) │
├─────────────────────────────────────────────┤
│ [Add deed] or expanded add form             │
├─────────────────────────────────────────────┤
│ PLANNED (section — hidden if 0 items)       │
│ ┌─ Deed card ─────────────────────────────┐ │
│ │ Title          [Planned]                │ │
│ │ Snippet…                                │ │
│ │ Edit | Mark done | Delete               │ │
│ └─────────────────────────────────────────┘ │
├─────────────────────────────────────────────┤
│ DONE (section — hidden if 0 items)          │
│ ┌─ Deed card ─────────────────────────────┐ │
│ │ …                  [Done]               │ │
│ │ Edit | Mark planned | Delete            │ │
│ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

**Empty list (zero deeds):** Centered block below page title — heading "No deeds yet", muted body, add form **auto-expanded** (D-08 + D-21 discretion).

**Loading:** Full content area replaced by centered `text-zinc-500 dark:text-zinc-400` **"Loading…"** (match AuthGuard).

---

## Component Inventory (Phase 2)

| Component | Location (suggested) | Purpose |
|-----------|------------------------|---------|
| `DeedsPage` | `frontend/src/app/(app)/deeds/page.tsx` | Page shell, RTK Query, section split |
| `AddDeedForm` | `frontend/src/components/deeds/AddDeedForm.tsx` | Collapsible create form at top |
| `DeedCard` | `frontend/src/components/deeds/DeedCard.tsx` | View / inline-edit / actions |
| `DeedList` | `frontend/src/components/deeds/DeedList.tsx` | Sections + empty/loading delegation |
| `DeleteDeedModal` | `frontend/src/components/deeds/DeleteDeedModal.tsx` | First destructive modal in app |
| `TextAreaField` | `frontend/src/components/ui/TextAreaField.tsx` | Optional description (mirror TextField styling) |
| `StatusBadge` | `frontend/src/components/deeds/StatusBadge.tsx` | Planned / Done pill |
| Reuse `TextField` | `frontend/src/components/ui/TextField.tsx` | Title field |
| Reuse `PrimaryButton` | `frontend/src/components/ui/PrimaryButton.tsx` | Add / Save |
| Reuse `TextButton` | `frontend/src/components/ui/TextButton.tsx` | Edit, Mark done/planned, Delete, Keep deed, Add deed reveal |

### Deed card (view mode)

- Surface: `rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900 p-4`
- Title row: flex justify-between gap-2 — title (semibold body) + `StatusBadge`
- Description: if present, `text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2` (1–2 lines)
- Action row: `flex flex-wrap items-center gap-2 pt-3` — TextButtons left-to-right: **Edit**, status action, **Delete** (destructive)

### Deed card (edit mode)

- Same card border; inner form `flex flex-col gap-4`
- Fields: Title (required), Description (optional) — use `TextAreaField` with `rows={3}`, max 500 chars helper optional: "Optional, up to 500 characters"
- Actions: `PrimaryButton` "Save changes" + `TextButton` "Cancel" (collapses without save)

### Add deed form

- Collapsed: single `TextButton` **"Add deed"** below page title
- Expanded: same card surface as deed card, fields Title + Description, `PrimaryButton` **"Add deed"**, `TextButton` **"Cancel"** collapses (clears draft optional — planner discretion)
- **Empty list:** skip collapsed state — form expanded by default

### Delete modal

- Overlay: `fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4`
- Panel: `w-full max-w-[400px] rounded-xl border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-700 dark:bg-zinc-900`
- Focus trap + `role="dialog"` `aria-modal="true"` `aria-labelledby` on title
- Button stack: `flex flex-col-reverse gap-3 sm:flex-row sm:justify-end` — secondary **Keep deed** (TextButton or outlined), primary **Delete deed** (destructive red)
- Close on overlay click: **no** (explicit Keep deed or Escape only) — reduces accidental dismiss before choice

---

## Screen Specifications

### `/deeds`

| Element | Spec |
|---------|------|
| Page title | Heading: **"My Deeds"** |
| Add control | Collapsed **"Add deed"** TextButton; expands inline form |
| Add form fields | Title (label "Title"), Description (label "Description", optional) |
| Add primary CTA | **"Add deed"** / loading **"Adding…"** |
| Add cancel | **"Cancel"** collapses add form — allowed here (not generic modal dismiss; specific to add flow) |
| Sections | **"Planned"** then **"Done"** — hide section entirely when count 0 |
| Card sort | API order (newest `createdAt` first) — no sort UI |
| Planned actions | Edit, **Mark done**, Delete |
| Done actions | Edit, **Mark planned**, Delete |
| Status PATCH loading | Disable clicked button; label **"Marking done…"** or **"Marking planned…"** |
| Delete flow | Delete → modal → **Delete deed** / **Keep deed** |
| Field validation | Inline under title on 400 (DEED-05); reuse `validation-errors.ts` |
| Non-field errors | ErrorBanner (5xx, network) |
| Success | No toast; list updates via RTK cache invalidation |

### Field constraints (API-aligned)

| Field | Max length | Required |
|-------|------------|----------|
| Title | 120 | Yes (non-whitespace) |
| Description | 500 | No |

---

## Copywriting Contract

| Element | Copy |
|---------|------|
| Page heading | My Deeds |
| Add reveal | Add deed |
| Add primary CTA | Add deed |
| Add loading | Adding… |
| Add cancel | Cancel |
| Edit reveal | Edit |
| Edit save | Save changes |
| Edit loading | Saving… |
| Edit cancel | Cancel |
| Title label | Title |
| Description label | Description |
| Description helper (optional) | Optional, up to 500 characters |
| Section — planned | Planned |
| Section — done | Done |
| Status badge — planned | Planned |
| Status badge — done | Done |
| Mark status (planned card) | Mark done |
| Mark status loading (→ done) | Marking done… |
| Mark status (done card) | Mark planned |
| Mark status loading (→ planned) | Marking planned… |
| Delete control | Delete |
| Modal title | Delete deed? |
| Modal body | This can't be undone. |
| Modal confirm | Delete deed |
| Modal confirm loading | Deleting… |
| Modal dismiss | Keep deed |
| Empty heading | No deeds yet |
| Empty body | Add your first good deed below. |
| Loading | Loading… |
| Title validation (client/API) | Use API message or fallback: **"Title is required"** |
| Generic API error banner | {API message} or Phase 1 fallback |

**Forbidden labels:** Submit, OK, Click Here, Save (use **Save changes**), generic **Cancel** on delete modal (use **Keep deed**). **Cancel** is permitted on add/edit form collapse only (D-09).

---

## Interaction States

| State | Behavior |
|-------|----------|
| Initial load | Centered "Loading…"; no cards or forms |
| Empty list | Empty state copy + add form expanded |
| Add collapsed | Only "Add deed" control visible |
| Add expanded | Form visible; submit disabled + "Adding…" during POST |
| Card view | Title, badge, snippet, action row |
| Card editing | Form replaces view content; Save/Cancel |
| Status change | Only triggering button disabled + loading label; card stays in current section until refetch |
| Delete open | Modal blocks interaction; focus trapped |
| Delete submitting | Disable both modal buttons; confirm shows "Deleting…" |
| Delete success | Modal closes; card removed from list (no toast) |
| Section visibility | Hide "Planned" or "Done" heading+block when that section has 0 deeds |
| 400 title error | Red border + inline under title field |
| 401 | Existing baseApi → login (Phase 1) |

---

## Accessibility

- All form fields: `<label htmlFor>` (TextField / TextAreaField)
- Card actions: text labels (no icon-only destructive)
- Delete modal: `role="dialog"`, `aria-modal="true"`, labelled title
- Modal buttons: min 44px height
- Focus: accent ring on inputs/buttons; on modal open, focus first focusable (Keep deed or title)
- Escape: closes delete modal without deleting (same as Keep deed)
- Status badges: decorative; status also conveyed by section placement and action button text
- `line-clamp` snippet: full description available in edit form

---

## Registry Safety

| Registry | Blocks Used | Safety Gate |
|----------|-------------|-------------|
| — | — | not applicable (no shadcn, no third-party registries) |

---

## CONTEXT.md Compliance

| Decision | UI-SPEC mapping |
|----------|-----------------|
| D-01 Cards | Deed card surface spec |
| D-02 Two sections | Section headings + layout |
| D-03 Text badges | StatusBadge component |
| D-04 API sort | Screen spec — no client sort |
| D-05 Description snippet | `line-clamp-2` on card |
| D-06 Inline add top | AddDeedForm placement |
| D-07 Inline edit | DeedCard edit mode |
| D-08 Collapsed add default | Add reveal; empty → auto-expand |
| D-09 Edit cancel | "Cancel" on edit form |
| D-10 Title + description only | Form fields spec |
| D-11 Button copy | Copywriting contract |
| D-12–D-15 Mark done/planned | Action row + loading labels |
| D-16–D-19 Delete modal | DeleteDeedModal + copy |
| D-20 Loading | Interaction state |
| D-21 Empty state | Copy + auto-expand add |
| D-22 Hide empty sections | Section visibility rule |

---

## Checker Sign-Off

- [x] Dimension 1 Copywriting: PASS
- [x] Dimension 2 Visuals: PASS
- [x] Dimension 3 Color: PASS
- [x] Dimension 4 Typography: PASS
- [x] Dimension 5 Spacing: PASS
- [x] Dimension 6 Registry Safety: PASS

**Approval:** approved 2026-06-04
