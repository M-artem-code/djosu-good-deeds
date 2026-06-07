import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { TextField } from "./TextField";

describe("TextField", () => {
  it("emits the raw value on change", () => {
    const onChange = vi.fn();
    render(<TextField id="email" label="Email" value="" onChange={onChange} />);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "a@b.com" },
    });
    expect(onChange).toHaveBeenCalledWith("a@b.com");
  });

  it("shows the error message and marks the input invalid", () => {
    render(
      <TextField
        id="email"
        label="Email"
        value=""
        onChange={vi.fn()}
        error="Required"
      />,
    );

    expect(screen.getByText("Required")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });
});
