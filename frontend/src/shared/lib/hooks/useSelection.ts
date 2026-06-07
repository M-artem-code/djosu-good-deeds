"use client";

import { useCallback, useMemo, useState } from "react";

export interface Selection<T> {
  selected: T | null;
  select: (item: T) => void;
  clear: () => void;
}

/** Tracks a single optionally-selected item (e.g. a row targeted for deletion). */
export function useSelection<T>(): Selection<T> {
  const [selected, setSelected] = useState<T | null>(null);

  const select = useCallback((item: T) => setSelected(item), []);
  const clear = useCallback(() => setSelected(null), []);

  return useMemo(
    () => ({ selected, select, clear }),
    [selected, select, clear],
  );
}
