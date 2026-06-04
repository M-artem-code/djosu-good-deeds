# Phase 3: Friends & Shared Deeds - Pattern Map

**Mapped:** 2026-06-04
**Files analyzed:** 18
**Analogs found:** 16 / 18

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `frontend/src/lib/types/friend.ts` | model / types | transform | `backend/src/friends/dto/friend-item.dto.ts` + `user-by-tag.dto.ts` | exact (mirror) |
| `frontend/src/lib/utils/normalize-tag.ts` | utility | transform | `backend/src/common/utils/normalize-tag.ts` | exact (mirror) |
| `frontend/src/lib/api/validation-errors.ts` | utility | transform | `frontend/src/lib/api/validation-errors.ts` | exact (extend) |
| `frontend/src/store/friendsApi.ts` | service / API client | request-response | `frontend/src/store/deedsApi.ts` | exact (inject pattern) |
| `frontend/src/store/usersApi.ts` | service / API client | request-response | `frontend/src/store/authApi.ts` | role-match (optional) |
| `frontend/src/store/baseApi.ts` | config | pub-sub | `frontend/src/store/baseApi.ts` | exact (modify tagTypes) |
| `frontend/src/store/index.ts` | config | pub-sub | `frontend/src/store/index.ts` | exact (side-effect import) |
| `frontend/src/app/(app)/friends/page.tsx` | component / page | CRUD | `frontend/src/app/(app)/deeds/page.tsx` | exact (replace stub) |
| `frontend/src/app/(app)/friends/[tag]/page.tsx` | component / page | request-response | `frontend/src/app/(app)/deeds/page.tsx` | partial (+ 403 branch) |
| `frontend/src/components/friends/AddFriendForm.tsx` | component | request-response | `frontend/src/components/deeds/AddDeedForm.tsx` | exact (collapsed reveal) |
| `frontend/src/components/friends/FriendsList.tsx` | component | transform | `frontend/src/components/deeds/DeedList.tsx` + deeds page loading/error | role-match |
| `frontend/src/components/friends/FriendCard.tsx` | component | request-response | `frontend/src/components/deeds/DeedCard.tsx` + `AppNav.tsx` Link | partial |
| `frontend/src/components/friends/RemoveFriendModal.tsx` | component | event-driven | `frontend/src/components/deeds/DeleteDeedModal.tsx` | exact |
| `frontend/src/components/friends/BlockIncomingModal.tsx` | component | event-driven | `frontend/src/components/deeds/DeleteDeedModal.tsx` | exact |
| `frontend/src/components/friends/BlockIncomingSection.tsx` | component | request-response | `AddFriendForm.tsx` + `register/page.tsx` tag field | partial |
| `frontend/src/components/friends/FriendDeedList.tsx` | component | transform | `frontend/src/components/deeds/DeedList.tsx` | role-match (no edit/delete) |
| `frontend/src/components/deeds/DeedCard.tsx` | component | transform | self | exact (extend `readOnly`) |

---

## Pattern Assignments

### `frontend/src/lib/types/friend.ts` (types)

**Analog:** `backend/src/friends/dto/friend-item.dto.ts` + `backend/src/common/dto/user-by-tag.dto.ts`

```typescript
export interface UserByTag {
  _id: string;
  displayName: string;
  tag: string;
}

export interface FriendItem {
  _id: string;
  friend: UserByTag;
  createdAt: string;
}

export interface AddFriendBody {
  tag: string;
}
```

Reuse `DeedPublic` from `@/lib/types/deed` for `GET friends/:tag/deeds` — same shape as own deeds.

---

### `frontend/src/lib/utils/normalize-tag.ts` (utility)

**Analog:** `backend/src/common/utils/normalize-tag.ts` (lines 1-3)

```typescript
export function normalizeTag(tag: string): string {
  return tag.trim().toLowerCase().replace(/^@/, '');
}
```

**Client validation hint:** Mirror `backend/src/common/validators/tag.constants.ts`:

```typescript
export const TAG_PATTERN = /^[a-z0-9_]{3,32}$/;
```

Apply in add/block forms before submit (D-04); backend still validates via `@IsTag()` on `AddFriendDto`.

---

### `frontend/src/lib/api/validation-errors.ts` (extend)

**Analog:** `mapValidationErrors` + register tag handling

