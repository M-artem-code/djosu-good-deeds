export function ProfileSkeletonCard() {
  return (
    <div
      className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900"
      aria-hidden="true"
    >
      <div className="flex flex-col gap-4">
        <div className="h-4 w-1/4 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-10 w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-10 w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
      </div>
    </div>
  );
}
