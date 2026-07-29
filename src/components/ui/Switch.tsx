import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type SwitchProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export function Switch({ className, ...props }: SwitchProps) {
  return (
    <input
      className={cn(
        "h-6 w-11 appearance-none rounded-full border border-neutral-300 bg-neutral-200 checked:border-neutral-950 checked:bg-neutral-950 disabled:cursor-not-allowed disabled:opacity-50",
        "before:block before:size-5 before:rounded-full before:bg-white before:shadow-sm checked:before:translate-x-5",
        className,
      )}
      role="switch"
      type="checkbox"
      {...props}
    />
  );
}
