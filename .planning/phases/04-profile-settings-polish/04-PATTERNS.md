# Phase 4: Profile, Settings & Polish - Pattern Map

**Mapped:** 2026-06-04
**Files analyzed:** 9
**Analogs found:** 8 / 9

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `frontend/src/store/usersApi.ts` | store / API client | request-response | `frontend/src/store/authApi.ts` + `frontend/src/store/deedsApi.ts` | exact (extend) |
| `frontend/src/app/(app)/settings/page.tsx` | component / page | request-response | `frontend/src/app/(app)/friends/page.tsx` | role-match |
| `frontend/src/components/settings/*` (new) | component | request-response | `frontend/src/components/friends/AddFriendForm.tsx` + `frontend/src/app/(auth)/register/page.tsx` | exact |
| `frontend/src/components/ui/SkeletonCard.tsx` (or similar) | component | transform | `frontend/src/components/deeds/DeedCard.tsx` + `frontend/src/components/friends/FriendCard.tsx` | partial (layout only) |
| `frontend/src/components/feedback/ListErrorState.tsx` (or inline) | component | request-response | `frontend/src/app/(app)/deeds/page.tsx` + `frontend/src/app/(app)/friends/page.tsx` | partial (upgrade) |
| `frontend/src/components/settings/DeleteAccountModal.tsx` | component / modal | request-response | `frontend/src/components/deeds/DeleteDeedModal.tsx` | exact |
| `frontend/src/app/(app)/deeds/page.tsx` | component / page | CRUD list | `frontend/src/app/(app)/deeds/page.tsx` | exact (modify) |
| `frontend/src/app/(app)/friends/page.tsx` | component / page | CRUD list | `frontend/src/app/(app)/friends/page.tsx` | exact (modify) |

---

## Pattern Assignments

### `frontend/src/store/usersApi.ts` (store, extend — getMe, updateMe, deleteMe)

**Note:** `getMe` already exists on `authApi` (`GET users/me`, tag `User`). CONTEXT requires extending `usersApi` for settings mutations; keep a single source of truth for `GET users/me` (either move query to `usersApi` and update `StoreProvider` imports, or delegate `getMe` from `usersApi` with same endpoint — planner decides dedup).

**Analog (query):** `frontend/src/store/authApi.ts`

**Imports pattern** (lines 1-3):
```typescript
import type { AuthResponse } from "@/lib/types/auth";
import type { UserPublic } from "@/lib/types/user";
import { baseApi } from "./baseApi";
```

**Existing getMe query** (lines 24-27):
```typescript
    getMe: builder.query<UserPublic, void>({
      query: () => "users/me",
      providesTags: ["User"],
    }),
```

**Analog (PATCH mutation):** `frontend/src/store/deedsApi.ts`

**updateDeed mutation** (lines 22-32):
```typescript
    updateDeed: builder.mutation<
      DeedPublic,
      { id: string; body: UpdateDeedBody }
    >({
      query: ({ id, body }) => ({
        url: `deeds/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [{ type: "Deed", id: "LIST" }],
    }),
