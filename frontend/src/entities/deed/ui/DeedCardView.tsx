"use client";

import type { DeedPublic, DeedStatus } from "../model/types";
import { DeedCardActions } from "./DeedCardActions";
import { DeedCardContent } from "./DeedCardContent";

export type DeedCardViewProps = {
  deed: DeedPublic;
  isMarkingStatus: boolean;
  onStartEdit: () => void;
  onMarkStatus: (status: DeedStatus) => void;
  onDelete: () => void;
};

export function DeedCardView({
  deed,
  isMarkingStatus,
  onStartEdit,
  onMarkStatus,
  onDelete,
}: DeedCardViewProps) {
  return (
    <DeedCardContent deed={deed}>
      <DeedCardActions
        deed={deed}
        isMarkingStatus={isMarkingStatus}
        onStartEdit={onStartEdit}
        onMarkStatus={onMarkStatus}
        onDelete={onDelete}
      />
    </DeedCardContent>
  );
}
