import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";
import { createBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Terms",
  description: "Temporary terms page for future legal content.",
  pathname: "/terms",
});

export default function TermsPage() {
  return (
    <PlaceholderPage
      breadcrumbs={createBreadcrumbs([{ label: "Terms", href: "/terms" }])}
      description="This placeholder will contain terms of service content after legal review."
      title="Terms"
    />
  );
}
