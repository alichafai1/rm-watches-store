import type { BreadcrumbItem } from "@/types/seo";

export function createBreadcrumbs(items: BreadcrumbItem[]): BreadcrumbItem[] {
  return [{ label: "Home", href: "/" }, ...items];
}
