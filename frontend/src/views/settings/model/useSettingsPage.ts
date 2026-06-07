"use client";

import { useDisclosure } from "@/shared/lib";
import { useGetMeQuery } from "@/entities/user";

export function useSettingsPage() {
  const query = useGetMeQuery();
  const deleteModal = useDisclosure(false);

  return {
    user: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    deleteModalOpen: deleteModal.isOpen,
    openDeleteModal: deleteModal.open,
    closeDeleteModal: deleteModal.close,
  };
}
