import { cn } from "@/shared/lib";

interface ErrorBannerProps {
  message: string;
  onDismiss?: () => void;
  className?: string;
}

/** Presentational inline error alert. State is owned by the caller. */
export function ErrorBanner({ message, onDismiss, className }: ErrorBannerProps) {
  return (
    <div
      role="alert"
      className={cn(
        "border-b border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200",
        className,
      )}
    >
      <div className="mx-auto flex max-w-5xl items-start justify-between gap-4">
        <p>{message}</p>
        {onDismiss ? (
          <button
            type="button"
            aria-label="Dismiss"
            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
            onClick={onDismiss}
          >
            ×
          </button>
        ) : null}
      </div>
    </div>
  );
}
