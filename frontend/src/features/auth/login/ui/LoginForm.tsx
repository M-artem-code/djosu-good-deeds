import { PrimaryButton, TextField } from "@/shared/ui";
import type { LoginFormState } from "../model/useLoginForm";

interface LoginFormProps {
  form: LoginFormState;
}

export function LoginForm({ form }: LoginFormProps) {
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
        autoComplete="current-password"
        value={form.password}
        onChange={form.setPassword}
        error={form.fieldErrors.password}
      />
      <PrimaryButton type="submit" disabled={form.isLoading}>
        {form.isLoading ? "Signing in…" : "Sign in"}
      </PrimaryButton>
    </form>
  );
}
