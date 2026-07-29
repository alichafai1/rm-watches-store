import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import type { BreadcrumbItem } from "@/types/seo";

type BreadcrumbsProps = {
  className?: string;
  items: BreadcrumbItem[];
};

export function Breadcrumbs({ className, items }: BreadcrumbsProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className={cn("text-sm", className ?? "mb-6")}>
      <ol className="flex flex-wrap gap-2 text-neutral-600">
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;

          return (
            <li key={item.href} className="flex items-center gap-2">
              {index > 0 ? <span aria-hidden="true">/</span> : null}
              {isCurrent ? (
                <span aria-current="page" className="text-neutral-900">
                  {item.label}
                </span>
              ) : (
                <Link className="underline-offset-4 hover:underline" href={item.href}>
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
