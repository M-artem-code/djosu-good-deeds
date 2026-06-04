export const TAG_PATTERN = /^[a-z0-9_]{3,32}$/;

export function normalizeTag(tag: string): string {
  return tag.trim().toLowerCase().replace(/^@/, "");
}
