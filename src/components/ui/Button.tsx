import type { ButtonHTMLAttributes, ReactNode } from "react";
import {
  buttonBaseClassName,
  buttonSizeClassName,
  buttonVariantClassName,
  type ButtonSize,
  type ButtonVariant,
} from "@/components/ui/button-styles";
import { cn } from "@/lib/utils/cn";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  size?: ButtonSize;
  variant?: ButtonVariant;
};

export function Button({
  children,
  className,
  size = "md",
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        buttonBaseClassName,
        "disabled:pointer-events-none disabled:opacity-50",
        buttonVariantClassName[variant],
        variant !== "text" && buttonSizeClassName[size],
        className,
      )}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
