"use client";

import { useGetDeedsQuery } from "@/entities/deed";

export function useDeedsPage() {
  const query = useGetDeedsQuery();
  const deeds = query.data ?? [];
  const isEmpty = !query.isLoading && !query.isError && deeds.length === 0;

  return {
    deeds,
    isLoading: query.isLoading,
    isError: query.isError,
    isEmpty,
    refetch: query.refetch,
  };
}
