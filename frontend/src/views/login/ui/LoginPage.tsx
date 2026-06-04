"use client";

import Link from "next/link";
import { AuthCard, AuthPageLayout, AuthSuspenseLayout } from "@/features/auth/layout";
import { LoginForm, useLoginForm } from "@/features/auth/login";
import { AuthReasonBanners } from "@/features/auth/session-banners";
import { AUTH_FORM_BANNER_CLASS } from "@/features/auth/session-banners/lib/auth-banner-class";
import { FormErrorBanner } from "@/shared/ui";

function LoginPageContent() {
  const form = useLoginForm();

  return (
    <AuthPageLayout>
      <AuthReasonBanners />
      <FormErrorBanner
        message={form.formError}
        onDismiss={() => form.setFormError(null)}
        className={AUTH_FORM_BANNER_CLASS}
      />
      <AuthCard title="Sign in to Djosu">
        <LoginForm form={form} />
        <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-zinc-950 dark:text-zinc-50"
          >
            Create account
          </Link>
        </p>
      </AuthCard>
    </AuthPageLayout>
  );
}

export default function LoginPage() {
  return (
    <AuthSuspenseLayout>
      <LoginPageContent />
    </AuthSuspenseLayout>
  );
}
