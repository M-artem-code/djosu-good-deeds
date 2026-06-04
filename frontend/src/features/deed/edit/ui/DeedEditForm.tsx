"use client";

import { PrimaryButton, TextAreaField, TextButton, TextField } from "@/shared/ui";
import type { DeedPublic } from "@/entities/deed";
import { useDeedEditForm } from "../model/useDeedEditForm";

interface DeedEditFormProps {
  deed: DeedPublic;
  onCancelEdit: () => void;
}

export function DeedEditForm({ deed, onCancelEdit }: DeedEditFormProps) {
  const form = useDeedEditForm(deed, onCancelEdit);

  return (
    <article className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
      <form className="flex flex-col gap-4" onSubmit={form.handleSubmit}>
        <TextField
          id={`edit-title-${deed._id}`}
          label="Title"
          value={form.title}
          onChange={form.setTitle}
          error={form.fieldErrors.title}
        />
        <TextAreaField
          id={`edit-description-${deed._id}`}
          label="Description"
          value={form.description}
          onChange={form.setDescription}
          rows={3}
          helperText="Optional, up to 500 characters"
          error={form.fieldErrors.description}
        />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <PrimaryButton type="submit" disabled={form.isLoading}>
            {form.isLoading ? "Saving…" : "Save changes"}
          </PrimaryButton>
          <TextButton type="button" onClick={onCancelEdit} disabled={form.isLoading}>
            Cancel
          </TextButton>
        </div>
      </form>
    </article>
  );
}
