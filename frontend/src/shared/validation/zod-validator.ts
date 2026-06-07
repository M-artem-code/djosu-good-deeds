import type { ZodType } from "zod";
import type { FormFieldErrors, FormValidator } from "@/shared/lib/forms";

/**
 * Adapts a zod schema into a {@link FormValidator}: returns the first error
 * message per top-level field, keyed by field name (empty object = valid).
 */
export function zodValidator<TValues extends Record<string, unknown>>(
  schema: ZodType,
): FormValidator<TValues> {
  return (values) => {
    const result = schema.safeParse(values);
    if (result.success) {
      return {};
    }

    const errors: FormFieldErrors<TValues> = {};
    for (const issue of result.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !(key in errors)) {
        (errors as Record<string, string>)[key] = issue.message;
      }
    }
    return errors;
  };
}
