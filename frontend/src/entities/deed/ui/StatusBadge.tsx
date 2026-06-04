import type { DeedStatus } from "../model/types";

interface StatusBadgeProps {
  status: DeedStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const isDone = status === "done";
  const label = isDone ? "Done" : "Planned";

  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-sm font-semibold ${
        isDone
          ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
          : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
      }`}
    >
      {label}
    </span>
  );
}
