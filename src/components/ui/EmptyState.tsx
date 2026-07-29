import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type EmptyStateProps = {
  action?: ReactNode;
  className?: string;
  description: string;
  title: string;
};

export function EmptyState({
  action,
  className,
  description,
  title,
}: EmptyStateProps) {
  return (
    <section
      aria-label={title}
      className={cn(
        "grid justify-items-start gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-6",
        className,
      )}
    >
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      <p className="max-w-prose text-sm text-neutral-600">{description}</p>
      {action ? <div className="pt-2">{action}</div> : null}
    </section>
  );
}
