import type { ReactNode } from "react";
import { Button } from "../button";

interface PrimaryButtonProps {
  children: ReactNode;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
}

export function PrimaryButton({
  children,
  type = "button",
  disabled,
  onClick,
}: PrimaryButtonProps) {
  return (
    <Button type={type} disabled={disabled} onClick={onClick} variant="primary" fullWidth>
      {children}
    </Button>
  );
}
