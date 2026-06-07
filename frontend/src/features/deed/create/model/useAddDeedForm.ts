"use client";

import { mapDeedFieldErrors } from "@/shared/api";
import { useCollapsibleForm, useMutationForm } from "@/shared/lib";
import {
  deedSchema,
  zodValidator,
  type DeedFormValues,
} from "@/shared/validation";
import { useCreateDeedMutation } from "@/entities/deed";

const validateDeed = zodValidator<DeedFormValues>(deedSchema);

export function useAddDeedForm(deedCount: number) {
  const [createDeed, { isLoading }] = useCreateDeedMutation();
  const { expanded, reveal, collapse } = useCollapsibleForm(deedCount);

  const form = useMutationForm({
    initialValues: { title: "", description: "" } as DeedFormValues,
    isSubmitting: isLoading,
    validate: validateDeed,
    submit: (values) =>
      createDeed({
        title: values.title.trim(),
        description: values.description.trim() || undefined,
      }).unwrap(),
    onSuccess: () => {
      form.reset();
      collapse();
    },
    mappers: { map400: mapDeedFieldErrors },
  });

  const handleCollapse = () => {
    collapse();
    form.reset();
  };

  return {
    expanded,
    reveal,
    handleCollapse,
    title: form.values.title,
    setTitle: (value: string) => form.setValue("title", value),
    description: form.values.description,
    setDescription: (value: string) => form.setValue("description", value),
    fieldErrors: form.fieldErrors,
    isLoading: form.isSubmitting,
    handleSubmit: form.handleSubmit,
  };
}
