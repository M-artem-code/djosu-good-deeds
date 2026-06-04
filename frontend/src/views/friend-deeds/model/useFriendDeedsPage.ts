"use client";

import { getApiErrorStatus } from "@/shared/api";
import { normalizeTag } from "@/shared/lib";
import { useGetFriendDeedsQuery } from "@/entities/friend";
import { useGetUserByTagQuery } from "@/entities/user";

export function useFriendDeedsPage(rawTag: string) {
  const tag = normalizeTag(rawTag);
  const skip = !tag;

  const deedsQuery = useGetFriendDeedsQuery(tag, { skip });
  const userQuery = useGetUserByTagQuery(tag, { skip });

  const deeds = deedsQuery.data ?? [];
  const status = getApiErrorStatus(deedsQuery.error);
  const forbidden = !tag || status === 403;
  const isError = deedsQuery.isError && !forbidden;
  const isEmpty =
    !deedsQuery.isLoading && !isError && !forbidden && deeds.length === 0;

  return {
    tag,
    displayName: userQuery.data?.displayName,
    deeds,
    isLoading: deedsQuery.isLoading,
    isError,
    forbidden,
    isEmpty,
    refetch: deedsQuery.refetch,
  };
}
