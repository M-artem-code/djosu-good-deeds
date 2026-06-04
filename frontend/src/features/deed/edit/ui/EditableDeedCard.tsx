"use client";

import { DeedCardView, type DeedPublic } from "@/entities/deed";
import { useDeedMarkStatus } from "../model/useDeedMarkStatus";
import { DeedEditForm } from "./DeedEditForm";

export type EditableDeedCardProps = {
  deed: DeedPublic;
  isEditing: boolean;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onDelete: () => void;
};

export function EditableDeedCard({
  deed,
  isEditing,
  onStartEdit,
  onCancelEdit,
  onDelete,
}: EditableDeedCardProps) {
  const { isMarkingStatus, markStatus } = useDeedMarkStatus(deed._id);

  if (isEditing) {
    return <DeedEditForm key={deed._id} deed={deed} onCancelEdit={onCancelEdit} />;
  }

  return (
    <DeedCardView
      deed={deed}
      isMarkingStatus={isMarkingStatus}
      onStartEdit={onStartEdit}
      onMarkStatus={markStatus}
      onDelete={onDelete}
    />
  );
}
