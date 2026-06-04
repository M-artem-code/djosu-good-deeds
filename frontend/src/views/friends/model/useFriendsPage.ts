"use client";

import { useState } from "react";
import type { FriendItem } from "@/entities/friend";
import { useGetFriendsQuery } from "@/entities/friend";

export function useFriendsPage() {
  const query = useGetFriendsQuery();
  const friends = query.data ?? [];
  const [removeTarget, setRemoveTarget] = useState<FriendItem | null>(null);
  const spacing =
    query.isLoading || query.isError ? ("default" as const) : ("compact" as const);

  return {
    friends,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    spacing,
    removeTarget,
    setRemoveTarget,
    clearRemoveTarget: () => setRemoveTarget(null),
  };
}
