import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";
import { createBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Warranty",
  description: "Temporary warranty page for future policy content.",
  pathname: "/warranty",
});

export default function WarrantyPage() {
  return (
    <PlaceholderPage
      breadcrumbs={createBreadcrumbs([{ label: "Warranty", href: "/warranty" }])}
      description="This placeholder will document warranty terms after service policies are confirmed."
      title="Warranty"
    />
  );
}
