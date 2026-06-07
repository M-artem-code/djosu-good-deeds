import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/shared/lib";
import { buttonVariants, type ButtonVariantProps } from "./button-variants";

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color">,
    ButtonVariantProps {}

/** Variant-driven button primitive shared across the UI kit. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ className, variant, fullWidth, type = "button", ...rest }, ref) {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(buttonVariants({ variant, fullWidth }), className)}
        {...rest}
      />
    );
  },
);
