"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useLoginMutation } from "@/features/auth/api";
import {
  establishAuthSession,
  handleAuthMutationError,
  useAppDispatch,
} from "@/shared/api";

export function useLoginForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setFieldErrors({});
    setFormError(null);

    try {
      const result = await login({ email, password }).unwrap();
      establishAuthSession(dispatch, {
        accessToken: result.accessToken,
        user: result.user,
      });
      router.push("/deeds");
    } catch (error) {
      handleAuthMutationError(error, {
        onFieldErrors: setFieldErrors,
        onFormError: setFormError,
        defaultFormError: "Invalid credentials",
      });
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    fieldErrors,
    formError,
    setFormError,
    isLoading,
    handleSubmit,
  };
}

export type LoginFormState = ReturnType<typeof useLoginForm>;
