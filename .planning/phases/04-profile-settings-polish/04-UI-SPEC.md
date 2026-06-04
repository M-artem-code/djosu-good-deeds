---
phase: 4
slug: profile-settings-polish
status: approved
shadcn_initialized: false
preset: none
created: 2026-06-04
reviewed_at: 2026-06-04
---

# Phase 4 — UI Design Contract

> Visual and interaction contract for Profile, Settings & Polish. Inherits Phase 1 tokens (`01-UI-SPEC.md`), Phase 2 deed surfaces (`02-UI-SPEC.md`), and Phase 3 friend/list patterns (`03-UI-SPEC.md`). Implements locked decisions in `04-CONTEXT.md`.

---

## Design System

| Property | Value |
|----------|-------|
| Tool | none (Tailwind utility-first; no shadcn) |
| Preset | not applicable |
| Component library | none — extend Phase 1 local components |
| Icon library | inline SVG (Heroicons-style outline, 20px) — same as Phase 1 |
| Font | Geist Sans (`layout.tsx`) |

**Rationale:** Settings reuses profile card geometry, modals, and form primitives from Phases 1–3. UX-04 adds skeleton placeholders only — no new dependencies.

**Phase 1–3 carry-forward:** Spacing scale, typography roles, 60/30/10 color contract, focus rings, forbidden generic labels, and modal patterns remain binding unless overridden below.

---

## Spacing Scale

Inherited from Phase 1 (multiples of 4):

| Token | Value | Phase 4 usage |
|-------|-------|---------------|
| xs | 4px | Skeleton pulse bar gaps |
| sm | 8px | Profile field stack inside card |
| md | 16px | Profile card padding (`p-4`), skeleton card padding |
| lg | 24px | Gap between page title → profile card → delete control |
| xl | 32px | — not used on settings |
| 2xl | 48px | — not used |

**Phase 4 additions:**

| Token | Value | Usage |
|-------|-------|-------|
| card-pad | 16px (`p-4`) | Settings profile card (match DeedCard / FriendCard) |
| profile-stack | 16px (`gap-4`) | Vertical stack: email row, displayName, tag, Save button |
| skeleton-stack | 16px (`gap-4`) | Stack of 2–3 skeleton cards on list pages |
| page-bottom-gap | 32px (`gap-8`) | Space between profile card and delete `TextButton` |

Exceptions:
- **44px** min touch target on Save, modal actions, retry button
- Modal max-width **400px** (`max-w-[400px]`) — delete account confirmation
- Read-only email row: min height **44px** for alignment with fields

---

## Typography

Inherited from Phase 1 four-size scale (14 / 16 / 20 / 28 px):

