# Phase 4: Profile, Settings & Polish - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-04
**Phase:** 4-Profile, Settings & Polish
**Areas discussed:** Settings page layout, Profile editing, Delete account, List UX polish (UX-04)

---

## Settings page layout

| Option | Description | Selected |
|--------|-------------|----------|
| Single scrollable page | Profile top, delete bottom | ✓ |
| Two labeled sections | Profile card + Danger zone card | |
| You decide | Match prior card aesthetic | |

**User's choice:** Single scrollable page

| Option | Description | Selected |
|--------|-------------|----------|
| Disabled TextField | Looks like other fields, not editable | |
| Label + plain text row | Clearly view-only | ✓ |
| You decide | | |

**User's choice:** Label + plain text for email

| Option | Description | Selected |
|--------|-------------|----------|
| Form only | Title stays "Settings" | ✓ |
| Subtitle under title | @tag or displayName | |
| You decide | | |

**User's choice:** Form only (no header subtitle)

| Option | Description | Selected |
|--------|-------------|----------|
| Rounded border card | Match DeedCard / friend cards | ✓ |
| Flat form | No card wrapper | |
| You decide | | |

**User's choice:** Card wrapper for profile fields

---

## Profile editing

| Option | Description | Selected |
|--------|-------------|----------|
| Always editable | No Edit toggle | ✓ |
| View mode + Edit profile | Save/Cancel toggle | |
| You decide | | |

**User's choice:** Always editable

| Option | Description | Selected |
|--------|-------------|----------|
| One Save changes button | PATCH changed fields only | ✓ |
| Save per field | Blur or inline save | |
| You decide | | |

**User's choice:** Single Save button

| Option | Description | Selected |
|--------|-------------|----------|
| Static hint under tag | Warn about tag change impact | |
| Confirmation modal on tag change | Confirm before PATCH | |
| No extra warning | Inline validation only | ✓ |
| You decide | | |

**User's choice:** No extra tag-change warning

| Option | Description | Selected |
|--------|-------------|----------|
| Normalize before submit | Strip @, lowercase | ✓ |
| Send as typed | Backend Transform handles | |
| You decide | | |

**User's choice:** Normalize before submit

---

## Delete account

| Option | Description | Selected |
|--------|-------------|----------|
| Modal only | Like delete deed | ✓ |
| Type @tag to confirm | Stronger gate | |
| Checkbox permanent | + confirm button | |
| You decide | | |

**User's choice:** Simple modal only

| Option | Description | Selected |
|--------|-------------|----------|
| /login with message | clearSession | ✓ |
| /register | Re-signup | |
| Public landing | Fallback to login | |
| You decide | | |

**User's choice:** Redirect to /login after 204

| Option | Description | Selected |
|--------|-------------|----------|
| Brief copy | Delete account? / can't be undone | ✓ |
| Explicit copy | Mention deeds/friendships removed | |
| You decide | | |

**User's choice:** Brief modal copy

| Option | Description | Selected |
|--------|-------------|----------|
| Bottom destructive TextButton | Below profile card | ✓ |
| Inside profile card footer | | |
| You decide | | |

**User's choice:** Delete button at bottom of page

---

## List UX polish (UX-04)

| Option | Description | Selected |
|--------|-------------|----------|
| Skeleton placeholders | Pulse card rows | ✓ |
| Spinner + Loading… | Slightly richer | |
| Keep Loading… | Empty states only | |
| You decide | | |

**User's choice:** Skeleton placeholders

| Option | Description | Selected |
|--------|-------------|----------|
| /deeds and /friends only | ROADMAP list pages | ✓ |
| Also /friends/[tag] | Friend deeds page | |
| You decide | | |

**User's choice:** Lists only (not friend deeds detail)

| Option | Description | Selected |
|--------|-------------|----------|
| Copy polish only | No icons | ✓ |
| Simple SVG icon | Above heading | |
| You decide | | |

**User's choice:** Copy polish only for empty states

| Option | Description | Selected |
|--------|-------------|----------|
| Explicit error + retry | Never show empty on error | ✓ |
| Global ErrorBanner only | Blank list area | |
| You decide | | |

**User's choice:** Explicit error state with retry

---

## Claude's Discretion

- Skeleton dimensions, exact copy strings, `usersApi` wiring details, Save disabled when pristine, settings initial data source (auth slice vs refetch).

## Deferred Ideas

None captured during this session.
