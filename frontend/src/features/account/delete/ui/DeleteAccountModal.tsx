"use client";

import { useRouter } from "next/navigation";
import { ConfirmDialog } from "@/shared/ui";
import { clearAuthSession, useAppDispatch } from "@/shared/api";
import { useDeleteMeMutation } from "@/entities/user";

interface DeleteAccountModalProps {
  onClose: () => void;
}

export function DeleteAccountModal({ onClose }: DeleteAccountModalProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [deleteMe, { isLoading }] = useDeleteMeMutation();

  const handleConfirm = async () => {
    try {
      await deleteMe().unwrap();
      clearAuthSession(dispatch);
      router.replace("/login?reason=account_deleted");
    } catch {
      // Errors surface via baseApi ErrorBanner
    }
  };

  return (
    <ConfirmDialog
      title="Delete account?"
      description="This can't be undone."
      cancelLabel="Keep account"
      confirmLabel="Delete account"
      confirmLoadingLabel="Deleting…"
      onClose={onClose}
      onConfirm={handleConfirm}
      isLoading={isLoading}
    />
  );
}
