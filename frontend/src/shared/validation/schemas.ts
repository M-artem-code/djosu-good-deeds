import { z } from "zod";
import { normalizeTag } from "@/shared/lib/normalize-tag";

const TAG_PATTERN = /^[a-z0-9_]{3,32}$/;
const TAG_MESSAGE =
  "Tag must be 3\u201332 chars: lowercase letters, numbers, underscore";

const emailField = z
  .string()
  .min(1, "Email is required")
  .refine((value) => z.email().safeParse(value.trim()).success, {
    message: "Enter a valid email",
  });

const passwordField = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .max(128, "Password is too long");

const displayNameField = z
  .string()
  .trim()
  .min(1, "Name is required")
  .max(64, "Name is too long");

const tagField = z
  .string()
  .transform((value) => normalizeTag(value))
  .refine((value) => TAG_PATTERN.test(value), { message: TAG_MESSAGE });

const titleField = z
  .string()
  .trim()
  .min(1, "Title is required")
  .max(120, "Title is too long");

const descriptionField = z
  .string()
  .max(500, "Description is too long");

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  email: emailField,
  password: passwordField,
  displayName: displayNameField,
  tag: tagField,
});

export const deedSchema = z.object({
  title: titleField,
  description: descriptionField,
});

export const profileSchema = z.object({
  displayName: displayNameField,
  tag: tagField,
});

export const addFriendSchema = z.object({
  tag: tagField,
});

export type LoginFormValues = z.input<typeof loginSchema>;
export type RegisterFormValues = z.input<typeof registerSchema>;
export type DeedFormValues = z.input<typeof deedSchema>;
export type ProfileFormValues = z.input<typeof profileSchema>;
export type AddFriendFormValues = z.input<typeof addFriendSchema>;
