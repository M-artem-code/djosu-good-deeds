"use client";

import { FormEvent, useState } from "react";
import {
  handleFormMutationError,
  mapFriendTagValidationErrors,
} from "@/shared/api";
import { normalizeTag, useCollapsibleForm } from "@/shared/lib";
import { useAddFriendMutation } from "@/entities/friend";

function mapFriendTagFieldErrors(message: string | string[]) {
  const mapped = mapFriendTagValidationErrors(message);
  return Object.keys(mapped).length > 0
    ? mapped
    : { tag: "Enter a valid tag" as const };
}

export function useAddFriendForm(friendCount: number) {
  const [addFriend, { isLoading }] = useAddFriendMutation();
  const { expanded, reveal, collapse } = useCollapsibleForm(friendCount);
  const [tag, setTag] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<"tag", string>>>(
    {},
  );

  const resetFields = () => {
    setTag("");
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
      await addFriend({ tag: normalizeTag(tag) }).unwrap();
      resetFields();
      collapse();
    } catch (error) {
      handleFormMutationError(error, {
        onFieldErrors: (errors) =>
          setFieldErrors(errors as Partial<Record<"tag", string>>),
        mappers: {
          map400: mapFriendTagFieldErrors,
          map404: (message) => ({
            tag: message ?? "User not found",
          }),
          map409: (message) => ({
            tag: message ?? "Already friends",
          }),
        },
        handle404: true,
        handle409: true,
      });
    }
  };

  return {
    expanded,
    reveal,
    handleCollapse,
    tag,
    setTag,
    fieldErrors,
    isLoading,
    handleSubmit,
    showCancel: friendCount > 0,
  };
}
