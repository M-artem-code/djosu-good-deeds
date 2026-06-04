# Phase 3: Friends & Shared Deeds - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-04
**Phase:** 3-Friends & Shared Deeds
**Areas discussed:** One-way friendship messaging, Friends list & add-by-tag, Revoke incoming access, Friend deeds page

---

## One-way friendship messaging

| Option | Description | Selected |
|--------|-------------|----------|
| Intro on `/friends` only | Short blurb at top | |
| Hint near add form only | Discovered when adding | |
| Both intro + form hint | Brief intro + one line near add | ✓ |
| You decide | Minimal but clear | |

| Option | Description | Selected |
|--------|-------------|----------|
| Plain & direct | Full sentence explaining direction | ✓ |
| Ultra-short + expand | One sentence + learn more | |
| Follow metaphor | "Following their deeds" | |
| You decide | | |

| Option | Description | Selected |
|--------|-------------|----------|
| No extra UI | They won't see your deeds until they add you | |
| Note on friend deeds page | Explain why you can see their deeds | |
| "You follow" badge per row | Subtle label on friends list | ✓ |
| You decide | | |

| Option | Description | Selected |
|--------|-------------|----------|
| Inline field error | Under tag field | ✓ |
| Banner only | Global error | |
| Inline + normalize | Strip @, lowercase before submit | ✓ |
| You decide | | |

**User's choice:** Both intro and form hint; plain direct tone; "You follow" badge on list; inline errors with tag normalization.

---

## Friends list & add-by-tag

| Option | Description | Selected |
|--------|-------------|----------|
| Card rows | Like DeedCard | ✓ |
| Simple list rows | Lighter chrome | |
| Table-style rows | Compact | |
| You decide | | |

| Option | Description | Selected |
|--------|-------------|----------|
| @tag primary | displayName muted secondary | ✓ |
| displayName primary | @tag secondary | |
| @tag only | Name on hover only | |
| You decide | | |

| Option | Description | Selected |
|--------|-------------|----------|
| Inline collapsed top | "Add friend" reveals form | ✓ |
| Inline always visible | Form always open | |
| Modal | Button opens modal | |
| You decide | | |

| Option | Description | Selected |
|--------|-------------|----------|
| Modal confirmation | Like delete deed | ✓ |
| No confirmation | Immediate remove | |
| Inline two-step | Confirm on row | |
| You decide | | |

**User's choice:** Card rows, @tag primary, collapsed inline add, modal for remove outgoing.

---

## Revoke incoming access

| Option | Description | Selected |
|--------|-------------|----------|
| Section on `/friends` | "Block someone who added you" below list | ✓ |
| Defer to Settings | Phase 4 | |
| Near add form | Secondary action | |
| You decide | | |

| Option | Description | Selected |
|--------|-------------|----------|
| Modal confirmation | Before block submit | ✓ |
| Single submit | No modal | |
| You decide | | |

| Option | Description | Selected |
|--------|-------------|----------|
| "Block" | Access-control framing | ✓ |
| "Revoke access" | API naming | |
| "Remove follower" | Social metaphor | |
| You decide | | |

| Option | Description | Selected |
|--------|-------------|----------|
| Generic inline | No distinction unknown vs no friendship | ✓ |
| API message as-is | | |
| Banner only | | |
| You decide | | |

**User's choice:** Dedicated block section on friends page; modal confirm; verb "Block"; generic inline 404 message.

---

## Friend deeds page

| Option | Description | Selected |
|--------|-------------|----------|
| Click entire card | Navigate to `/friends/[tag]` | ✓ |
| "View deeds" button | Card not fully clickable | |
| @tag link only | | |
| You decide | | |

| Option | Description | Selected |
|--------|-------------|----------|
| Mirror My Deeds | Planned/Done sections, read-only | ✓ |
| Flat list | No sections | |
| Minimal list | Title + badge only | |
| You decide | | |

| Option | Description | Selected |
|--------|-------------|----------|
| Dedicated error state | Message + link back to Friends | ✓ |
| Redirect with banner | | |
| 404-style page | | |
| You decide | | |

| Option | Description | Selected |
|--------|-------------|----------|
| "@tag's deeds" + displayName subtitle | | ✓ |
| displayName primary | | |
| @tag only H1 | | |
| You decide | | |

**User's choice:** Whole card navigates; mirror planned/done read-only; dedicated 403 error page; @tag's deeds header with displayName subtitle.

---

## Claude's Discretion

- Empty/loading states (D-17–19), add-friend 409/404 handling (D-20–21), list fetch error vs empty (not discussed in detail — follow Phase 2 patterns and 02-REVIEW).
- Modal button copy, RTK Query structure, read-only DeedCard vs FriendDeedCard.

## Deferred Ideas

- Incoming friends list — no API.
- Block flow on Settings page — rejected.
- Mutual friendship — out of scope per REQUIREMENTS.md.