```

**Apply to updateMe:**
```typescript
updateMe: builder.mutation<UserPublic, UpdateProfileBody>({
  query: (body) => ({
    url: "users/me",
    method: "PATCH",
    body,
  }),
  invalidatesTags: ["User"],
}),
```

**Analog (DELETE mutation):** `frontend/src/store/deedsApi.ts`

**deleteDeed mutation** (lines 33-39):
```typescript
    deleteDeed: builder.mutation<void, string>({
      query: (id) => ({
        url: `deeds/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Deed", id: "LIST" }],
    }),
```

**Apply to deleteMe:**
```typescript
deleteMe: builder.mutation<void, void>({
  query: () => ({
    url: "users/me",
    method: "DELETE",
  }),
}),
```

**Existing inject pattern** (usersApi.ts lines 4-10):
```typescript
export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserByTag: builder.query<UserByTag, string>({
      query: (tag) => `users/by-tag/${encodeURIComponent(tag)}`,
    }),
  }),
});
```

**Export hooks** (mirror deedsApi lines 43-48):
```typescript
export const {
  useGetMeQuery,
  useUpdateMeMutation,
  useDeleteMeMutation,
  useGetUserByTagQuery,
} = usersApi;
```

**Post-PATCH auth sync:** After `updateMe` success, dispatch `setUser` from `authSlice` (lines 34-36) so `AppNav` `@tag` updates — same as login/register:
```typescript
setUser(state, action: PayloadAction<UserPublic | null>) {
  state.user = action.payload;
},
```

**Backend contract:** `backend/src/users/users.controller.ts` — `PATCH /api/users/me`, `DELETE /api/users/me` (204), body `UpdateProfileDto` optional `displayName` | `tag`.

---

### `frontend/src/app/(app)/settings/page.tsx` (page, request-response)

**Analog:** `frontend/src/app/(app)/friends/page.tsx` (page orchestration + modal state)

**Page shell pattern** (friends/page.tsx lines 40-63):
```typescript
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-[28px] font-semibold leading-tight text-zinc-900 dark:text-zinc-50">
        Friends
      </h1>
      ...
      {removeTarget ? (
        <RemoveFriendModal
          friendshipId={removeTarget._id}
          friendTag={removeTarget.friend.tag}
          onClose={() => setRemoveTarget(null)}
        />
      ) : null}
    </div>
  );
```

**Apply to settings:** `"use client"`; title **Settings** with `text-xl` (UI-SPEC D-03, not 28px); `gap-8` between title → profile card → delete trigger; `useState` for delete modal open; compose `SettingsProfileCard` + `DeleteAccountModal`.

**Current stub to replace** (settings/page.tsx lines 1-12):
```typescript
export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-xl font-semibold leading-tight text-zinc-900 dark:text-zinc-50">
        Settings
      </h1>
      <p className="text-base font-normal leading-normal text-zinc-500 dark:text-zinc-400">
        Profile and account settings will be available here soon.
      </p>
    </div>
  );
}
```

**Loading branch:** Mirror deeds/friends early return but skeleton inside card area (UI-SPEC) or centered loading in card — use `useGetMeQuery` `isLoading`.

---

### `frontend/src/components/settings/*` (new — profile form / card)

**Analog:** `frontend/src/components/friends/AddFriendForm.tsx` (card + form + inline errors) + `frontend/src/app/(auth)/register/page.tsx` (409 `mapConflictError`)

**Card wrapper** (AddFriendForm.tsx lines 92-94):
```typescript
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
```

**Submit + normalize tag** (AddFriendForm.tsx lines 44-49):
```typescript
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setFieldErrors({});

    try {
      await addFriend({ tag: normalizeTag(tag) }).unwrap();
```

**400 inline mapping** (AddFriendForm.tsx lines 58-70):
```typescript
      if (status === 400) {
        const data = (error as { data?: { message?: string | string[] } }).data;
        if (data?.message) {
          const mapped = mapFriendTagValidationErrors(data.message);
          setFieldErrors(
            Object.keys(mapped).length > 0
              ? mapped
              : { tag: "Enter a valid tag" },
          );
        } else {
          setFieldErrors({ tag: "Enter a valid tag" });
        }
        return;
      }
```

**Apply to settings:** Use `mapValidationErrors` for 400 on `displayName` / `tag` (Phase 1 utility, `validation-errors.ts` lines 5-19). Use `mapConflictError` for 409 tag (register/page.tsx lines 72-77):
```typescript
      if (status === 409) {
        const message = getApiMessage(error);
        if (message) {
          setFieldErrors(mapConflictError(message));
        }
        return;
      }
```

**Email read-only row** (UI-SPEC D-02 — not TextField):
```tsx
<div className="flex min-h-[44px] flex-col gap-2">
  <span className="text-sm font-normal text-zinc-500 dark:text-zinc-400">Email</span>
  <span className="text-base font-normal text-zinc-900 dark:text-zinc-50">{email}</span>
</div>
```

**Pristine Save disabled:** Track initial `displayName` / `tag` from query data; disable `PrimaryButton` when values unchanged or `isLoading` (DeedCard edit uses `disabled={isUpdating}`, lines 111-112).

**Partial PATCH body:** Only include changed keys in `updateMe` body (backend `assertAtLeastOneField`).

**Non-field errors:** Local `formError` + `ErrorBanner` with `onDismiss` (LoginPageContent.tsx lines 81-85).

**Success:** `dispatch(setUser(result))` on unwrap; optional reset baseline for pristine check.

**Suggested files:** `SettingsProfileCard.tsx` (card + form), or split `ProfileForm.tsx` if page stays thin.

---

### `frontend/src/components/settings/DeleteAccountModal.tsx` (modal, request-response)

**Analog:** `frontend/src/components/deeds/DeleteDeedModal.tsx` — **exact** structure

**Imports + mutation** (lines 1-20):
```typescript
"use client";

import { useEffect, useId, useRef } from "react";
import { TextButton } from "@/components/ui/TextButton";
import { useDeleteDeedMutation } from "@/store/deedsApi";
```

**Replace with:** `useDeleteMeMutation` from `usersApi`.

**Escape + focus on Keep** (lines 22-33):
```typescript
  useEffect(() => {
    keepButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);
```

**Confirm handler — add post-delete session cleanup** (extend DeleteDeedModal lines 35-42):
```typescript
  const handleConfirm = async () => {
    try {
      await deleteMe().unwrap();
      dispatch(clearSession());
      router.replace("/login?reason=account_deleted");
    } catch {
      // Errors surface via baseApi ErrorBanner
    }
  };
```

**Copy swap** (lines 55-80): Title **Delete account?**, body **This can't be undone.**, primary **Delete account** / **Deleting…**, secondary **Keep account**.

**Page entry** (D-12): `TextButton variant="destructive"` below card with `gap-8` — same as DeedCard delete trigger (DeedCard.tsx lines 184-186).

---

### `frontend/src/components/ui/SkeletonCard.tsx` (or inline skeletons)

**Analog:** `frontend/src/components/deeds/DeedCard.tsx` + `frontend/src/components/friends/FriendCard.tsx` (card geometry, no data)

**Deed card shell** (DeedCard.tsx lines 31-32):
```typescript
    <article className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
```

**Friend card shell** (FriendCard.tsx lines 16-17):
```typescript
    <article className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
```

**Pulse bars** (UI-SPEC — no existing `animate-pulse` in repo; first use):
```tsx
<div className="h-5 w-2/3 rounded bg-zinc-200 animate-pulse dark:bg-zinc-700" />
<div className="mt-2 h-4 w-full rounded bg-zinc-200 animate-pulse dark:bg-zinc-700" />
```

**Props pattern:** `variant: "deed" | "friend"` for bar layout; render **3** cards in `gap-4` stack; parent sets `aria-busy="true"` on list container (UI-SPEC).

---

### `frontend/src/components/feedback/ListErrorState.tsx` (or inline — discretion)

**Analog:** `frontend/src/app/(app)/deeds/page.tsx` + `frontend/src/app/(app)/friends/page.tsx` (current `isError` branches)

**Deeds error block** (deeds/page.tsx lines 23-34):
```typescript
  if (isError) {
    return (
      <div className="flex flex-col gap-8">
        <h1 className="text-xl font-semibold leading-tight text-zinc-900 dark:text-zinc-50">
          My Deeds
        </h1>
        <p className="text-center text-base font-normal text-zinc-500 dark:text-zinc-400">
          Could not load your deeds. Check your connection and try again.
        </p>
      </div>
    );
  }
```

**Upgrade per UI-SPEC D-17:** Keep page title visible; centered block with `text-base font-semibold` heading (**Couldn't load your deeds.** / **Couldn't load friends.**), helper, `TextButton` **Try again** calling `refetch()` from `useGetDeedsQuery` / `useGetFriendsQuery`.

**Extracted component signature (if reusable):**
```typescript
interface ListErrorStateProps {
  heading: string;
  onRetry: () => void;
}
```

**Friends empty copy already matches D-16** (FriendsList.tsx lines 14-20) — friends page may rely on list component when not error.

---

### `frontend/src/app/(app)/deeds/page.tsx` (page, modify — UX-04)

**Analog:** Self + skeleton/error patterns above

**Query hook destructuring** (lines 7-8):
```typescript
export default function DeedsPage() {
  const { data: deeds = [], isLoading, isError } = useGetDeedsQuery();
```

**Add:** `refetch` from hook; replace loading branch (lines 10-20) with title + `<DeedSkeletonList />` or 3× `SkeletonCard variant="deed"`; replace `isError` early return with `ListErrorState` or inline retry block; keep empty copy (lines 44-52) only when `!isError && isEmpty`.

**Empty copy** (already aligned with UI-SPEC):
```typescript
          <h2 className="text-base font-semibold leading-normal text-zinc-900 dark:text-zinc-50">
            No deeds yet
          </h2>
          <p className="text-sm font-normal text-zinc-500 dark:text-zinc-400">
            Add your first good deed below.
          </p>
```

---

### `frontend/src/app/(app)/friends/page.tsx` (page, modify — UX-04)

**Analog:** Self + same UX-04 pattern as deeds

**Loading branch** (lines 14-24): Replace centered "Loading…" with skeleton stack; keep `text-[28px]` title (Phase 3).

**Error branch** (lines 27-37): Add `refetch` + **Try again**; copy **Couldn't load friends.** per UI-SPEC.

**Do not change** `/friends/[tag]` (D-15).

**Modal orchestration unchanged** (lines 55-61).

---

## Shared Patterns

### RTK Query inject + side-effect imports

**Source:** `frontend/src/store/index.ts` (lines 5-8)
```typescript
import "./deedsApi";
import "./friendsApi";
import "./usersApi";
```

Ensure `usersApi` exports are imported once; extend endpoints in place.

### Bearer auth + 401 global handler

**Source:** `frontend/src/store/baseApi.ts` (lines 15-24, 42-46)
```typescript
  prepareHeaders: (headers, { getState }) => {
    const token =
      (getState() as RootState).auth.accessToken ?? getStoredToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
```
```typescript
    if (status === 401) {
      api.dispatch(clearSession());
      if (typeof window !== "undefined") {
        window.location.href = "/login?reason=session_expired";
      }
```

`deleteMe` success must call `clearSession` **before** navigation so 401 handler does not race.

### Inline 400 / 409 vs global banner

**Source:** `frontend/src/lib/api/validation-errors.ts`
```typescript
export function mapValidationErrors(
  message: string | string[],
): Partial<Record<FieldKey, string>> { ... }

export function mapConflictError(
  message: string,
): Partial<Record<"email" | "tag", string>> { ... }
```

**Apply to:** Settings profile form only for field-level; 5xx / network on PATCH → `setBannerMessage` via baseApi (lines 47-58).

### Tag normalization

**Source:** `frontend/src/lib/utils/normalize-tag.ts` (lines 3-5)
```typescript
export function normalizeTag(tag: string): string {
  return tag.trim().toLowerCase().replace(/^@/, "");
}
```

Use on settings tag submit (D-08); same as AddFriendForm.

### Destructive modal UX

**Source:** `DeleteDeedModal.tsx` / `RemoveFriendModal.tsx` — no success toast; errors via global banner; `Keep *` secondary gets initial focus.

### Login redirect + dismissible info banner

**Source:** `frontend/src/app/(auth)/login/LoginPageContent.tsx` (lines 36-37, 73-79)
```typescript
  const sessionExpired =
    searchParams.get("reason") === "session_expired" && !sessionDismissed;
```
```typescript
      {sessionExpired ? (
        <div className="mb-4 w-full max-w-[420px]">
          <ErrorBanner
            message="Session expired — please log in again."
            onDismiss={() => setSessionDismissed(true)}
          />
        </div>
      ) : null}
```

**Apply for account deleted (D-13):** `router.replace("/login?reason=account_deleted")`; add branch for `account_deleted` with dismissible info banner (not red error styling — use same `ErrorBanner` or muted info variant per UI-SPEC).

### Session hydrate (settings data source)

**Source:** `frontend/src/components/providers/StoreProvider.tsx` (lines 18-30)
```typescript
        try {
          const user = await triggerGetMe().unwrap();
          dispatch(setCredentials({ accessToken: token, user }));
        } catch {
          dispatch(clearSession());
        }
```

Settings may use `useGetMeQuery` on mount for fresh data; align tag invalidation with `providesTags: ["User"]`.

### Form primitives

**Source:** `TextField`, `PrimaryButton`, `TextButton` — unchanged from Phase 1–3.

**Destructive text trigger:** `TextButton variant="destructive"` (TextButton.tsx lines 16-18).

---

## No Analog Found

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `frontend/src/components/ui/SkeletonCard.tsx` | component | transform | No skeleton/loading placeholders in codebase yet; card shells from DeedCard/FriendCard + UI-SPEC pulse bars |

---

## Metadata

**Analog search scope:** `frontend/src/store/`, `frontend/src/app/(app)/`, `frontend/src/components/{deeds,friends,ui,feedback,auth,settings}/`, `frontend/src/lib/api/`, `backend/src/users/`
**Files scanned:** 28
**Pattern extraction date:** 2026-06-04

---

## PATTERN MAPPING COMPLETE

**Phase:** 4 - Profile, Settings & Polish
**Files classified:** 9
**Analogs found:** 8 / 9

### Coverage
- Files with exact analog: 4 (`usersApi` extend, `DeleteAccountModal`, `deeds/page`, `friends/page`)
- Files with role-match analog: 4 (`settings/page`, `settings/*`, `ListErrorState`, skeleton via card shells)
- Files with no analog: 1 (`SkeletonCard` pulse UI — new pattern, layout from existing cards)

### Key Patterns Identified
- Extend RTK Query via `baseApi.injectEndpoints` mirroring `deedsApi` PATCH/DELETE and `authApi` `GET users/me`; sync `authSlice.setUser` after profile PATCH.
- Profile settings form copies `AddFriendForm` card + `register` 409/`mapValidationErrors` error handling; email as label + plain text.
- Delete account modal is a verbatim copy of `DeleteDeedModal` with `clearSession` + `/login?reason=account_deleted`.
- List UX-04: replace loading early-return with skeleton cards; upgrade `isError` to heading + `refetch` retry; never show empty state on error.

### File Created
`.planning/phases/04-profile-settings-polish/04-PATTERNS.md`

### Ready for Planning
Pattern mapping complete. Planner can reference analog patterns in PLAN.md files.
