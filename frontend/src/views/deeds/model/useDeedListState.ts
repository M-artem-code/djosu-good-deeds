"use client";

import { useState } from "react";
import type { DeedPublic } from "@/entities/deed";

export function useDeedListState() {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DeedPublic | null>(null);

  return {
    editingId,
    startEdit: (id: string) => setEditingId(id),
    cancelEdit: () => setEditingId(null),
    deleteTarget,
    requestDelete: (deed: DeedPublic) => setDeleteTarget(deed),
    clearDelete: () => setDeleteTarget(null),
  };
}
