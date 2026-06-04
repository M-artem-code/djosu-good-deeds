"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { TextButton } from "../text-button";

interface ConfirmDialogProps {
  title: string;
  description: ReactNode;
  cancelLabel: string;
  confirmLabel: string;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  isLoading?: boolean;
  confirmLoadingLabel?: string;
  closeOnOverlayClick?: boolean;
  srOnlyDetail?: string;
}

export function ConfirmDialog({
  title,
  description,
  cancelLabel,
  confirmLabel,
  onClose,
  onConfirm,
  isLoading = false,
  confirmLoadingLabel,
  closeOnOverlayClick = false,
  srOnlyDetail,
}: ConfirmDialogProps) {
  const titleId = useId();
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    cancelButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isLoading) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, isLoading]);

  const handleOverlayClick = () => {
    if (closeOnOverlayClick && !isLoading) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="presentation"
      onClick={handleOverlayClick}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-[400px] rounded-xl border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
        onClick={(event) => event.stopPropagation()}
      >
        <h2
          id={titleId}
          className="text-xl font-semibold leading-tight text-zinc-900 dark:text-zinc-50"
        >
          {title}
        </h2>
        <div className="mt-2 text-sm font-normal text-zinc-500 dark:text-zinc-400">
          {description}
        </div>
        {srOnlyDetail ? <p className="sr-only">{srOnlyDetail}</p> : null}
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <TextButton
            ref={cancelButtonRef}
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelLabel}
          </TextButton>
          <button
            type="button"
            onClick={() => void onConfirm()}
            disabled={isLoading}
            className="flex h-11 min-h-[44px] w-full items-center justify-center rounded-lg bg-red-600 px-5 text-base font-normal text-white transition-opacity hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-red-600 dark:hover:bg-red-500 sm:w-auto"
          >
            {isLoading && confirmLoadingLabel
              ? confirmLoadingLabel
              : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
