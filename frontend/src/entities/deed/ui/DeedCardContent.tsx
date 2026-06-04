import type { ReactNode } from "react";
import type { DeedPublic } from "../model/types";
import { StatusBadge } from "./StatusBadge";

export type DeedCardContentProps = {
  deed: DeedPublic;
  children?: ReactNode;
};

export function DeedCardContent({ deed, children }: DeedCardContentProps) {
  return (
    <article className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-base font-semibold leading-normal text-zinc-900 dark:text-zinc-50">
          {deed.title}
        </h3>
        <StatusBadge status={deed.status} />
      </div>
      {deed.description ? (
        <p className="mt-2 line-clamp-2 text-sm font-normal text-zinc-500 dark:text-zinc-400">
          {deed.description}
        </p>
      ) : null}
      {children}
    </article>
  );
}
