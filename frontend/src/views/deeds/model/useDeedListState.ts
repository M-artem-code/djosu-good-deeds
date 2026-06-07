"use client";

import { useSelection } from "@/shared/lib";
import type { DeedPublic } from "@/entities/deed";

export function useDeedListState() {
  const editing = useSelection<string>();
  const deletion = useSelection<DeedPublic>();

  return {
    editingId: editing.selected,
    startEdit: editing.select,
    cancelEdit: editing.clear,
    deleteTarget: deletion.selected,
    requestDelete: deletion.select,
    clearDelete: deletion.clear,
  };
}
