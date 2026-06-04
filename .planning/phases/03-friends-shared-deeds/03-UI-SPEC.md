---
phase: 3
slug: friends-shared-deeds
status: approved
shadcn_initialized: false
preset: none
created: 2026-06-04
reviewed_at: 2026-06-04
---

# Phase 3 — UI Design Contract

> Visual and interaction contract for Friends & Shared Deeds. Inherits Phase 1 tokens (`01-UI-SPEC.md`) and Phase 2 deed surfaces (`02-UI-SPEC.md`). Implements locked decisions in `03-CONTEXT.md`.

---

## Design System

| Property | Value |
|----------|-------|
| Tool | none (Tailwind utility-first; no shadcn) |
| Preset | not applicable |
| Component library | none — extend Phase 1 local components |
| Icon library | inline SVG (Heroicons-style outline, 20px) — same as Phase 1 |
| Font | Geist Sans (`layout.tsx`) |

**Rationale:** Friends flows reuse deed card geometry, modals, and form primitives from Phases 1–2. No new dependencies.

**Phase 1–2 carry-forward:** Spacing scale, typography roles, 60/30/10 color contract, focus rings, forbidden generic labels, and modal patterns remain binding unless overridden below.

---

## Spacing Scale

Inherited from Phase 1 (multiples of 4):

| Token | Value | Phase 3 usage |
|-------|-------|---------------|
| xs | 4px | Badge padding-x, intro blurb line gaps |
| sm | 8px | Card internal gaps, block-section field stack |
| md | 16px | Friend card padding, form field stack, section margins |
| lg | 24px | Gap between intro → add form → list → block section |
| xl | 32px | Page title to intro blurb |
| 2xl | 48px | — not used |
| 3xl | 64px | — reserved |

**Phase 3 additions:**

| Token | Value | Usage |
|-------|-------|-------|
| card-pad | 16px (`p-4`) | Friend card interior (match DeedCard) |
| card-stack | 16px (`gap-4`) | Vertical stack of friend cards |
| section-gap | 24px (`gap-6`) | Between friends list and block section; between Planned/Done on friend deeds |
| intro-max | 640px (`max-w-xl`) | One-way friendship intro blurb readable width |

Exceptions:
- **44px** min touch target on card links, primary buttons, modal actions
- Modal max-width **400px** (`max-w-[400px]`) — remove-friend and block confirmations
- Friend card entire row is clickable navigation — min height **56px** for touch

---

## Typography

Inherited from Phase 1 four-size scale (14 / 16 / 20 / 28 px):

| Role | Maps to | Tailwind | Usage |
|------|---------|----------|-------|
| Page title | Display | `text-[28px] font-semibold leading-tight` | `/friends` — "Friends" |
| Intro body | Body | `text-base font-normal leading-normal text-zinc-600 dark:text-zinc-300` | Directed-friendship blurb (D-01) |
| Section label | Label + semibold | `text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400` | "Block someone who added you" (D-09) |
| Friend tag (primary) | Body + semibold | `text-base font-semibold leading-normal` | `@tag` on card (D-06) |
| Display name (secondary) | Label | `text-sm font-normal text-zinc-500 dark:text-zinc-400` | Muted under tag (D-06) |
| You follow badge | Label + semibold | `text-xs font-semibold uppercase tracking-wide` + pill padding | Outgoing row label (D-03) |
| Friend deeds title | Heading | `text-xl font-semibold leading-tight` | `@tag's deeds` (D-16) |
| Friend deeds subtitle | Label | `text-sm font-normal text-zinc-500 dark:text-zinc-400` | `displayName` under title |
| Field error | Label | `text-sm font-normal text-red-600 dark:text-red-400` | Add/block inline errors (D-04, D-12, D-20–21) |
| Modal title | Heading | `text-xl font-semibold leading-tight` | Remove / block modals |
| Empty state heading | Body + semibold | `text-base font-semibold` | Zero friends / zero deeds |
| Empty state body | Label | `text-sm font-normal text-zinc-500 dark:text-zinc-400` | Prompt toward add or back link |

**Active sizes in Phase 3:** 12px badge only (`text-xs`); otherwise 14px, 16px, 20px, 28px.

**Weight rule:** Only **400** and **600**.

---

## Color

Inherited from Phase 1:

| Role | Light | Dark | Usage |
|------|-------|------|-------|
| Dominant (60%) | zinc-50 | zinc-950 | Page background |
| Secondary (30%) | white | zinc-900 | Friend cards, modals, add-form surface |
| Accent (10%) | zinc-900 | zinc-50 | "Add friend" reveal, primary form CTAs, focus rings |
| Muted text | zinc-500 | zinc-400 | displayName, intro, section labels |
| Border | zinc-200 | zinc-700 | Cards, modals, inputs |
| Destructive | red-600 | red-400 | Remove friend, block confirm, field errors |
| Error banner bg | red-50 | red-950/40 | 5xx / network on list fetch (D-22) |
| Follow badge bg | zinc-100 | zinc-800 | "You follow" pill (subtle, not accent) |

**Accent reserved for:** Add-friend reveal control, add/block submit buttons, link back to friends on 403 page (TextButton accent style).

**Destructive reserved for:** Remove friend button, block confirm in modal, destructive modal primary.

---

## Surfaces & Layout

### `/friends` page structure (top → bottom)

1. **Page title** — "Friends" (Display)
2. **Intro blurb** (D-01, D-02) — max-w-xl, plain copy: adding lets you see their deeds; they won't see yours unless they add you
3. **Add friend** (D-07) — collapsed by default; `TextButton` "Add friend" reveals inline tag field + hint line (D-02 one-liner near form)
4. **Friends list** — card rows (D-05); stack gap-4
5. **Block section** (D-09) — separated by section-gap; heading + tag field + `PrimaryButton` "Block" (opens modal D-10)

