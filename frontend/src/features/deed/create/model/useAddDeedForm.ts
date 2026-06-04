"use client";

import { FormEvent, useState } from "react";
import {
  handleFormMutationError,
  mapDeedValidationErrors,
} from "@/shared/api";
import { useCollapsibleForm } from "@/shared/lib";
import { useCreateDeedMutation } from "@/entities/deed";

function mapDeedFieldErrors(message: string | string[]) {
  const mapped = mapDeedValidationErrors(message);
  return Object.keys(mapped).length > 0
    ? mapped
    : { title: "Title is required" as const };
}

export function useAddDeedForm(deedCount: number) {
  const [createDeed, { isLoading }] = useCreateDeedMutation();
  const { expanded, reveal, collapse } = useCollapsibleForm(deedCount);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<"title" | "description", string>>
  >({});

  const resetFields = () => {
    setTitle("");
    setDescription("");
    setFieldErrors({});
  };

  const handleCollapse = () => {
    collapse();
    resetFields();
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setFieldErrors({});

    try {
      await createDeed({
        title: title.trim(),
        description: description.trim() || undefined,
      }).unwrap();
      resetFields();
      collapse();
    } catch (error) {
      handleFormMutationError(error, {
        onFieldErrors: (errors) =>
          setFieldErrors(errors as Partial<Record<"title" | "description", string>>),
        mappers: { map400: mapDeedFieldErrors },
      });
    }
  };

  return {
    expanded,
    reveal,
    handleCollapse,
    title,
    setTitle,
    description,
    setDescription,
    fieldErrors,
    isLoading,
    handleSubmit,
  };
}
