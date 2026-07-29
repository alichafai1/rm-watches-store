import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type SkeletonProps = HTMLAttributes<HTMLDivElement>;

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("rounded-md bg-neutral-200", className)}
      {...props}
    />
  );
}
