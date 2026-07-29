import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  variant?: "neutral" | "outline" | "strong";
};

const variantClassName: Record<NonNullable<BadgeProps["variant"]>, string> = {
  neutral: "border-neutral-200 bg-neutral-100 text-neutral-700",
  outline: "border-neutral-300 bg-white text-neutral-700",
  strong: "border-neutral-950 bg-neutral-950 text-white",
};

export function Badge({
  children,
  className,
  variant = "neutral",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        variantClassName[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
