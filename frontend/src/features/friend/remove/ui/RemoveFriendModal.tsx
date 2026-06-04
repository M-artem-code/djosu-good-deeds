"use client";

import { ConfirmDialog } from "@/shared/ui";
import { useRemoveFriendMutation } from "@/entities/friend";

interface RemoveFriendModalProps {
  friendshipId: string;
  friendTag: string;
  onClose: () => void;
}

export function RemoveFriendModal({
  friendshipId,
  friendTag,
  onClose,
}: RemoveFriendModalProps) {
  const [removeFriend, { isLoading }] = useRemoveFriendMutation();

  const handleConfirm = async () => {
    try {
      await removeFriend(friendshipId).unwrap();
      onClose();
    } catch {
      // Errors surface via baseApi ErrorBanner
    }
  };

  return (
    <ConfirmDialog
      title="Remove friend?"
      description="You won't see their deeds anymore."
      cancelLabel="Keep friend"
      confirmLabel="Remove friend"
      confirmLoadingLabel="Removing…"
      onClose={onClose}
      onConfirm={handleConfirm}
      isLoading={isLoading}
      srOnlyDetail={`@${friendTag}`}
    />
  );
}
