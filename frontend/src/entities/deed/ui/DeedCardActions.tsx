"use client";

import { TextButton } from "@/shared/ui";
import type { DeedPublic, DeedStatus } from "../model/types";

export type DeedCardActionsProps = {
  deed: DeedPublic;
  isMarkingStatus: boolean;
  onStartEdit: () => void;
  onMarkStatus: (status: DeedStatus) => void;
  onDelete: () => void;
};

export function DeedCardActions({
  deed,
  isMarkingStatus,
  onStartEdit,
  onMarkStatus,
  onDelete,
}: DeedCardActionsProps) {
  const isPlanned = deed.status === "planned";
  const markingDone = isMarkingStatus && isPlanned;
  const markingPlanned = isMarkingStatus && !isPlanned;

  return (
    <div className="flex flex-wrap items-center gap-2 pt-3">
      <TextButton onClick={onStartEdit} disabled={isMarkingStatus}>
        Edit
      </TextButton>
      {isPlanned ? (
        <TextButton
          onClick={() => onMarkStatus("done")}
          disabled={isMarkingStatus}
        >
          {markingDone ? "Marking done…" : "Mark done"}
        </TextButton>
      ) : (
        <TextButton
          onClick={() => onMarkStatus("planned")}
          disabled={isMarkingStatus}
        >
          {markingPlanned ? "Marking planned…" : "Mark planned"}
        </TextButton>
      )}
      <TextButton variant="destructive" onClick={onDelete} disabled={isMarkingStatus}>
        Delete
      </TextButton>
    </div>
  );
}
