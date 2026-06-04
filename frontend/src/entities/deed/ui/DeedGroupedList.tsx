"use client";

import type { ReactNode } from "react";
import type { DeedPublic } from "../model/types";

interface DeedGroupedListProps {
  deeds: DeedPublic[];
  renderCard: (deed: DeedPublic) => ReactNode;
}

export function DeedGroupedList({ deeds, renderCard }: DeedGroupedListProps) {
  const planned = deeds.filter((deed) => deed.status === "planned");
  const done = deeds.filter((deed) => deed.status === "done");

  const renderSection = (label: string, items: DeedPublic[]) => {
    if (items.length === 0) {
      return null;
    }

    return (
      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          {label}
        </h2>
        <div className="flex flex-col gap-4">
          {items.map((deed) => (
            <div key={deed._id}>{renderCard(deed)}</div>
          ))}
        </div>
      </section>
    );
  };

  if (planned.length === 0 && done.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      {renderSection("Planned", planned)}
      {renderSection("Done", done)}
    </div>
  );
}
