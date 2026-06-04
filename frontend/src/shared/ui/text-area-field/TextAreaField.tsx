interface TextAreaFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  rows?: number;
  helperText?: string;
}

export function TextAreaField({
  id,
  label,
  value,
  onChange,
  error,
  rows = 3,
  helperText,
}: TextAreaFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="text-sm font-normal leading-snug text-zinc-900 dark:text-zinc-50"
      >
        {label}
      </label>
      <textarea
        id={id}
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`min-h-[44px] w-full resize-y rounded-lg border bg-white px-3 py-2 text-base font-normal text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:ring-zinc-50 ${
          error
            ? "border-red-600 dark:border-red-400"
            : "border-zinc-200 dark:border-zinc-700"
        }`}
      />
      {helperText && !error ? (
        <p className="text-sm font-normal text-zinc-500 dark:text-zinc-400">
          {helperText}
        </p>
      ) : null}
      {error ? (
        <p className="text-sm font-normal text-red-600 dark:text-red-400">{error}</p>
      ) : null}
    </div>
  );
}
