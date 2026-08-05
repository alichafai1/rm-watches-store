import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type CheckoutSectionCardProps = {
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  description?: string;
  title: string;
};

export function CheckoutSectionCard({
  action,
  children,
  className,
  description,
  title,
}: CheckoutSectionCardProps) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-neutral-200 bg-white p-5 shadow-[var(--shadow-xs)] sm:p-7",
        className,
      )}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="text-lg font-semibold tracking-tight text-neutral-950">
          {title}
        </h2>
        {action}
      </div>
      {description ? (
        <p className="mt-1 text-sm leading-6 text-neutral-500">{description}</p>
      ) : null}
      <div className="mt-5">{children}</div>
    </section>
  );
}
