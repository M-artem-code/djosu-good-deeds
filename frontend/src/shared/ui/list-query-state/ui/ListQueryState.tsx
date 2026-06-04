import type { ComponentType, ReactNode } from "react";
import { TextButton } from "../../text-button";

interface ListQueryStateProps {
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  loadingLabel: string;
  errorTitle: string;
  errorDescription?: string;
  skeleton: ComponentType;
  skeletonCount?: number;
  children: ReactNode;
}

export function ListQueryState({
  isLoading,
  isError,
  onRetry,
  loadingLabel,
  errorTitle,
  errorDescription = "Check your connection and try again.",
  skeleton: Skeleton,
  skeletonCount = 3,
  children,
}: ListQueryStateProps) {
  if (isLoading) {
    return (
      <div
        className="flex flex-col gap-4"
        aria-busy="true"
        aria-label={loadingLabel}
      >
        {Array.from({ length: skeletonCount }, (_, index) => (
          <Skeleton key={index} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          {errorTitle}
        </h2>
        <p className="text-sm font-normal text-zinc-500 dark:text-zinc-400">
          {errorDescription}
        </p>
        <TextButton type="button" onClick={onRetry}>
          Try again
        </TextButton>
      </div>
    );
  }

  return <>{children}</>;
}
