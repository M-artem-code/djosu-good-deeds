const FIELD_KEYS = ["email", "password", "displayName", "tag"] as const;

type FieldKey = (typeof FIELD_KEYS)[number];

export function mapValidationErrors(
  message: string | string[],
): Partial<Record<FieldKey, string>> {
  const messages = Array.isArray(message) ? message : [message];
  const errors: Partial<Record<FieldKey, string>> = {};

  for (const entry of messages) {
    const lower = entry.toLowerCase();
    const field = FIELD_KEYS.find((key) => lower.includes(key));
    if (field) {
      errors[field] = entry;
    }
  }

  return errors;
}

export function mapConflictError(
  message: string,
): Partial<Record<"email" | "tag", string>> {
  const lower = message.toLowerCase();
  if (lower.includes("email")) {
    return { email: message };
  }
  return { tag: message };
}

export function mapDeedValidationErrors(
  message: string | string[],
): Partial<Record<"title" | "description", string>> {
  const messages = Array.isArray(message) ? message : [message];
  const errors: Partial<Record<"title" | "description", string>> = {};

  for (const entry of messages) {
    const lower = entry.toLowerCase();
    if (lower.includes("title")) {
      errors.title = entry;
    } else if (lower.includes("description")) {
      errors.description = entry;
    }
  }

  return errors;
}

export function mapFriendTagValidationErrors(
  message: string | string[],
): Partial<Record<"tag", string>> {
  const messages = Array.isArray(message) ? message : [message];
  const errors: Partial<Record<"tag", string>> = {};

  for (const entry of messages) {
    const lower = entry.toLowerCase();
    if (lower.includes("tag") || lower.includes("yourself")) {
      errors.tag = entry;
    }
  }

  return errors;
}

/** Maps deed 400 messages to field errors, falling back to a title error. */
export function mapDeedFieldErrors(
  message: string | string[],
): Partial<Record<"title" | "description", string>> {
  const mapped = mapDeedValidationErrors(message);
  return Object.keys(mapped).length > 0
    ? mapped
    : { title: "Title is required" };
}

/** Maps friend-tag 400 messages to a tag field error, with a sane fallback. */
export function mapFriendTagFieldErrors(
  message: string | string[],
): Partial<Record<"tag", string>> {
  const mapped = mapFriendTagValidationErrors(message);
  return Object.keys(mapped).length > 0 ? mapped : { tag: "Enter a valid tag" };
}
