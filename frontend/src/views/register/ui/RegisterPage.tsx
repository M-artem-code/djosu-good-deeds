"use client";

import Link from "next/link";
import { AuthCard, AuthPageLayout, AuthSuspenseLayout } from "@/features/auth/layout";
import { RegisterForm, useRegisterForm } from "@/features/auth/register";
import { AUTH_FORM_BANNER_CLASS } from "@/features/auth/session-banners/lib/auth-banner-class";
import { FormErrorBanner } from "@/shared/ui";

function RegisterPageContent() {
  const form = useRegisterForm();

  return (
    <AuthPageLayout>
      <FormErrorBanner
        message={form.formError}
        onDismiss={() => form.setFormError(null)}
        className={AUTH_FORM_BANNER_CLASS}
      />
      <AuthCard title="Create your Djosu account">
        <RegisterForm form={form} />
        <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-400">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-zinc-950 dark:text-zinc-50">
            Sign in
          </Link>
        </p>
      </AuthCard>
    </AuthPageLayout>
  );
}

export default function RegisterPage() {
  return (
    <AuthSuspenseLayout>
      <RegisterPageContent />
    </AuthSuspenseLayout>
  );
}