Add friend-form mapper for Nest 400 `message[]` on `tag`:

```typescript
export function mapFriendTagValidationErrors(
  message: string | string[],
): Partial<Record<"tag", string>> {
  const messages = Array.isArray(message) ? message : [message];
  const errors: Partial<Record<"tag", string>> = {};
  for (const entry of messages) {
    const lower = entry.toLowerCase();
    if (lower.includes("tag") || lower.includes("yourself")) {
      errors.tag = entry;
    }
  }
  return errors;
}
```

**Inline status mapping (do not use global banner for these):**

| Status | API message (friends) | UI copy location |
|--------|-------------------------|------------------|
| 400 | You cannot add yourself as a friend | Inline under tag (add form) |
| 404 | User not found | Inline under tag (add form) |
| 409 | Already friends | Inline under tag (add form) |
| 404 | Friendship not found (revoke incoming) | Fixed D-12: "No one with that tag has added you" |

Use `getApiMessage(error)` pattern from `register/page.tsx` (lines 18-26) for API message text on 404/409 when showing server message.

---

### `frontend/src/store/friendsApi.ts` (RTK Query inject)

**Analog:** `frontend/src/store/deedsApi.ts`

**Imports pattern** (lines 1-6):

```typescript
import type { DeedPublic } from "@/lib/types/deed";
import type { AddFriendBody, FriendItem } from "@/lib/types/friend";
import { baseApi } from "./baseApi";
```

**Core inject pattern** (lines 8-40):

