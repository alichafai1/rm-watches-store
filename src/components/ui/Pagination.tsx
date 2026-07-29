import Link from "next/link";
import { cn } from "@/lib/utils/cn";

type PaginationLink = {
  href: string;
  label: string;
  isCurrent?: boolean;
};

type PaginationProps = {
  ariaLabel?: string;
  className?: string;
  links: PaginationLink[];
};

export function Pagination({
  ariaLabel = "Pagination",
  className,
  links,
}: PaginationProps) {
  if (links.length === 0) {
    return null;
  }

  return (
    <nav aria-label={ariaLabel} className={className}>
      <ul className="flex flex-wrap items-center gap-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              aria-current={link.isCurrent ? "page" : undefined}
              className={cn(
                "inline-flex min-h-10 min-w-10 items-center justify-center rounded-md border px-3 text-sm font-medium",
                link.isCurrent
                  ? "border-neutral-950 bg-neutral-950 text-white"
                  : "border-neutral-300 bg-white text-neutral-950 hover:border-neutral-950",
              )}
              href={link.href}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
