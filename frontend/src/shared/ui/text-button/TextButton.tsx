import { forwardRef } from "react";

interface TextButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "default" | "destructive";
  disabled?: boolean;
}

export const TextButton = forwardRef<HTMLButtonElement, TextButtonProps>(
  function TextButton(
    { children, onClick, type = "button", variant = "default", disabled },
    ref,
  ) {
  const variantClass =
    variant === "destructive"
      ? "text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
      : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300";

    return (
      <button
        ref={ref}
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`min-h-[44px] px-1 text-sm font-normal disabled:cursor-not-allowed disabled:opacity-50 ${variantClass}`}
      >
        {children}
      </button>
    );
  },
);
