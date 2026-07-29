import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type RadioProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export function Radio({ className, ...props }: RadioProps) {
  return (
    <input
      className={cn(
        "size-4 border-neutral-300 text-neutral-950 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      type="radio"
      {...props}
    />
  );
}
