interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-xl font-semibold leading-tight text-zinc-900 dark:text-zinc-50">
        {title}
      </h1>
      {subtitle ? (
        <p className="max-w-xl text-base font-normal leading-normal text-zinc-600 dark:text-zinc-300">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
