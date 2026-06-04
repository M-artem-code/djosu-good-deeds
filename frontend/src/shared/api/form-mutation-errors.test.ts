import { describe, expect, it, vi } from "vitest";
import { handleFormMutationError } from "./form-mutation-errors";

describe("handleFormMutationError", () => {
  it("maps 400 to field errors via map400", () => {
    const onFieldErrors = vi.fn();
    handleFormMutationError(
      { status: 400, data: { message: ["email must be valid"] } },
      {
        onFieldErrors,
        mappers: {
          map400: () => ({ email: "email must be valid" }),
        },
      },
    );
    expect(onFieldErrors).toHaveBeenCalledWith({ email: "email must be valid" });
  });

  it("maps 409 to field errors when handle409 is true", () => {
    const onFieldErrors = vi.fn();
    handleFormMutationError(
      { status: 409, data: { message: "Tag already taken" } },
      {
        onFieldErrors,
        handle409: true,
        mappers: { map409: (msg) => ({ tag: msg }) },
      },
    );
    expect(onFieldErrors).toHaveBeenCalledWith({ tag: "Tag already taken" });
  });

  it("maps 404 to tag field when handle404 is true", () => {
    const onFieldErrors = vi.fn();
    handleFormMutationError(
      { status: 404, data: { message: "User not found" } },
      {
        onFieldErrors,
        handle404: true,
        mappers: { map404: (msg) => ({ tag: msg }) },
      },
    );
    expect(onFieldErrors).toHaveBeenCalledWith({ tag: "User not found" });
  });

  it("calls onFormError with API message for unhandled status", () => {
    const onFormError = vi.fn();
    handleFormMutationError(
      { status: 500, data: { message: "Server error" } },
      {
        onFieldErrors: vi.fn(),
        onFormError,
        defaultFormError: "Default error",
      },
    );
    expect(onFormError).toHaveBeenCalledWith("Server error");
  });

  it("uses defaultFormError when message is missing", () => {
    const onFormError = vi.fn();
    handleFormMutationError(
      { status: 500, data: {} },
      {
        onFieldErrors: vi.fn(),
        onFormError,
        defaultFormError: "Default error",
      },
    );
    expect(onFormError).toHaveBeenCalledWith("Default error");
  });
});
