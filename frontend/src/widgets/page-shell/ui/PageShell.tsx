import type { ReactNode } from "react";

type PageShellSpacing = "default" | "compact";

interface PageShellProps {
  children: ReactNode;
  spacing?: PageShellSpacing;
}

const spacingClass: Record<PageShellSpacing, string> = {
  default: "gap-8",
  compact: "gap-6",
};

export function PageShell({ children, spacing = "default" }: PageShellProps) {
  return (
    <div className={`flex flex-col ${spacingClass[spacing]}`}>{children}</div>
  );
}
