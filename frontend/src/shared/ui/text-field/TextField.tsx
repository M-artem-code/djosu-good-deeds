import type { ReactNode } from "react";

interface TextFieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  autoComplete?: string;
  prefix?: ReactNode;
}

export function TextField({
  id,
  label,
  type = "text",
  value,
  onChange,
  error,
  autoComplete,
  prefix,
}: TextFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-normal leading-snug text-zinc-900 dark:text-zinc-50">
        {label}
      </label>
      <div className="relative">
        {prefix ? (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm text-zinc-500 dark:text-zinc-400">
            {prefix}
          </span>
        ) : null}
        <input
          id={id}
          type={type}
          value={value}
          autoComplete={autoComplete}
          onChange={(event) => onChange(event.target.value)}
          className={`h-11 w-full rounded-lg border bg-white px-3 text-base font-normal text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:ring-zinc-50 ${
            prefix ? "pl-8" : ""
          } ${
            error
              ? "border-red-600 dark:border-red-400"
              : "border-zinc-200 dark:border-zinc-700"
          }`}
        />
      </div>
      {error ? (
        <p className="text-sm font-normal text-red-600 dark:text-red-400">{error}</p>
      ) : null}
    </div>
  );
}
