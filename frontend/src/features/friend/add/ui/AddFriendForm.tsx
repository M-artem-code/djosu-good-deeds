import type { FormEvent } from "react";
import { PrimaryButton, TextButton, TextField } from "@/shared/ui";

export type AddFriendFormState = {
  expanded: boolean;
  reveal: () => void;
  handleCollapse: () => void;
  tag: string;
  setTag: (value: string) => void;
  fieldErrors: Partial<Record<"tag", string>>;
  isLoading: boolean;
  handleSubmit: (event: FormEvent) => void;
  showCancel: boolean;
};

interface AddFriendFormProps {
  form: AddFriendFormState;
}

export function AddFriendForm({ form }: AddFriendFormProps) {
  if (!form.expanded) {
    return (
      <PrimaryButton type="button" onClick={form.reveal}>
        Add friend
      </PrimaryButton>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
      <form className="flex flex-col gap-4" onSubmit={form.handleSubmit}>
        <TextField
          id="add-friend-tag"
          label="Their tag"
          value={form.tag}
          onChange={form.setTag}
          error={form.fieldErrors.tag}
        />
        <p className="text-sm font-normal text-zinc-500 dark:text-zinc-400">
          Enter their tag — no @ required
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <PrimaryButton type="submit" disabled={form.isLoading}>
            {form.isLoading ? "Adding…" : "Add friend"}
          </PrimaryButton>
          {form.showCancel ? (
            <TextButton
              type="button"
              onClick={form.handleCollapse}
              disabled={form.isLoading}
            >
              Cancel
            </TextButton>
          ) : null}
        </div>
      </form>
    </div>
  );
}
