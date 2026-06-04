import {
  PrimaryButton,
  TextAreaField,
  TextButton,
  TextField,
} from "@/shared/ui";
import type { FormEvent } from "react";

type AddDeedFormState = {
  expanded: boolean;
  reveal: () => void;
  handleCollapse: () => void;
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  fieldErrors: Partial<Record<"title" | "description", string>>;
  isLoading: boolean;
  handleSubmit: (event: FormEvent) => void;
};

interface AddDeedFormProps {
  form: AddDeedFormState;
}

export function AddDeedForm({ form }: AddDeedFormProps) {
  if (!form.expanded) {
    return (
      <PrimaryButton type="button" onClick={form.reveal}>
        Add deed
      </PrimaryButton>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
      <form className="flex flex-col gap-4" onSubmit={form.handleSubmit}>
        <TextField
          id="add-deed-title"
          label="Title"
          value={form.title}
          onChange={form.setTitle}
          error={form.fieldErrors.title}
        />
        <TextAreaField
          id="add-deed-description"
          label="Description"
          value={form.description}
          onChange={form.setDescription}
          rows={3}
          helperText="Optional, up to 500 characters"
          error={form.fieldErrors.description}
        />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <PrimaryButton type="submit" disabled={form.isLoading}>
            {form.isLoading ? "Adding…" : "Add deed"}
          </PrimaryButton>
          <TextButton
            type="button"
            onClick={form.handleCollapse}
            disabled={form.isLoading}
          >
            Cancel
          </TextButton>
        </div>
      </form>
    </div>
  );
}
