import { cva, type VariantProps } from "class-variance-authority";

/**
 * Single source of truth for button styling. Variants:
 * - `primary`   — filled, high emphasis (former PrimaryButton).
 * - `danger`    — filled destructive action.
 * - `ghost`     — low emphasis text button (former TextButton default).
 * - `ghostDanger` — destructive text button.
 */
export const buttonVariants = cva(
  "inline-flex min-h-[44px] items-center justify-center font-normal transition-opacity disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "h-11 rounded-lg bg-zinc-900 px-5 text-base text-white hover:opacity-90 dark:bg-zinc-50 dark:text-zinc-900",
        danger:
          "h-11 rounded-lg bg-red-600 px-5 text-base text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-500",
        ghost:
          "px-1 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300",
        ghostDanger:
          "px-1 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      fullWidth: false,
    },
  },
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
