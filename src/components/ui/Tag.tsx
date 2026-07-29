import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type TagProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
};

export function Tag({ children, className, ...props }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-sm bg-neutral-100 px-2 py-1 text-xs text-neutral-700",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
