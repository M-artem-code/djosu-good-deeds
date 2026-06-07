import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges class names with `clsx` semantics and resolves conflicting Tailwind
 * utilities via `tailwind-merge` (the last conflicting class wins).
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
