import { describe, expect, it, vi } from "vitest";
import type { FormEvent } from "react";
import { act, renderHook } from "@testing-library/react";
import { useMutationForm } from "./useMutationForm";

const submitEvent = { preventDefault: () => {} } as unknown as FormEvent;

describe("useMutationForm", () => {
  it("blocks submit when client validation fails", async () => {
    const submit = vi.fn().mockResolvedValue({});
    const { result } = renderHook(() =>
      useMutationForm({
        initialValues: { name: "" },
        submit,
        validate: (values) =>
          values.name ? {} : { name: "Required" },
      }),
    );

    await act(async () => {
      await result.current.handleSubmit(submitEvent);
    });

    expect(submit).not.toHaveBeenCalled();
    expect(result.current.fieldErrors.name).toBe("Required");
  });

  it("submits values and calls onSuccess", async () => {
    const submit = vi.fn().mockResolvedValue({ ok: true });
    const onSuccess = vi.fn();
    const { result } = renderHook(() =>
      useMutationForm({
        initialValues: { name: "Ann" },
        submit,
        onSuccess,
      }),
    );

    await act(async () => {
      await result.current.handleSubmit(submitEvent);
    });

    expect(submit).toHaveBeenCalledWith({ name: "Ann" });
    expect(onSuccess).toHaveBeenCalledWith({ ok: true });
  });

  it("maps API 400 errors to field errors", async () => {
    const submit = vi
      .fn()
      .mockRejectedValue({ status: 400, data: { message: "name invalid" } });
    const { result } = renderHook(() =>
      useMutationForm({
        initialValues: { name: "x" },
        submit,
        mappers: { map400: (message) => ({ name: String(message) }) },
      }),
    );

    await act(async () => {
      await result.current.handleSubmit(submitEvent);
    });

    expect(result.current.fieldErrors.name).toBe("name invalid");
  });

  it("updates values via setValue", () => {
    const { result } = renderHook(() =>
      useMutationForm({
        initialValues: { name: "" },
        submit: vi.fn().mockResolvedValue({}),
      }),
    );

    act(() => result.current.setValue("name", "Bob"));
    expect(result.current.values.name).toBe("Bob");
  });
});
