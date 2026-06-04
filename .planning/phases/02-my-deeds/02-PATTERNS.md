# Phase 2: My Deeds - Pattern Map

**Mapped:** 2026-06-04
**Files analyzed:** 18
**Analogs found:** 12 / 18

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `frontend/src/lib/types/deed.ts` | model / types | transform | `backend/src/deeds/dto/deed-public.dto.ts` | exact (mirror) |
| `frontend/src/store/deedsApi.ts` | service / API client | request-response | `frontend/src/store/authApi.ts` | exact (inject pattern) |
| `frontend/src/store/baseApi.ts` | config | pub-sub | `frontend/src/store/baseApi.ts` | exact (modify tagTypes) |
| `frontend/src/lib/api/validation-errors.ts` | utility | transform | `frontend/src/lib/api/validation-errors.ts` | exact (extend) |
| `frontend/src/components/ui/TextAreaField.tsx` | component | transform | `frontend/src/components/ui/TextField.tsx` | exact (textarea variant) |
| `frontend/src/components/deeds/StatusBadge.tsx` | component | transform | — | no analog |
| `frontend/src/components/deeds/DeedList.tsx` | component | transform | `frontend/src/app/(app)/deeds/page.tsx` | role-match |
| `frontend/src/components/deeds/DeedCard.tsx` | component | request-response | `frontend/src/components/auth/AuthCard.tsx` | partial (card surface) |
| `frontend/src/components/deeds/AddDeedForm.tsx` | component | request-response | `frontend/src/app/(auth)/register/page.tsx` | partial (form + mutation) |
| `frontend/src/components/deeds/DeleteDeedModal.tsx` | component | event-driven | — | no analog |
| `frontend/src/app/(app)/deeds/page.tsx` | component / page | CRUD | `frontend/src/app/(app)/deeds/page.tsx` | exact (replace stub) |

---

## Pattern Assignments

### `frontend/src/store/deedsApi.ts` (RTK Query inject)

**Analog:** `frontend/src/store/authApi.ts`

```typescript
export const deedsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDeeds: builder.query<DeedPublic[], void>({
      query: () => "deeds",
      providesTags: [{ type: "Deed", id: "LIST" }],
    }),
    createDeed: builder.mutation<DeedPublic, CreateDeedBody>({
      query: (body) => ({ url: "deeds", method: "POST", body }),
      invalidatesTags: [{ type: "Deed", id: "LIST" }],
    }),
    updateDeed: builder.mutation<DeedPublic, { id: string; body: UpdateDeedBody }>({
      query: ({ id, body }) => ({ url: `deeds/${id}`, method: "PATCH", body }),
      invalidatesTags: [{ type: "Deed", id: "LIST" }],
    }),
    deleteDeed: builder.mutation<void, string>({
      query: (id) => ({ url: `deeds/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Deed", id: "LIST" }],
    }),
  }),
});
```

**baseApi change:** Add `"Deed"` to `tagTypes` array alongside `"User"`.

**API contract (from `backend/test/deeds.e2e-spec.ts`):**
- `GET /api/deeds` → 200 `DeedPublic[]` (newest first)
- `POST /api/deeds` → 201 `DeedPublic`; body `{ title, description? }` only — no `status` in create
- `PATCH /api/deeds/:id` → 200 `DeedPublic`; partial `{ title?, description?, status? }`; empty body → 400
- `DELETE /api/deeds/:id` → 204 no body
- Whitespace title on POST/PATCH → 400

---

### `frontend/src/lib/types/deed.ts` (types)

**Analog:** `backend/src/deeds/dto/deed-public.dto.ts`

```typescript
export type DeedStatus = "planned" | "done";

export interface DeedPublic {
  _id: string;
  ownerId: string;
  title: string;
  description?: string;
  status: DeedStatus;
  createdAt: string;
  updatedAt: string;
}
```

---

### `frontend/src/lib/api/validation-errors.ts` (extend)

**Pattern:** Add `title` to field detection for deed forms.

```typescript
export function mapDeedValidationErrors(
  message: string | string[],
): Partial<Record<"title" | "description", string>> {
  const messages = Array.isArray(message) ? message : [message];
  const errors: Partial<Record<"title" | "description", string>> = {};
  for (const entry of messages) {
    const lower = entry.toLowerCase();
    if (lower.includes("title")) errors.title = entry;
    else if (lower.includes("description")) errors.description = entry;
  }
  return errors;
}
```

Keep existing `mapValidationErrors` for auth — do not break register/login.

---

### `frontend/src/components/deeds/DeedList.tsx` (sections)

**Pattern:** Split `deeds` array client-side:

```typescript
const planned = deeds.filter((d) => d.status === "planned");
const done = deeds.filter((d) => d.status === "done");
// Render section only when length > 0 (D-22)
```

Order preserved from API (no client sort).

---

### `frontend/src/components/deeds/DeedCard.tsx` (card surface)

**Analog:** AuthCard border/radius + register form state

- View: title, StatusBadge, optional `line-clamp-2` description
- Edit: local state for title/description; `useUpdateDeedMutation`
- Actions: TextButton row per UI-SPEC copy

---

### `frontend/src/components/deeds/DeleteDeedModal.tsx` (modal)

**Pattern:** Fixed overlay + dialog per `02-UI-SPEC.md` — no Radix/shadcn.

- `role="dialog"` `aria-modal="true"`
- Escape → same as Keep deed
- `useDeleteDeedMutation` on confirm

---

## Anti-Patterns (Phase 2)

| Anti-pattern | Why wrong | Do instead |
|--------------|-----------|--------------|
| Send `status` on POST create | API returns 400 | Status via PATCH only |
| Optimistic section move on Mark done | CONTEXT D-15 rejects | Disable button until refetch |
| Generic "Cancel" on delete modal | UI-SPEC forbidden | **Keep deed** |
| Toast on delete success | D-19 | Invalidate LIST tag only |
