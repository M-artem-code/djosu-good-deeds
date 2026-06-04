"use client";

import { useRouter } from "next/navigation";
import { ConfirmDialog } from "@/shared/ui";
import { clearAuthSession, useAppDispatch } from "@/shared/api";

interface LogoutConfirmModalProps {
  onClose: () => void;
}

export function LogoutConfirmModal({ onClose }: LogoutConfirmModalProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleConfirm = () => {
    clearAuthSession(dispatch);
    router.push("/login");
  };

  return (
    <ConfirmDialog
      title="Log out?"
      description="You'll need to sign in again to access your deeds and friends."
      cancelLabel="Stay signed in"
      confirmLabel="Log out"
      onClose={onClose}
      onConfirm={handleConfirm}
      closeOnOverlayClick
    />
  );
}
