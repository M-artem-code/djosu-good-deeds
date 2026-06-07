/** Per-field error messages keyed by form field name. */
export type FormFieldErrors<TValues> = Partial<
  Record<Extract<keyof TValues, string>, string>
>;

/** Synchronous client-side validator returning field errors (empty = valid). */
export type FormValidator<TValues> = (
  values: TValues,
) => FormFieldErrors<TValues>;
