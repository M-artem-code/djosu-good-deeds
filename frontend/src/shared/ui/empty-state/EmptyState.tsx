interface EmptyStateProps {
  title: string;
  description?: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col gap-2 text-center">
      <h2 className="text-base font-semibold leading-normal text-zinc-900 dark:text-zinc-50">
        {title}
      </h2>
      {description ? (
        <p className="text-sm font-normal text-zinc-500 dark:text-zinc-400">
          {description}
        </p>
      ) : null}
    </div>
  );
}
