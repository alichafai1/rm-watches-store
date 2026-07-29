import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type SectionProps = {
  children: ReactNode;
  ariaLabelledBy?: string;
  className?: string;
  spacing?: "none" | "sm" | "md" | "lg";
};

const spacingClassName: Record<NonNullable<SectionProps["spacing"]>, string> = {
  none: "",
  sm: "py-6",
  md: "py-8 sm:py-10",
  lg: "py-10 sm:py-14",
};

export function Section({
  children,
  ariaLabelledBy,
  className,
  spacing = "md",
}: SectionProps) {
  return (
    <section
      aria-labelledby={ariaLabelledBy}
      className={cn(spacingClassName[spacing], className)}
    >
      {children}
    </section>
  );
}
