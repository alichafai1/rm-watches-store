import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export function checkoutControlClassName(hasError = false) {
  return cn(
    "min-h-12 w-full rounded-lg border bg-white px-3.5 text-[15px] text-neutral-950 transition duration-150 placeholder:text-neutral-400",
    "focus:outline-none focus:ring-2 focus:ring-[#b08a3c]/25",
    hasError
      ? "border-[#c45c4a] focus:border-[#c45c4a] focus:ring-[#c45c4a]/20"
      : "border-neutral-300 hover:border-neutral-400 focus:border-[#b08a3c]",
  );
}

type CheckoutFieldProps = {
  children: ReactNode;
  className?: string;
  error?: string;
  htmlFor: string;
  label: string;
  optional?: boolean;
};

export function CheckoutField({
  children,
  className,
  error,
  htmlFor,
  label,
  optional = false,
}: CheckoutFieldProps) {
  return (
    <div className={cn("grid gap-1.5", className)}>
      <label
        className="text-[13px] font-medium text-neutral-700"
        htmlFor={htmlFor}
      >
        {label}
        {optional ? (
          <span className="ml-1 font-normal text-neutral-400">(optional)</span>
        ) : null}
      </label>
      {children}
      {error ? (
        <p className="text-[13px] text-[#c45c4a]" id={`${htmlFor}-error`}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
