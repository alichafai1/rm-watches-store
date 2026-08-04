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
  product: "grid-cols-2 md:grid-cols-3 xl:grid-cols-4",
};

/**
 * Product cards sit two per row on phones, so they get a narrow gap between
 * columns to leave the watch as much width as possible, and a wider gap between
 * rows so the cards still read as separate products.
 */
const gapClassName: Record<NonNullable<ResponsiveGridProps["columns"]>, string> = {
  auto: "gap-4 sm:gap-6",
  two: "gap-4 sm:gap-6",
  three: "gap-4 sm:gap-6",
  four: "gap-4 sm:gap-6",
  product: "gap-x-3 gap-y-8 sm:gap-6",
};

export function ResponsiveGrid({
  children,
  className,
  columns = "auto",
  ...props
}: ResponsiveGridProps) {
  return (
    <div
      className={cn(
        "grid",
        gapClassName[columns],
        columnClassName[columns],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
