import { PrimaryButton, TextField } from "@/shared/ui";
import type { RegisterFormState } from "../model/useRegisterForm";

interface RegisterFormProps {
  form: RegisterFormState;
}

export function RegisterForm({ form }: RegisterFormProps) {
  return (
    <form className="flex flex-col gap-4" onSubmit={form.handleSubmit}>
      <TextField
        id="email"
        label="Email"
        type="email"
        autoComplete="email"
        value={form.email}
        onChange={form.setEmail}
        error={form.fieldErrors.email}
      />
      <TextField
        id="password"
        label="Password"
        type="password"
        autoComplete="new-password"
        value={form.password}
        onChange={form.setPassword}
        error={form.fieldErrors.password}
      />
      <TextField
        id="displayName"
        label="Display name"
        autoComplete="name"
        value={form.displayName}
        onChange={form.setDisplayName}
        error={form.fieldErrors.displayName}
      />
      <div className="flex flex-col gap-2">
        <TextField
          id="tag"
          label="Username (tag)"
          autoComplete="username"
          value={form.tag}
          onChange={form.setTag}
          error={form.fieldErrors.tag}
          prefix="@"
        />
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          3–32 characters: lowercase letters, numbers, underscore
        </p>
      </div>
      <PrimaryButton type="submit" disabled={form.isLoading}>
        {form.isLoading ? "Creating account…" : "Create account"}
      </PrimaryButton>
    </form>
  );
}
