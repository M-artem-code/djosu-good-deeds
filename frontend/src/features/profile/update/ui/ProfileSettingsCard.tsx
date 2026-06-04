import type { FormEvent } from "react";
import { FormErrorBanner, PrimaryButton, TextField } from "@/shared/ui";
import type { UserPublic } from "@/entities/user";

export type ProfileFormState = {
  displayName: string;
  setDisplayName: (value: string) => void;
  tag: string;
  setTag: (value: string) => void;
  fieldErrors: Partial<Record<"displayName" | "tag", string>>;
  formError: string | null;
  setFormError: (value: string | null) => void;
  isLoading: boolean;
  canSave: boolean;
  handleSubmit: (event: FormEvent) => void;
};

interface ProfileSettingsCardProps {
  user: UserPublic;
  form: ProfileFormState;
}

export function ProfileSettingsCard({ user, form }: ProfileSettingsCardProps) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
      <FormErrorBanner
        message={form.formError}
        onDismiss={() => form.setFormError(null)}
      />
      <form className="flex flex-col gap-4" onSubmit={form.handleSubmit}>
        <div className="flex flex-col gap-1">
          <span className="text-sm font-normal text-zinc-500 dark:text-zinc-400">
            Email
          </span>
          <span className="text-base font-normal text-zinc-900 dark:text-zinc-50">
            {user.email}
          </span>
        </div>
        <TextField
          id="profile-display-name"
          label="Display name"
          value={form.displayName}
          onChange={form.setDisplayName}
          error={form.fieldErrors.displayName}
        />
        <TextField
          id="profile-tag"
          label="Tag"
          value={form.tag}
          onChange={form.setTag}
          error={form.fieldErrors.tag}
        />
        <PrimaryButton type="submit" disabled={!form.canSave}>
          {form.isLoading ? "Saving…" : "Save changes"}
        </PrimaryButton>
      </form>
    </div>
  );
}