```typescript
export const friendsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFriends: builder.query<FriendItem[], void>({
      query: () => "friends",
      providesTags: [{ type: "Friend", id: "LIST" }],
    }),
    addFriend: builder.mutation<FriendItem, AddFriendBody>({
      query: (body) => ({ url: "friends", method: "POST", body }),
      invalidatesTags: [{ type: "Friend", id: "LIST" }],
    }),
    removeFriend: builder.mutation<void, string>({
      query: (friendshipId) => ({
        url: `friends/${friendshipId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Friend", id: "LIST" }],
    }),
    revokeIncoming: builder.mutation<void, string>({
      query: (tag) => ({
        url: `friends/incoming/${encodeURIComponent(tag)}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Friend", id: "LIST" }],
    }),
    getFriendDeeds: builder.query<DeedPublic[], string>({
      query: (tag) => `friends/${encodeURIComponent(tag)}/deeds`,
      providesTags: (_result, _err, tag) => [
        { type: "FriendDeed", id: tag },
      ],
    }),
  }),
});
```

**API contract** (from `backend/src/friends/friends.controller.ts` + `backend/test/friends.e2e-spec.ts`):

- `POST /api/friends` body `{ tag }` → 201 `FriendItem`; 400 self; 404 User not found; 409 Already friends
- `GET /api/friends` → 200 `FriendItem[]` (outgoing only, newest first)
- `DELETE /api/friends/:friendshipId` → 204
- `DELETE /api/friends/incoming/:tag` → 204; 404 Friendship not found (generic inline D-12)
- `GET /api/friends/:tag/deeds` → 200 `DeedPublic[]`; 403 unified (non-friend + unknown tag)

**403 message from backend** (`friends.service.ts` line 123): `'You can only view deeds of your friends'` — UI must show D-15 copy **"You can't view this user's deeds"**, not raw API text.

Export hooks mirroring `deedsApi.ts` lines 43-48.

---

### `frontend/src/store/usersApi.ts` (optional — displayName on direct URL)

**Analog:** `frontend/src/store/authApi.ts` `getMe` (lines 24-27)

```typescript
getUserByTag: builder.query<UserByTag, string>({
  query: (tag) => `users/by-tag/${encodeURIComponent(tag)}`,
}),
```

**Contract:** `GET /api/users/by-tag/:tag` → 200 `UserByTag`; 404 unknown tag (`users.e2e-spec.ts`). Use on `/friends/[tag]` when user lands without list context (CONTEXT discretion). Do not expose email.

---

### `frontend/src/store/baseApi.ts` (modify tagTypes)

**Analog:** current `tagTypes: ["User", "Deed"]` (line 68)

```typescript
tagTypes: ["User", "Deed", "Friend", "FriendDeed"],
```

Keep `baseQueryWithReauth` 401/5xx behavior unchanged — friend mutations rely on ErrorBanner for 5xx; form endpoints use inline errors per CONTEXT D-20–22.

---

### `frontend/src/store/index.ts` (modify)

**Analog:** `import "./deedsApi";` (line 6)

Add `import "./friendsApi";` (and `"./usersApi"` if split). Same side-effect registration pattern.

---

### `frontend/src/app/(app)/friends/page.tsx` (page — replace stub)

**Analog:** `frontend/src/app/(app)/deeds/page.tsx` + existing stub at `friends/page.tsx`

**Stub to replace** (friends/page.tsx lines 1-11) — keep route, replace body.

**Loading / error / empty pattern** (deeds/page.tsx lines 7-53):

```typescript
"use client";

import { useGetFriendsQuery } from "@/store/friendsApi";

export default function FriendsPage() {
  const { data: friends = [], isLoading, isError } = useGetFriendsQuery();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8">
        <h1 className="text-[28px] font-semibold leading-tight ...">Friends</h1>
        <p className="text-center text-base ...">Loading…</p>
      </div>
    );
  }

  if (isError) {
    // D-22 + 02-REVIEW: explicit error — NOT empty state
    return (/* "Couldn't load friends. Try again." */);
  }
  // intro blurb (max-w-xl) → AddFriendForm → FriendsList → BlockIncomingSection
}
```

**Page title:** UI-SPEC Display `text-[28px]` for "Friends" (differs from deeds `text-xl` — follow `03-UI-SPEC.md`).

**Layout stack:** `flex flex-col gap-6` / `gap-8` per UI-SPEC section-gap between list and block section.

---

### `frontend/src/app/(app)/friends/[tag]/page.tsx` (dynamic page)

**Analog:** `deeds/page.tsx` loading + `DeedList` sections; **403 branch has no analog**

```typescript
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { normalizeTag } from "@/lib/utils/normalize-tag";
import { useGetFriendDeedsQuery } from "@/store/friendsApi";
// optional: useGetUserByTagQuery(normalizeTag(params.tag))

const { data, isLoading, error } = useGetFriendDeedsQuery(tag);

if (isLoading) { /* Loading… */ }

const status = error && "status" in error ? error.status : undefined;
if (status === 403) {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <h2 className="text-xl font-semibold">You can't view this user's deeds</h2>
      <Link href="/friends">Back to friends</Link>
    </div>
  );
}

if (isError) { /* banner-style or inline — not 403 */ }

// Header: @{tag}'s deeds + displayName subtitle
// FriendDeedList or empty "No deeds yet"
```

Normalize `params.tag` with `normalizeTag()` before query (matches backend route param handling).

---

### `frontend/src/components/friends/AddFriendForm.tsx` (collapsed form)

**Analog:** `frontend/src/components/deeds/AddDeedForm.tsx`

**Reveal pattern** (AddDeedForm lines 15-18, 69-72):

```typescript
const [revealed, setRevealed] = useState(false);
const expanded = friendCount === 0 || revealed;

if (!expanded) {
  return <TextButton onClick={() => setRevealed(true)}>Add friend</TextButton>;
}
```

**Submit + inline errors** (AddDeedForm lines 36-66 + register lines 58-78):

```typescript
const [addFriend, { isLoading }] = useAddFriendMutation();

try {
  await addFriend({ tag: normalizeTag(tagInput) }).unwrap();
  resetForm();
  setRevealed(false);
} catch (error) {
  const status = /* extract */;
  if (status === 400) { /* mapFriendTagValidationErrors */ }
  if (status === 404 || status === 409) {
    setFieldErrors({ tag: getApiMessage(error) ?? fallback });
  }
}
```

Surface: `rounded-xl border ... p-4` (AddDeedForm line 76). Hint copy per UI-SPEC below field.

---

### `frontend/src/components/friends/FriendsList.tsx` (list states)

**Analog:** `DeedList.tsx` card stack (lines 24-42) + deeds page `isError` guard

```typescript
// Props: friends, onRemove(friendshipId, friend)
<div className="flex flex-col gap-4">
  {friends.map((item) => (
    <FriendCard key={item._id} item={item} onRemove={...} />
  ))}
</div>
```

Empty state (not loading, not error, length 0): heading "No friends yet" + body per UI-SPEC. Parent owns `isLoading`/`isError` — list component only renders cards or empty content.

---

### `frontend/src/components/friends/FriendCard.tsx` (clickable card row)

**Analog:** DeedCard surface (DeedCard lines 127-127) + AppNav `Link` (AppNav lines 76-79)

**Card surface** (match DeedCard; UI-SPEC uses `rounded-lg` — align with existing `rounded-xl` in DeedCard or UI-SPEC `rounded-lg`):

```tsx
<article className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
```

**Navigation (D-13):** Wrap card content in `Link href={`/friends/${friend.tag}`}` with `className="block min-h-[56px] ..."`.

**Remove control (stopPropagation):**

```tsx
<TextButton
  variant="destructive"
  onClick={(e) => {
    e.preventDefault();
    e.stopPropagation();
    onRemove(item);
  }}
>
  Remove
</TextButton>
```

**Content:** `@${friend.tag}` semibold; `displayName` muted; "You follow" pill (`text-xs font-semibold uppercase`, `bg-zinc-100 dark:bg-zinc-800`).

---

### `frontend/src/components/friends/RemoveFriendModal.tsx` (destructive confirm)

**Analog:** `frontend/src/components/deeds/DeleteDeedModal.tsx`

**Modal shell** (DeleteDeedModal lines 44-84):

```tsx
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
  <div role="dialog" aria-modal="true" aria-labelledby={titleId}
    className="w-full max-w-[400px] rounded-xl border ... p-6">
```

**Focus + Escape** (lines 22-33): focus secondary "Keep friend" button on mount; Escape → `onClose`.

**Confirm:** `useRemoveFriendMutation`; primary destructive red button; copy per UI-SPEC ("Remove friend" / "Keep friend") — no "Cancel"/"OK".

---

### `frontend/src/components/friends/BlockIncomingModal.tsx` (destructive confirm)

**Analog:** `DeleteDeedModal.tsx` — same shell; props include `tag: string` for title `Block @{tag}?` and confirm `Block @{tag}`.

Mutation: `useRevokeIncomingMutation` with `normalizeTag(tag)` in URL.

---

### `frontend/src/components/friends/BlockIncomingSection.tsx` (block-by-tag section)

**Analog:** Register tag field (register/page.tsx lines 122-135) + AddFriendForm submit/error handling

- Section heading: `text-sm font-semibold uppercase tracking-wide` (DeedList section label pattern, line 26)
- `TextField` label "Their tag"
- `PrimaryButton` "Block" opens modal (D-10) — do not submit directly
- Modal confirms; on 404 set fixed inline D-12 (ignore API message for user-facing text)

---

### `frontend/src/components/friends/FriendDeedList.tsx` (read-only sections)

**Analog:** `DeedList.tsx` (lines 16-50) without edit/delete modal state

```typescript
const planned = deeds.filter((d) => d.status === "planned");
const done = deeds.filter((d) => d.status === "done");
// renderSection("Planned", planned) / renderSection("Done", done)
// Map to <DeedCard deed={deed} readOnly /> or read-only view-only branch
```

`gap-6` between sections per UI-SPEC `section-gap`.

---

### `frontend/src/components/deeds/DeedCard.tsx` (extend readOnly)

**Analog:** view branch (lines 122-162) — hide action row when `readOnly`

```typescript
interface DeedCardProps {
  deed: DeedPublic;
  readOnly?: boolean;
  // existing edit/delete props optional when readOnly
}

// readOnly: render title, StatusBadge, description only — no TextButton row
```

Prefer single component over `FriendDeedCard` duplicate (CONTEXT discretion).

---

## Shared Patterns

### RTK Query inject + store registration

**Source:** `frontend/src/store/deedsApi.ts`, `frontend/src/store/index.ts`

**Apply to:** `friendsApi.ts`, optional `usersApi.ts`

```typescript
export const friendsApi = baseApi.injectEndpoints({ endpoints: (builder) => ({ ... }) });
// index.ts: import "./friendsApi";
```

---

### Bearer auth + global 401/5xx

**Source:** `frontend/src/store/baseApi.ts` (lines 15-60)

**Apply to:** All friend endpoints (authenticated)

- 401 → `clearSession()` + redirect `/login?reason=session_expired`
- 5xx / network → `setBannerMessage` via `uiSlice` (list fetch failures D-22)
- Form 400/404/409 on add/block → **inline only**, do not dispatch banner

---

### Page loading / error / empty trilogy

**Source:** `frontend/src/app/(app)/deeds/page.tsx` (lines 7-53)

**Apply to:** `friends/page.tsx`, `friends/[tag]/page.tsx`

| State | Friends list | Friend deeds |
|-------|--------------|--------------|
| Loading | Centered "Loading…" under title | Same |
| Error | Explicit message — not empty list (02-REVIEW) | Non-403: connection message; 403: dedicated panel D-15 |
| Empty | "No friends yet" + prompt | "No deeds yet" — no add form |

---

### Collapsed inline form reveal

**Source:** `frontend/src/components/deeds/AddDeedForm.tsx` (lines 15-18, 69-72)

**Apply to:** `AddFriendForm.tsx`

Auto-expand when `friendCount === 0` (mirror `deedCount === 0`).

---

### Destructive confirmation modal

**Source:** `frontend/src/components/deeds/DeleteDeedModal.tsx`

**Apply to:** `RemoveFriendModal.tsx`, `BlockIncomingModal.tsx`

- `max-w-[400px]`, `role="dialog"`, `aria-labelledby`
- Escape = dismiss; focus secondary safe action first
- Specific button labels per `03-UI-SPEC.md` copy table

---

### Tag normalization on submit

**Source:** `backend/src/common/utils/normalize-tag.ts` + `register/page.tsx` (line 49 — extend with `@` strip)

**Apply to:** Add friend, block incoming, friend deeds route param

```typescript
import { normalizeTag } from "@/lib/utils/normalize-tag";
// submit: { tag: normalizeTag(rawInput) }
```

Register uses `tag.trim().toLowerCase()` only — friends flows must also strip leading `@` per D-04.

---

### Protected app shell

**Source:** `frontend/src/app/(app)/layout.tsx` (lines 10-17)

**Apply to:** New routes under `(app)/friends/` — no extra guard; `AuthGuard` wraps all app pages.

---

### Path alias

**Source:** `frontend/tsconfig.json` — `@/*` → `./src/*`

**Apply to:** All new `components/friends/*`, `store/friendsApi.ts`, `lib/types/friend.ts`

---

## No Analog Found

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `frontend/src/app/(app)/friends/[tag]/page.tsx` (403 branch) | page | request-response | No existing dedicated HTTP-status page state in frontend |
| `frontend/src/store/usersApi.ts` | API client | request-response | No `users/by-tag` client yet; optional — mirror `authApi.getMe` when needed |

**Planner guidance:** For 403 state and dynamic `[tag]` route, follow `03-UI-SPEC.md` and Next.js `useParams` from `next/navigation`. Backend contract is complete in `friends.controller.ts` and e2e tests.

---

## Anti-Patterns (Phase 3)

| Anti-pattern | Why wrong | Do instead |
|--------------|-----------|------------|
| Show empty friends list on `isError` | 02-REVIEW / D-22 | Explicit "Couldn't load friends" message |
| Map 403 to "User not found" | Anti-enumeration | D-15 unified copy only |
| Use API 403 message in UI | Differs from product copy | "You can't view this user's deeds" |
| Global banner for add 404/409 | CONTEXT D-20–21 | Inline under tag field |
| Distinguish revoke 404 causes | D-12 | Single generic inline message |
| `revoke` / `Cancel` / `OK` on modals | UI-SPEC forbidden | Block / Keep friend / Remove friend |
| Bidirectional friendship assumption | One-way model | Intro + "You follow" badge |

---

## Metadata

**Analog search scope:** `frontend/src/**`, `backend/src/friends/**`, `backend/src/common/utils/normalize-tag.ts`, `backend/test/friends.e2e-spec.ts`, `.planning/phases/01-app-shell-authentication/01-PATTERNS.md`, `.planning/phases/02-my-deeds/02-PATTERNS.md`

**Files scanned:** 28

**Pattern extraction date:** 2026-06-04

**Note:** Backend friends API is complete; frontend implements against existing `friends/page.tsx` stub and Phase 2 deed/friends-nav patterns. No backend changes in phase scope.
