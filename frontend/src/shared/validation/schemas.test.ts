import { describe, expect, it } from "vitest";
import { zodValidator } from "./zod-validator";
import {
  deedSchema,
  loginSchema,
  registerSchema,
  type DeedFormValues,
  type LoginFormValues,
  type RegisterFormValues,
} from "./schemas";

describe("zod form validators", () => {
  const validateLogin = zodValidator<LoginFormValues>(loginSchema);
  const validateRegister = zodValidator<RegisterFormValues>(registerSchema);
  const validateDeed = zodValidator<DeedFormValues>(deedSchema);

  it("accepts valid login values", () => {
    expect(validateLogin({ email: "a@b.com", password: "secret" })).toEqual({});
  });

  it("flags invalid email and empty password", () => {
    const errors = validateLogin({ email: "nope", password: "" });
    expect(errors.email).toBeTruthy();
    expect(errors.password).toBeTruthy();
  });

  it("validates a normalized tag in register", () => {
    expect(
      validateRegister({
        email: "a@b.com",
        password: "secret1",
        displayName: "Alex",
        tag: "@AB", // too short after normalization
      }).tag,
    ).toBeTruthy();

    expect(
      validateRegister({
        email: "a@b.com",
        password: "secret1",
        displayName: "Alex",
        tag: "@Alex_99",
      }),
    ).toEqual({});
  });

  it("requires a deed title but allows empty description", () => {
    expect(validateDeed({ title: "", description: "" }).title).toBeTruthy();
    expect(validateDeed({ title: "Help out", description: "" })).toEqual({});
  });
});
