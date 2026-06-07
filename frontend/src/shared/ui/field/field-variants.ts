import { cva } from "class-variance-authority";

export const fieldLabelClass =
  "text-sm font-normal leading-snug text-zinc-900 dark:text-zinc-50";
export const fieldHintClass =
  "text-sm font-normal text-zinc-500 dark:text-zinc-400";
export const fieldErrorClass =
  "text-sm font-normal text-red-600 dark:text-red-400";

/** Shared base styling for text inputs and textareas (sizing added per control). */
export const controlVariants = cva(
  "w-full rounded-lg border bg-white text-base font-normal text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:ring-zinc-50",
  {
    variants: {
      invalid: {
        true: "border-red-600 dark:border-red-400",
        false: "border-zinc-200 dark:border-zinc-700",
      },
    },
    defaultVariants: {
      invalid: false,
    },
  },
);
