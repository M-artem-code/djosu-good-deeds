"use client";

import { useState } from "react";
import { useUpdateDeedMutation } from "@/entities/deed";

export function useDeedMarkStatus(deedId: string) {
  const [updateDeed] = useUpdateDeedMutation();
  const [isMarkingStatus, setIsMarkingStatus] = useState(false);

  const markStatus = async (status: "planned" | "done") => {
    setIsMarkingStatus(true);
    try {
      await updateDeed({ id: deedId, body: { status } }).unwrap();
    } finally {
      setIsMarkingStatus(false);
    }
  };

  return { isMarkingStatus, markStatus };
}
