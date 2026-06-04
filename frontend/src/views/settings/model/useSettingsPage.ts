"use client";

import { useState } from "react";
import { useGetMeQuery } from "@/entities/user";

export function useSettingsPage() {
  const query = useGetMeQuery();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  return {
    user: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    deleteModalOpen,
    openDeleteModal: () => setDeleteModalOpen(true),
    closeDeleteModal: () => setDeleteModalOpen(false),
  };
}
