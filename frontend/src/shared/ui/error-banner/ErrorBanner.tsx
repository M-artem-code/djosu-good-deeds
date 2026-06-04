"use client";

import {
  clearBannerMessage,
  useAppDispatch,
  useAppSelector,
} from "@/shared/api";

interface ErrorBannerProps {
  message?: string;
  onDismiss?: () => void;
}

export function ErrorBanner({ message, onDismiss }: ErrorBannerProps) {
  const dispatch = useAppDispatch();
  const bannerMessage = useAppSelector((state) => state.ui.bannerMessage);
  const text = message ?? bannerMessage;

  if (!text) {
    return null;
  }

  const handleDismiss = () => {
    if (onDismiss) {
      onDismiss();
    } else {
      dispatch(clearBannerMessage());
    }
  };

  return (
    <div
      role="alert"
      className="border-b border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200"
    >
      <div className="mx-auto flex max-w-5xl items-start justify-between gap-4">
        <p>{text}</p>
        <button
          type="button"
          aria-label="Dismiss"
          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
          onClick={handleDismiss}
        >
          ×
        </button>
      </div>
    </div>
  );
}
