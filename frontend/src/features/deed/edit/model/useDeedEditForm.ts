"use client";

import { mapDeedFieldErrors } from "@/shared/api";
import { useMutationForm } from "@/shared/lib";
import {
  deedSchema,
  zodValidator,
  type DeedFormValues,
} from "@/shared/validation";
import type { DeedPublic } from "@/entities/deed";
import { useUpdateDeedMutation } from "@/entities/deed";

const validateDeed = zodValidator<DeedFormValues>(deedSchema);

export function useDeedEditForm(deed: DeedPublic, onSaved: () => void) {
  const [updateDeed, { isLoading }] = useUpdateDeedMutation();

  const form = useMutationForm({
    initialValues: {
      title: deed.title,
      description: deed.description ?? "",
    } as DeedFormValues,
    isSubmitting: isLoading,
    validate: validateDeed,
    submit: (values) =>
      updateDeed({
        id: deed._id,
        body: {
          title: values.title.trim(),
          description: values.description.trim() || undefined,
        },
      }).unwrap(),
    onSuccess: onSaved,
    mappers: { map400: mapDeedFieldErrors },
  });

  return {
    title: form.values.title,
    setTitle: (value: string) => form.setValue("title", value),
    description: form.values.description,
    setDescription: (value: string) => form.setValue("description", value),
    fieldErrors: form.fieldErrors,
    isLoading: form.isSubmitting,
    handleSubmit: form.handleSubmit,
  };
}
