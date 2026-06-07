"use client";

import type { FormEvent } from "react";
import type { UserPublic } from "@/entities/user";
import {
  mapConflictError,
  mapValidationErrors,
  setUser,
  useAppDispatch,
} from "@/shared/api";
import { normalizeTag, useMutationForm } from "@/shared/lib";
import {
  profileSchema,
  zodValidator,
  type ProfileFormValues,
} from "@/shared/validation";
import { useUpdateMeMutation } from "@/entities/user";

const validateProfile = zodValidator<ProfileFormValues>(profileSchema);

export function useProfileForm(user: UserPublic) {
  const dispatch = useAppDispatch();
  const [updateMe, { isLoading }] = useUpdateMeMutation();

  const form = useMutationForm({
    initialValues: {
      displayName: user.displayName,
      tag: user.tag,
    } as ProfileFormValues,
    isSubmitting: isLoading,
    validate: validateProfile,
    submit: (values) => {
      const body: { displayName?: string; tag?: string } = {};
      const trimmedDisplayName = values.displayName.trim();
      const normalizedTag = normalizeTag(values.tag);
      if (trimmedDisplayName !== user.displayName.trim()) {
        body.displayName = trimmedDisplayName;
      }
      if (normalizedTag !== user.tag) {
        body.tag = normalizedTag;
      }
      return updateMe(body).unwrap();
    },
    onSuccess: (updatedUser) => {
      dispatch(setUser(updatedUser));
      form.reset({
        displayName: updatedUser.displayName,
        tag: updatedUser.tag,
      });
    },
    mappers: { map400: mapValidationErrors, map409: mapConflictError },
    handle409: true,
    defaultFormError: "Something went wrong. Try again.",
  });

  const isDirty =
    form.values.displayName.trim() !== user.displayName.trim() ||
    normalizeTag(form.values.tag) !== user.tag;
  const canSave = isDirty && !form.isSubmitting;

  const handleSubmit = (event: FormEvent) => {
    if (!canSave) {
      event.preventDefault();
      return;
    }
    return form.handleSubmit(event);
  };

  return {
    displayName: form.values.displayName,
    setDisplayName: (value: string) => form.setValue("displayName", value),
    tag: form.values.tag,
    setTag: (value: string) => form.setValue("tag", value),
    fieldErrors: form.fieldErrors,
    formError: form.formError,
    setFormError: form.setFormError,
    isLoading: form.isSubmitting,
    canSave,
    handleSubmit,
  };
}
