"use client";

import { useEffect } from "react";
import {
  clearBannerMessage,
  useAppDispatch,
  useAppSelector,
} from "@/shared/api";

const AUTO_DISMISS_MS = 6000;

/**
 * Floating, auto-dismissing toast for global (server/network) error messages
 * published via `setBannerMessage`. Replaces the old top-of-page banner.
 */
export function Toaster() {
  const dispatch = useAppDispatch();
  const message = useAppSelector((state) => state.ui.bannerMessage);

  useEffect(() => {
    if (!message) {
      return;
    }
    const timer = window.setTimeout(
      () => dispatch(clearBannerMessage()),
      AUTO_DISMISS_MS,
    );
    return () => window.clearTimeout(timer);
  }, [message, dispatch]);

  if (!message) {
    return null;
  }

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4"
      aria-live="assertive"
    >
      <div
        role="alert"
        className="pointer-events-auto flex w-full max-w-md items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 shadow-lg dark:border-red-900 dark:bg-red-950/70 dark:text-red-200"
      >
        <p>{message}</p>
        <button
          type="button"
          aria-label="Dismiss"
          className="shrink-0 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
          onClick={() => dispatch(clearBannerMessage())}
        >
          ×
        </button>
      </div>
    </div>
  );
}
