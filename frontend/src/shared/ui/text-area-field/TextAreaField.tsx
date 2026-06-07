import { cn } from "@/shared/lib";
import {
  controlVariants,
  fieldErrorClass,
  fieldHintClass,
  fieldLabelClass,
} from "../field/field-variants";

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
      <label htmlFor={id} className={fieldLabelClass}>
        {label}
      </label>
      <textarea
        id={id}
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={error ? true : undefined}
        className={cn(
          controlVariants({ invalid: Boolean(error) }),
          "min-h-[44px] resize-y px-3 py-2",
        )}
      />
      {helperText && !error ? <p className={fieldHintClass}>{helperText}</p> : null}
      {error ? <p className={fieldErrorClass}>{error}</p> : null}
    </div>
  );
}
