"use client";

import { useState } from "react";

export function useCollapsibleForm(itemCount: number) {
  const [revealed, setRevealed] = useState(false);
  const expanded = itemCount === 0 || revealed;

  return {
    expanded,
    reveal: () => setRevealed(true),
    collapse: () => setRevealed(false),
  };
}
