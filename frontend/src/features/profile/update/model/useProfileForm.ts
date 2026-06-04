"use client";

import { FormEvent, useState } from "react";
import type { UserPublic } from "@/entities/user";
import {
  handleFormMutationError,
  mapConflictError,
  mapValidationErrors,
  setUser,
  useAppDispatch,
} from "@/shared/api";
import { normalizeTag } from "@/shared/lib";
import { useUpdateMeMutation } from "@/entities/user";

export function useProfileForm(user: UserPublic) {
  const dispatch = useAppDispatch();
  const [updateMe, { isLoading }] = useUpdateMeMutation();
  const [displayName, setDisplayName] = useState(user.displayName);
  const [tag, setTag] = useState(user.tag);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<"displayName" | "tag", string>>
  >({});
  const [formError, setFormError] = useState<string | null>(null);

  const normalizedTag = normalizeTag(tag);
  const trimmedDisplayName = displayName.trim();
  const isDirty =
    trimmedDisplayName !== user.displayName.trim() ||
    normalizedTag !== user.tag;
  const canSave = isDirty && !isLoading;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setFieldErrors({});
    setFormError(null);

    const body: { displayName?: string; tag?: string } = {};
    if (trimmedDisplayName !== user.displayName.trim()) {
      body.displayName = trimmedDisplayName;
    }
    if (normalizedTag !== user.tag) {
      body.tag = normalizedTag;
    }

    if (Object.keys(body).length === 0) {
      return;
    }

    try {
      const updatedUser = await updateMe(body).unwrap();
      dispatch(setUser(updatedUser));
      setDisplayName(updatedUser.displayName);
      setTag(updatedUser.tag);
    } catch (error) {
      handleFormMutationError(error, {
        onFieldErrors: (errors) =>
          setFieldErrors(
            errors as Partial<Record<"displayName" | "tag", string>>,
          ),
        onFormError: setFormError,
        defaultFormError: "Something went wrong. Try again.",
        mappers: {
          map400: mapValidationErrors,
          map409: mapConflictError,
        },
        handle409: true,
      });
    }
  };

  return {
    displayName,
    setDisplayName,
    tag,
    setTag,
    fieldErrors,
    formError,
    setFormError,
    isLoading,
    canSave,
    handleSubmit,
  };
}
