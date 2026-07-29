import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  label: string;
  size?: "sm" | "md" | "lg";
  variant?: "solid" | "outline" | "ghost";
};

const sizeClassName: Record<NonNullable<IconButtonProps["size"]>, string> = {
  sm: "size-9",
  md: "size-10",
  lg: "size-12",
};

const variantClassName: Record<NonNullable<IconButtonProps["variant"]>, string> = {
  solid: "border-neutral-950 bg-neutral-950 text-white hover:bg-neutral-800",
  outline:
    "border-neutral-300 bg-white text-neutral-950 hover:border-neutral-950",
  ghost: "border-transparent bg-transparent text-neutral-950 hover:bg-neutral-100",
};

export function IconButton({
  children,
  className,
  label,
  size = "md",
  type = "button",
  variant = "ghost",
  ...props
}: IconButtonProps) {
  return (
    <button
      aria-label={label}
      className={cn(
        "inline-flex items-center justify-center rounded-md border disabled:pointer-events-none disabled:opacity-50",
        sizeClassName[size],
        variantClassName[variant],
        className,
      )}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
