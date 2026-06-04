interface LoaderProps {
  label?: string;
  variant?: "fullscreen" | "inline";
}

export function Loader({ label = "Loading…", variant = "fullscreen" }: LoaderProps) {
  if (variant === "inline") {
    return (
      <div
        className="flex flex-1 items-center justify-center text-zinc-500 dark:text-zinc-400"
        role="status"
        aria-busy="true"
        aria-label={label}
      >
        <p className="text-sm">{label}</p>
      </div>
    );
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950"
      role="status"
      aria-busy="true"
      aria-label={label}
    >
      <p className="text-sm text-zinc-500 dark:text-zinc-400">{label}</p>
    </div>
  );
}
