"use client";

import { useRouter } from "next/navigation";
import { useRegisterMutation } from "@/features/auth/api";
import {
  establishAuthSession,
  mapConflictError,
  mapValidationErrors,
  useAppDispatch,
} from "@/shared/api";
import { normalizeTag, useMutationForm } from "@/shared/lib";
import { routes } from "@/shared/config";
import {
  registerSchema,
  zodValidator,
  type RegisterFormValues,
} from "@/shared/validation";

const validateRegister = zodValidator<RegisterFormValues>(registerSchema);

export function useRegisterForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [register, { isLoading }] = useRegisterMutation();

  const form = useMutationForm({
    initialValues: {
      email: "",
      password: "",
      displayName: "",
      tag: "",
    } as RegisterFormValues,
    isSubmitting: isLoading,
    validate: validateRegister,
    submit: (values) =>
      register({
        email: values.email,
        password: values.password,
        displayName: values.displayName,
        tag: normalizeTag(values.tag),
      }).unwrap(),
    onSuccess: (result) => {
      establishAuthSession(dispatch, {
        accessToken: result.accessToken,
        user: result.user,
      });
      router.push(routes.deeds);
    },
    mappers: { map400: mapValidationErrors, map409: mapConflictError },
    handle409: true,
    defaultFormError: "Something went wrong. Try again or sign in again.",
  });

  return {
    email: form.values.email,
    setEmail: (value: string) => form.setValue("email", value),
    password: form.values.password,
    setPassword: (value: string) => form.setValue("password", value),
    displayName: form.values.displayName,
    setDisplayName: (value: string) => form.setValue("displayName", value),
    tag: form.values.tag,
    setTag: (value: string) => form.setValue("tag", value),
    fieldErrors: form.fieldErrors,
    formError: form.formError,
    setFormError: form.setFormError,
    isLoading: form.isSubmitting,
    handleSubmit: form.handleSubmit,
  };
}

export type RegisterFormState = ReturnType<typeof useRegisterForm>;
