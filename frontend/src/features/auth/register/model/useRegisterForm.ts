"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useRegisterMutation } from "@/features/auth/api";
import {
  establishAuthSession,
  handleAuthMutationError,
  useAppDispatch,
} from "@/shared/api";

export function useRegisterForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [register, { isLoading }] = useRegisterMutation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [tag, setTag] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setFieldErrors({});
    setFormError(null);

    try {
      const result = await register({
        email,
        password,
        displayName,
        tag: tag.trim().toLowerCase(),
      }).unwrap();
      establishAuthSession(dispatch, {
        accessToken: result.accessToken,
        user: result.user,
      });
      router.push("/deeds");
    } catch (error) {
      handleAuthMutationError(error, {
        onFieldErrors: setFieldErrors,
        onFormError: setFormError,
        defaultFormError:
          "Something went wrong. Try again or sign in again.",
        handle409: true,
      });
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    displayName,
    setDisplayName,
    tag,
    setTag,
    fieldErrors,
    formError,
    setFormError,
    isLoading,
    handleSubmit,
  };
}

export type RegisterFormState = ReturnType<typeof useRegisterForm>;
