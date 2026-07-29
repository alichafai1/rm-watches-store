import type { ReactNode } from "react";

type FieldProps = {
  children: ReactNode;
  label: string;
  hint?: string;
};

export function Field({ children, label, hint }: FieldProps) {
  return (
    <label className="grid gap-1.5 text-sm">
      <span className="font-medium text-neutral-800">{label}</span>
      {children}
      {hint ? <span className="text-xs text-neutral-500">{hint}</span> : null}
    </label>
  );
}

export const inputClassName =
  "min-h-11 rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-950 outline-none focus:border-neutral-500";

export const textareaClassName =
  "min-h-28 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-950 outline-none focus:border-neutral-500";
