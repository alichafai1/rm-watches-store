import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";
import { createBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Contact",
  description: "Temporary contact page for the watch ecommerce foundation.",
  pathname: "/contact",
});

export default function ContactPage() {
  return (
    <PlaceholderPage
      breadcrumbs={createBreadcrumbs([{ label: "Contact", href: "/contact" }])}
      description="This placeholder will contain customer contact details after the business information is finalized."
      title="Contact"
    />
  );
}
