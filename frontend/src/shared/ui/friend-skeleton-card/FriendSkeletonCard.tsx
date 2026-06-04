export function FriendSkeletonCard() {
  return (
    <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-700">
      <div className="h-5 w-1/3 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
      <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
    </div>
  );
}
