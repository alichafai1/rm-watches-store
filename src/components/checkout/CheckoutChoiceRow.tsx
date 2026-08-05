import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type CheckoutChoiceRowProps = {
  checked: boolean;
  description?: string;
  /** Full-width content under the label, for anything too wide to sit inline. */
  footer?: ReactNode;
  id: string;
  label: string;
  name: string;
  onSelect: () => void;
  /** Payment icons, a price, or a badge shown on the trailing edge. */
  trailing?: ReactNode;
  value: string;
};

export function CheckoutChoiceRow({
  checked,
  description,
  footer,
  id,
  label,
  name,
  onSelect,
  trailing,
  value,
}: CheckoutChoiceRowProps) {
  return (
    <label
      className={cn(
        "block cursor-pointer rounded-xl border px-4 py-4 transition duration-150",
        "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#b08a3c]/40",
        checked
          ? "border-[#b08a3c] bg-[#f8f2e8]"
          : "border-neutral-300 bg-white hover:border-neutral-400",
      )}
      htmlFor={id}
    >
      <span className="flex items-center gap-3.5">
        <input
          checked={checked}
          className="sr-only"
          id={id}
          name={name}
          onChange={onSelect}
          type="radio"
          value={value}
        />
        <span
          aria-hidden="true"
          className={cn(
            "flex size-[18px] shrink-0 items-center justify-center rounded-full border-2 transition duration-150",
            checked ? "border-[#9a752e]" : "border-neutral-400",
          )}
        >
          {checked ? (
            <span className="size-2 rounded-full bg-[#9a752e]" />
          ) : null}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-neutral-950">
            {label}
          </span>
          {description ? (
            <span className="mt-0.5 block text-[13px] leading-5 text-neutral-500">
              {description}
            </span>
          ) : null}
        </span>
        {trailing ? <span className="shrink-0">{trailing}</span> : null}
      </span>
      {footer ? <span className="mt-3 block">{footer}</span> : null}
    </label>
  );
}