| Role | Maps to | Tailwind | Usage |
|------|---------|----------|-------|
| Page title | Heading | `text-xl font-semibold leading-tight` | `/settings` — "Settings" (D-03) |
| Email label | Label | `text-sm font-normal text-zinc-500 dark:text-zinc-400` | "Email" above read-only value (D-02) |
| Email value | Body | `text-base font-normal leading-normal text-zinc-900 dark:text-zinc-50` | Plain text email (not TextField) |
| Field label | Label | `text-sm font-normal` | displayName, tag (TextField labels) |
| Field error | Label | `text-sm font-normal text-red-600 dark:text-red-400` | 400/409 inline (D-09) |
| Save CTA | Body | `text-base font-normal` | PrimaryButton "Save changes" |
| Delete trigger | Body | `text-base font-normal text-red-600 dark:text-red-400` | TextButton "Delete account" (D-12) |
| Modal title | Heading | `text-xl font-semibold leading-tight` | Delete account? (D-11) |
| Modal body | Label | `text-sm font-normal text-zinc-500 dark:text-zinc-400` | This can't be undone. |
| Skeleton bar | — | `h-4` / `h-5` rounded bg-zinc-200 dark:bg-zinc-700 animate-pulse` | Placeholder lines inside skeleton cards |
| Empty state heading | Body + semibold | `text-base font-semibold` | Polished copy on deeds/friends |
| Empty state body | Label | `text-sm font-normal text-zinc-500 dark:text-zinc-400` | Helper under heading (D-16) |
| Error list heading | Body + semibold | `text-base font-semibold` | Fetch failed — not empty |
| Retry control | Body | `text-base font-normal` | TextButton "Try again" |

**Active sizes in Phase 4:** 14px, 16px, 20px — Display (28px) not used on `/settings`; friends page keeps 28px title from Phase 3.

**Weight rule:** Only **400** and **600**.

---

## Color

Inherited from Phase 1:

| Role | Light | Dark | Usage |
|------|-------|------|-------|
| Dominant (60%) | zinc-50 | zinc-950 | Page background |
| Secondary (30%) | white | zinc-900 | Profile card, modals, skeleton cards |
| Accent (10%) | zinc-900 | zinc-50 | Save button, focus rings |
| Muted text | zinc-500 | zinc-400 | Email label, empty helpers |
| Border | zinc-200 | zinc-700 | Profile card, skeleton cards |
| Destructive | red-600 | red-400 | Delete account trigger, modal confirm, field errors |
| Skeleton fill | zinc-200 | zinc-700 | Pulse placeholders (D-14) |
| Error banner bg | red-50 | red-950/40 | Non-field PATCH errors |

---

## Components

### Settings profile card (D-01, D-04, D-05)

- Single `rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900`
- **Email:** label + plain text row — no disabled input
- **displayName** and **tag:** always-visible `TextField` components
- **Save changes:** `PrimaryButton` below fields; disabled when pristine or `isLoading`
- No section subtitle in page header (D-03)

### Delete account (D-10–D-12)

- `TextButton` "Delete account" below card with `gap-8` separation — red text, not filled button
- Modal mirrors `DeleteDeedModal`: title **Delete account?**, body **This can't be undone.**, primary **Delete account**, secondary **Keep account**
- No typed confirmation gate

### Skeleton list loading (D-14)

- Replace centered "Loading…" on `/deeds` and `/friends` only
- Render **3** skeleton rows matching card layout:
  - Deeds: title bar + optional description bars inside bordered card
  - Friends: tag bar + displayName bar inside bordered card
- Use `animate-pulse` on zinc-200/zinc-700 blocks

### List fetch error (D-17)

- When `isError`: centered block with semibold heading + helper + **Try again** `TextButton`
- Must **not** render empty-state copy or add forms as if data loaded
- Retry calls RTK Query `refetch()` from the list query hook

### Empty state copy (D-16)

- Same layout as Phases 2–3 (no icons)
- Deeds: heading **No deeds yet**; helper **Add your first good deed below.**
- Friends: heading **No friends yet**; helper **Add someone by tag to see their deeds.**

---

## Copywriting

| Surface | Required copy |
|---------|----------------|
| Page title | Settings |
| Save idle | Save changes |
| Save loading | Saving… |
| Delete trigger | Delete account |
| Modal title | Delete account? |
| Modal body | This can't be undone. |
| Modal confirm | Delete account |
| Modal confirm loading | Deleting… |
| Modal cancel | Keep account |
| Post-delete redirect | `/login?reason=account_deleted` + dismissible info banner on login |
| List error deeds | Couldn't load your deeds. |
| List error friends | Couldn't load friends. |
| Retry | Try again |

**Forbidden:** Submit, OK, Cancel (generic), Delete (alone on confirm button), Revoke.

---

## Interaction

| Flow | Behavior |
|------|----------|
| Settings load | `useGetMeQuery` on mount; show skeleton or centered loading inside card area until resolved |
| Save | PATCH only changed fields; normalize tag before submit (D-08); on success `setUser` + invalidate Me |
| 400 | `mapValidationErrors` → inline under displayName/tag |
| 409 tag | `mapConflictError` → inline under tag |
| Delete 204 | `clearSession` → `router.replace('/login?reason=account_deleted')` |
| List loading | Skeleton cards, keep page title visible |
| `/friends/[tag]` | No UX-04 upgrade (D-15) |

---

## Accessibility

- Delete modal: `role="dialog"`, `aria-modal`, `aria-labelledby`, Escape closes, initial focus on **Keep account**
- Skeleton rows: `aria-busy="true"` on list container during load
- Retry button: explicit label **Try again** (not icon-only)

---

## Out of Scope (UI)

- Email/password change forms
- Icons or illustrations in empty states
- Skeleton or empty polish on `/friends/[tag]`
- Focus trap library (deferred; match Phase 3 modal behavior)

---

*Approved for planning — 2026-06-04*
