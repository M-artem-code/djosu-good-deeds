# Phase 2: My Deeds - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-04
**Phase:** 2-My Deeds
**Areas discussed:** List layout & status display, Create & edit flow, Mark as done, Delete confirmation, Empty & loading

---

## List layout & status display

| Option | Description | Selected |
|--------|-------------|----------|
| Cards | Stacked cards with title, snippet, status badge — matches AuthCard surfaces | ✓ |
| Compact rows | Dense single-line rows — new pattern | |
| Two sections | Headings "Planned" and "Done" | ✓ |
| Single mixed list | One chronological list with badges | |
| Text badge | Small pill Planned / Done | ✓ |
| Strikethrough / both | Alternative status visuals | |
| API default sort | Newest first, no client sort UI | ✓ |
| Description snippet | 1–2 line truncate on card | ✓ |
| Title only on list | Description only in forms | |

**User's choice:** Cards, two sections, text badges, API default sort, description snippet.
**Notes:** Hide empty sections (decided in Empty & loading area).

---

## Create & edit flow

| Option | Description | Selected |
|--------|-------------|----------|
| Inline form at top | Add deed on /deeds without new route | ✓ |
| Modal / /deeds/new | Alternatives for create | |
| Expand card inline | Edit in place on card | ✓ |
| Modal / /deeds/[id] | Alternatives for edit | |
| Collapsed add form | "Add deed" reveals form by default | ✓ |
| Always expanded | Alternative default | |
| Cancel button | Explicit cancel collapses edit | ✓ |
| Title + description only | Status via mark-done, not form | ✓ |
| Specific button copy | Add deed / Save changes labels | ✓ |

**User's choice:** Inline top add (collapsed), inline expand edit, cancel button, title+description only, specific copy.

---

## Mark as done

| Option | Description | Selected |
|--------|-------------|----------|
| Mark done button | One-click from planned cards | ✓ |
| Checkbox / edit only | Alternatives | |
| Mark planned on done cards | Reversible status | ✓ |
| No revert | Rejected — API allows planned again | |
| No confirmation | Reversible — low friction | ✓ |
| Disable + loading label | During PATCH | ✓ |
| Optimistic UI | Deferred — more complex | |

**User's choice:** Mark done / Mark planned buttons, no confirm, disable button while loading.

---

## Delete confirmation

| Option | Description | Selected |
|--------|-------------|----------|
| Modal confirm | Delete deed? / can't be undone | ✓ |
| Inline two-step / no confirm | Alternatives | |
| Card action row | With Edit and status buttons | ✓ |
| Specific destructive copy | Delete deed / Keep deed | ✓ |
| List update only | No toast on 204 | ✓ |

**User's choice:** Modal, card actions, specific copy, silent success (card disappears).

---

## Empty & loading

| Option | Description | Selected |
|--------|-------------|----------|
| Centered Loading… | Match AuthGuard pattern | ✓ |
| Skeleton cards | Deferred to Phase 4 | |
| Empty state + CTA | No deeds yet + prompt add | ✓ |
| Hide empty sections | Don't show Planned/Done when empty | ✓ |

**User's choice:** Minimal loading text now; real empty state; hide empty section headings.

---

## Claude's Discretion

- Auto-expand add form when list is empty (D-08 + D-21).
- RTK Query structure and modal component implementation details.
- Card action row layout and destructive styling.

## Deferred Ideas

- Skeleton loaders and full list polish — Phase 4 (UX-04).
- Search/filter/sort — out of v1 scope.
- Status in edit form — rejected in favor of action buttons.
