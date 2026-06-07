"use client";

import { mapFriendTagFieldErrors } from "@/shared/api";
import { normalizeTag, useCollapsibleForm, useMutationForm } from "@/shared/lib";
import {
  addFriendSchema,
  zodValidator,
  type AddFriendFormValues,
} from "@/shared/validation";
import { useAddFriendMutation } from "@/entities/friend";

const validateAddFriend = zodValidator<AddFriendFormValues>(addFriendSchema);

export function useAddFriendForm(friendCount: number) {
  const [addFriend, { isLoading }] = useAddFriendMutation();
  const { expanded, reveal, collapse } = useCollapsibleForm(friendCount);

  const form = useMutationForm({
    initialValues: { tag: "" } as AddFriendFormValues,
    isSubmitting: isLoading,
    validate: validateAddFriend,
    submit: (values) => addFriend({ tag: normalizeTag(values.tag) }).unwrap(),
    onSuccess: () => {
      form.reset();
      collapse();
    },
    mappers: {
      map400: mapFriendTagFieldErrors,
      map404: (message) => ({ tag: message || "User not found" }),
      map409: (message) => ({ tag: message || "Already friends" }),
    },
    handle404: true,
    handle409: true,
  });

  const handleCollapse = () => {
    collapse();
    form.reset();
  };

  return {
    expanded,
    reveal,
    handleCollapse,
    tag: form.values.tag,
    setTag: (value: string) => form.setValue("tag", value),
    fieldErrors: form.fieldErrors,
    isLoading: form.isSubmitting,
    handleSubmit: form.handleSubmit,
    showCancel: friendCount > 0,
  };
}
