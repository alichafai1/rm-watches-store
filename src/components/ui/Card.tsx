import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type CardProps = HTMLAttributes<HTMLElement> & {
  as?: "article" | "div" | "section";
  children: ReactNode;
  padding?: "none" | "sm" | "md";
  shadow?: "none" | "xs" | "sm";
};

const paddingClassName: Record<NonNullable<CardProps["padding"]>, string> = {
  none: "",
  sm: "p-4",
  md: "p-5",
};

const shadowClassName: Record<NonNullable<CardProps["shadow"]>, string> = {
  none: "",
  xs: "shadow-[var(--shadow-xs)]",
  sm: "shadow-[var(--shadow-sm)]",
};

export function Card({
  as: Component = "article",
  children,
  className,
  padding = "sm",
  shadow = "none",
  ...props
}: CardProps) {
  return (
    <Component
      className={cn(
        "rounded-lg border border-neutral-200 bg-white transition-shadow hover:shadow-[var(--shadow-sm)]",
        paddingClassName[padding],
        shadowClassName[shadow],
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
