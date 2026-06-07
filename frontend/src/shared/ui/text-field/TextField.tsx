import type { ReactNode } from "react";
import { cn } from "@/shared/lib";
import {
  controlVariants,
  fieldErrorClass,
  fieldLabelClass,
} from "../field/field-variants";

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
      <label htmlFor={id} className={fieldLabelClass}>
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
          aria-invalid={error ? true : undefined}
          className={cn(
            controlVariants({ invalid: Boolean(error) }),
            "h-11 px-3",
            prefix && "pl-8",
          )}
        />
      </div>
      {error ? <p className={fieldErrorClass}>{error}</p> : null}
    </div>
  );
}