### Friend card (D-05, D-06, D-03, D-13)

| Element | Spec |
|---------|------|
| Container | `rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-4` — match DeedCard |
| Interaction | Entire card `cursor-pointer` navigates to `/friends/[tag]` (D-13) |
| Primary line | `@tag` semibold |
| Secondary | `displayName` muted |
| Badge | "You follow" pill top-right or below tag — planner discretion (D-03) |
| Remove | `TextButton` destructive style on card — does **not** trigger navigation (`e.stopPropagation()`) |

### Friend deeds `/friends/[tag]` (D-14–D-16)

| Element | Spec |
|---------|------|
| Header | `@tag's deeds` (heading) + `displayName` subtitle |
| Body | Mirror `/deeds`: Planned / Done sections, read-only cards |
| 403 state | Centered panel: "You can't view this user's deeds" + link "Back to friends" → `/friends` (D-15) |
| Empty deeds | "No deeds yet" — no add form (D-19) |
| Loading | Centered "Loading…" (D-17 pattern) |

### Modals (D-08, D-10)

| Modal | Title | Body | Primary (destructive) | Secondary |
|-------|-------|------|----------------------|-----------|
| Remove friend | Remove friend? | Short line: stops you seeing their deeds | Remove friend | Keep friend |
| Block by tag | Block @tag? | They won't see your deeds if they added you | Block @tag | Keep |

- Overlay + panel match `DeleteDeedModal` (Phase 2)
- Focus trap: same as Phase 2 delete modal (tab cycle within modal)
- No generic OK/Cancel/Submit

---

## Forms & Validation

| Form | Fields | Normalize (D-04) | Inline errors |
|------|--------|-------------------|---------------|
| Add friend | tag | strip `@`, lowercase per `TAG_PATTERN` | 400 self-add, 404 not found, 409 duplicate (D-20–21) |
| Block incoming | tag | same normalize | 404 generic: "No one with that tag has added you" (D-12) |

- Collapsed add form: mirror `AddDeedForm` reveal pattern (Phase 2 D-07 analog)
- Auto-expand add form when list empty — discretion (D-18); if expanded, highlight is visual only (ring or bold "Add friend")

---

## Copywriting Contract

| Element | Copy |
|---------|------|
| Page title | Friends |
| Intro blurb | Adding someone lets you see their deeds. They won't see yours unless they add you. |
| Add reveal | Add friend |
| Add hint (near field) | Enter their tag — no @ required. |
| Add submit | Add friend |
| Adding state | Adding… |
| You follow badge | You follow |
| Remove control | Remove |
| Remove modal title | Remove friend? |
| Remove modal body | You won't see their deeds anymore. |
| Remove confirm | Remove friend |
| Remove cancel | Keep friend |
| Block section heading | Block someone who added you |
| Block field label | Their tag |
| Block button | Block |
| Block modal title | Block @{tag}? |
| Block modal body | They won't see your deeds if they added you. |
| Block confirm | Block @{tag} |
| Block cancel | Keep |
| Block 404 inline | No one with that tag has added you |
| List loading | Loading… |
| List empty heading | No friends yet |
| List empty body | Add someone by tag to see their deeds. |
| List fetch error | Couldn't load friends. Try again. (banner or inline — not empty state) |
| Friend deeds title | @{tag}'s deeds |
| Friend deeds 403 | You can't view this user's deeds |
| Friend deeds back link | Back to friends |
| Friend deeds empty | No deeds yet |
| Friend deeds loading | Loading… |

**Forbidden:** Submit, OK, Cancel, Confirm, Delete (use specific verbs above), Revoke (use Block per D-11).

---

## Component Inventory (new / extended)

| Component | Path | Notes |
|-----------|------|-------|
| FriendsPage | `app/(app)/friends/page.tsx` | Intro, list, add, block |
| FriendDeedsPage | `app/(app)/friends/[tag]/page.tsx` | Read-only deed sections |
| FriendCard | `components/friends/FriendCard.tsx` | Card row + navigate |
| FriendsList | `components/friends/FriendsList.tsx` | Loading / error / empty / cards |
| AddFriendForm | `components/friends/AddFriendForm.tsx` | Collapsed reveal |
| BlockIncomingSection | `components/friends/BlockIncomingSection.tsx` | D-09 section |
| RemoveFriendModal | `components/friends/RemoveFriendModal.tsx` | D-08 |
| BlockIncomingModal | `components/friends/BlockIncomingModal.tsx` | D-10 |
| FriendDeedList | `components/friends/FriendDeedList.tsx` | Reuse DeedCard readOnly or FriendDeedCard |
| friendsApi | `store/friendsApi.ts` | RTK Query endpoints |

---

## Accessibility

- Friend card: entire card is a link or contains a single logical link — prefer wrapping with `Link` + stopPropagation on Remove
- Modals: `role="dialog"`, `aria-modal="true"`, labelled by modal title
- 403 page: heading level 2 for error title
- Focus visible on all interactive elements (Phase 1 ring)

---

## Registry Safety

| Registry | Blocks Used | Safety Gate |
|----------|-------------|-------------|
| none | — | not required |

---

## Checker Sign-Off

- [x] Dimension 1 Copywriting: PASS
- [x] Dimension 2 Visuals: PASS
- [x] Dimension 3 Color: PASS
- [x] Dimension 4 Typography: PASS
- [x] Dimension 5 Spacing: PASS
- [x] Dimension 6 Registry Safety: PASS

**Approval:** approved 2026-06-04
