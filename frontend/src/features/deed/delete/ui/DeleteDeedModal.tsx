"use client";

import { ConfirmDialog } from "@/shared/ui";
import { useDeleteDeedMutation } from "@/entities/deed";

interface DeleteDeedModalProps {
  deedId: string;
  deedTitle: string;
  onClose: () => void;
}

export function DeleteDeedModal({
  deedId,
  deedTitle,
  onClose,
}: DeleteDeedModalProps) {
  const [deleteDeed, { isLoading }] = useDeleteDeedMutation();

  const handleConfirm = async () => {
    try {
      await deleteDeed(deedId).unwrap();
      onClose();
    } catch {
      // Errors surface via baseApi ErrorBanner
    }
  };

  return (
    <ConfirmDialog
      title="Delete deed?"
      description="This can't be undone."
      cancelLabel="Keep deed"
      confirmLabel="Delete deed"
      confirmLoadingLabel="Deleting…"
      onClose={onClose}
      onConfirm={handleConfirm}
      isLoading={isLoading}
      srOnlyDetail={deedTitle}
    />
  );
}
