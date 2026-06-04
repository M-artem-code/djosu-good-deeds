---
phase: 02-my-deeds
reviewed: 2026-06-04T12:00:00Z
depth: standard
files_reviewed: 9
files_reviewed_list:
  - frontend/src/lib/types/deed.ts
  - frontend/src/store/deedsApi.ts
  - frontend/src/lib/api/validation-errors.ts
  - frontend/src/components/deeds/AddDeedForm.tsx
  - frontend/src/components/deeds/DeedCard.tsx
  - frontend/src/components/deeds/DeedList.tsx
  - frontend/src/components/deeds/DeleteDeedModal.tsx
  - frontend/src/components/deeds/StatusBadge.tsx
  - frontend/src/app/(app)/deeds/page.tsx
findings:
  critical: 1
  warning: 6
  info: 2
  total: 9
status: issues_found
---

# Phase 2: Code Review Report

**Reviewed:** 2026-06-04  
**Depth:** standard  
**Files Reviewed:** 9  
**Status:** issues_found

## Summary

Phase 2 my-deeds frontend was reviewed from `02-01`–`02-03` SUMMARY key-files plus the requested focus paths (`deeds/` components, `deedsApi.ts`, `deed.ts`, `validation-errors.ts`, and `/deeds` page integration). RTK Query wiring, auth headers, and React escaping look sound. The main correctness gap is **list fetch failures masquerading as an empty library** on `/deeds`. Secondary issues are **description clearing on edit**, **silent status-update failures**, **UI-SPEC focus-trap gap** on the delete modal, and **missing client-side length guards** despite documented API limits.

## Critical Issues

### CR-01: Failed `getDeeds` shows empty state instead of error

**File:** `frontend/src/app/(app)/deeds/page.tsx:8-40`  
**Issue:** `useGetDeedsQuery()` only branches on `isLoading`. On network/5xx failure, `data` is `undefined`, defaulted to `[]`, so `isEmpty` is true and the UI shows “No deeds yet” plus an expanded add form — indistinguishable from a real empty account and contrary to UI-SPEC (“Non-field errors → ErrorBanner”).  
**Fix:**

```tsx
const { data: deeds = [], isLoading, isError } = useGetDeedsQuery();

if (isLoading) { /* ... */ }

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

Ensure `baseQueryWithReauth` still dispatches `ErrorBanner` for 5xx/FETCH_ERROR (already does); avoid rendering `AddDeedForm` / empty copy when `isError`.

## Warnings

### WR-01: Editing cannot clear an existing description

**File:** `frontend/src/components/deeds/DeedCard.tsx:40-45`  
**Issue:** Save sends `description: description.trim() || undefined`. Omitted `description` leaves the PATCH body without that key; backend `updateByOwner` only assigns when `dto.description !== undefined`, and the DTO `@Transform` turns `""` into `undefined`. Users who delete all text in the textarea cannot remove a stored description.  
**Fix:** Align with backend contract — if the API should support clearing, send an explicit sentinel the backend maps to unset (e.g. `description: ""` only if the server treats empty string as clear, or extend backend to accept `null`). Until then, document in UI or disable clearing. Example if backend accepts empty string before transform:

```tsx
body: {
  title: title.trim(),
  description: description.trim() === "" ? "" : description.trim() || undefined,
},
```

(Requires backend `UpdateDeedDto` to persist cleared descriptions — verify/transform before shipping.)

### WR-02: Status toggle errors are silent (except 5xx banner)

**File:** `frontend/src/components/deeds/DeedCard.tsx:107-113`  
**Issue:** `handleMarkStatus` has no `catch`; 404/400 after a failed PATCH only reset `isMarkingStatus`. Badge and section stay unchanged with no inline or banner feedback (baseApi banner runs only for 401 redirect and 5xx/FETCH_ERROR).  
**Fix:**

```tsx
} catch (error) {
  const status =
    error && typeof error === "object" && "status" in error
      ? (error as { status?: number }).status
      : undefined;
  if (status === 404) {
    // optional: rely on invalidatesTags refetch; or dispatch setBannerMessage
  }
}
```

Or invalidate list and surface a short banner message for non-400 failures.

### WR-03: Delete modal does not trap focus (UI-SPEC violation)

**File:** `frontend/src/components/deeds/DeleteDeedModal.tsx:22-33`  
**Issue:** UI-SPEC interaction state requires “focus trapped” while the dialog is open. Implementation only focuses “Keep deed” on mount; Tab can move focus to the page behind the overlay.  
**Fix:** Add a focus trap (e.g. `focus-trap-react` or manual tab-cycle between the two buttons) and `aria-hidden` on the main document while open.

### WR-04: No client-side max length on title/description

**File:** `frontend/src/components/deeds/AddDeedForm.tsx:78-92`, `frontend/src/components/deeds/DeedCard.tsx:68-82`, `frontend/src/components/ui/TextAreaField.tsx:28-37`  
**Issue:** UI-SPEC documents Title max 120 and Description max 500. Inputs have no `maxLength`; users only discover limits after a 400 round-trip.  
**Fix:** Pass `maxLength={120}` on title `TextField` and `maxLength={500}` on description `TextAreaField` (extend component props if needed).

### WR-05: Deeds with unknown `status` disappear from the list UI

**File:** `frontend/src/components/deeds/DeedList.tsx:16-17`  
**Issue:** Sections filter strictly `planned` and `done`. Any unexpected API value is dropped from both sections with no fallback row or error.  
**Fix:** Add an “Other” section, or render unclassified deeds in a default bucket and log in dev.

### WR-06: `mapDeedValidationErrors` uses fragile substring matching

**File:** `frontend/src/lib/api/validation-errors.ts:38-44`  
**Issue:** `lower.includes("title")` / `"description"` can mis-attribute messages that mention both fields or unrelated words (e.g. “entitle”). Auth mapper has the same pattern; deed mapper uses `if` / `else if` so a single message mentioning both fields only maps to `title`.  
**Fix:** Prefer structured Nest/class-validator field keys if the API exposes them; otherwise map known message prefixes from backend E2E fixtures.

## Info

### IN-01: Edit form state does not sync if `deed` changes while editing

**File:** `frontend/src/components/deeds/DeedCard.tsx:29-30`  
**Issue:** `useState(deed.title)` initializes once per mount. A concurrent list refetch updating the same `_id` while the form is open leaves stale fields until cancel/remount.  
**Fix:** `useEffect` to sync when `deed.updatedAt` changes, or remount with `key={deed.updatedAt}`.

### IN-02: Duplicate validation messages overwrite prior field error

**File:** `frontend/src/lib/api/validation-errors.ts:38-44`  
**Issue:** Multiple array entries for the same field overwrite `errors.title` / `errors.description` in loop order.  
**Fix:** Concatenate or keep the first message per field.

---

_Reviewed: 2026-06-04_  
_Reviewer: Claude (gsd-code-reviewer)_  
_Depth: standard_
