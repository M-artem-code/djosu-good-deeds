"use client";

import Link from "next/link";

import type { FriendItem } from "../model/types";

import { TextButton } from "@/shared/ui";

interface FriendCardProps {
  item: FriendItem;

  onRemove: (item: FriendItem) => void;
}

export function FriendCard({ item, onRemove }: FriendCardProps) {
  const { friend } = item;

  return (
    <article className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
      <div className="flex items-start gap-2 p-4">
        <Link
          href={`/friends/${friend.tag}`}
          className="block min-h-[56px] min-w-0 flex-1 transition-colors hover:opacity-90"
        >
          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                @{friend.tag}
              </span>

              <span className="rounded bg-zinc-100 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                You follow
              </span>
            </div>

            <span className="text-sm font-normal text-zinc-500 dark:text-zinc-400">
              {friend.displayName}
            </span>
          </div>
        </Link>

        <span
          role="presentation"
          onClick={(e) => {
            e.preventDefault();

            e.stopPropagation();
          }}
        >
          <TextButton variant="destructive" onClick={() => onRemove(item)}>
            Remove
          </TextButton>
        </span>
      </div>
    </article>
  );
}
