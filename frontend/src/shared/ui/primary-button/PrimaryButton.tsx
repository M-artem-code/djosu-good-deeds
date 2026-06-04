interface PrimaryButtonProps {
  children: React.ReactNode;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
}

export function PrimaryButton({
  children,
  type = "button",
  disabled,
  onClick,
}: PrimaryButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className="flex h-11 min-h-[44px] w-full items-center justify-center rounded-lg bg-zinc-900 px-5 text-base font-normal text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900"
    >
      {children}
    </button>
  );
}
