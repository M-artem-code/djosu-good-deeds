"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { FormErrorBanner } from "@/shared/ui";
import { AUTH_FORM_BANNER_CLASS } from "../lib/auth-banner-class";

export function AuthReasonBanners() {
  const searchParams = useSearchParams();
  const [sessionDismissed, setSessionDismissed] = useState(false);
  const [accountDeletedDismissed, setAccountDeletedDismissed] = useState(false);

  const reason = searchParams?.get("reason");
  const sessionExpired = reason === "session_expired" && !sessionDismissed;
  const accountDeleted = reason === "account_deleted" && !accountDeletedDismissed;

  return (
    <>
      {sessionExpired ? (
        <FormErrorBanner
          message="Session expired — please log in again."
          onDismiss={() => setSessionDismissed(true)}
          className={AUTH_FORM_BANNER_CLASS}
        />
      ) : null}
      {accountDeleted ? (
        <FormErrorBanner
          message="Your account was deleted."
          onDismiss={() => setAccountDeletedDismissed(true)}
          className={AUTH_FORM_BANNER_CLASS}
        />
      ) : null}
    </>
  );
}
