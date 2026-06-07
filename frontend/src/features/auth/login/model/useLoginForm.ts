"use client";

import { useRouter } from "next/navigation";
import { useLoginMutation } from "@/features/auth/api";
import {
  establishAuthSession,
  mapConflictError,
  mapValidationErrors,
  useAppDispatch,
} from "@/shared/api";
import { useMutationForm } from "@/shared/lib";
import { routes } from "@/shared/config";
import {
  loginSchema,
  zodValidator,
  type LoginFormValues,
} from "@/shared/validation";

const validateLogin = zodValidator<LoginFormValues>(loginSchema);

export function useLoginForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const form = useMutationForm({
    initialValues: { email: "", password: "" } as LoginFormValues,
    isSubmitting: isLoading,
    validate: validateLogin,
    submit: (values) =>
      login({ email: values.email, password: values.password }).unwrap(),
    onSuccess: (result) => {
      establishAuthSession(dispatch, {
        accessToken: result.accessToken,
        user: result.user,
      });
      router.push(routes.deeds);
    },
    mappers: { map400: mapValidationErrors, map409: mapConflictError },
    defaultFormError: "Invalid credentials",
  });

  return {
    email: form.values.email,
    setEmail: (value: string) => form.setValue("email", value),
    password: form.values.password,
    setPassword: (value: string) => form.setValue("password", value),
    fieldErrors: form.fieldErrors,
    formError: form.formError,
    setFormError: form.setFormError,
    isLoading: form.isSubmitting,
    handleSubmit: form.handleSubmit,
  };
}

export type LoginFormState = ReturnType<typeof useLoginForm>;
