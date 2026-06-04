"use client";

import { FormEvent, useState } from "react";
import {
  handleFormMutationError,
  mapDeedValidationErrors,
} from "@/shared/api";
import type { DeedPublic } from "@/entities/deed";
import { useUpdateDeedMutation } from "@/entities/deed";

function mapDeedFieldErrors(message: string | string[]) {
  const mapped = mapDeedValidationErrors(message);
  return Object.keys(mapped).length > 0
    ? mapped
    : { title: "Title is required" as const };
}

export function useDeedEditForm(deed: DeedPublic, onSaved: () => void) {
  const [updateDeed, { isLoading }] = useUpdateDeedMutation();
  const [title, setTitle] = useState(deed.title);
  const [description, setDescription] = useState(deed.description ?? "");
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<"title" | "description", string>>
  >({});

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setFieldErrors({});

    try {
      await updateDeed({
        id: deed._id,
        body: {
          title: title.trim(),
          description: description.trim() || undefined,
        },
      }).unwrap();
      onSaved();
    } catch (error) {
      handleFormMutationError(error, {
        onFieldErrors: (errors) =>
          setFieldErrors(errors as Partial<Record<"title" | "description", string>>),
        mappers: { map400: mapDeedFieldErrors },
      });
    }
  };

  return {
    title,
    setTitle,
    description,
    setDescription,
    fieldErrors,
    isLoading,
    handleSubmit,
  };
}
