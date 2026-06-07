import { forwardRef, type ReactNode } from "react";
import { Button } from "../button";

interface TextButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "default" | "destructive";
  disabled?: boolean;
}

export const TextButton = forwardRef<HTMLButtonElement, TextButtonProps>(
  function TextButton(
    { children, onClick, type = "button", variant = "default", disabled },
    ref,
  ) {
    return (
      <Button
        ref={ref}
        type={type}
        onClick={onClick}
        disabled={disabled}
        variant={variant === "destructive" ? "ghostDanger" : "ghost"}
      >
        {children}
      </Button>
    );
  },
);
