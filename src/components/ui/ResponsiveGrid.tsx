import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type ResponsiveGridProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  columns?: "auto" | "two" | "three" | "four" | "product";
};

const columnClassName: Record<NonNullable<ResponsiveGridProps["columns"]>, string> = {
  auto: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  two: "grid-cols-1 md:grid-cols-2",
  three: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  four: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  product: "grid-cols-2 lg:grid-cols-4",
};

export function ResponsiveGrid({
  children,
  className,
  columns = "auto",
  ...props
}: ResponsiveGridProps) {
  return (
    <div
      className={cn("grid gap-4 sm:gap-6", columnClassName[columns], className)}
      {...props}
    >
      {children}
    </div>
  );
}
