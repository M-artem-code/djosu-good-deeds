/**
 * Builds a partial object containing only the fields whose value changed
 * relative to `initial`. Useful for PATCH requests that should omit untouched
 * fields.
 */
export function buildPatch<T extends Record<string, unknown>>(
  current: T,
  initial: T,
): Partial<T> {
  const patch: Partial<T> = {};
  for (const key of Object.keys(current) as (keyof T)[]) {
    if (current[key] !== initial[key]) {
      patch[key] = current[key];
    }
  }
  return patch;
}
