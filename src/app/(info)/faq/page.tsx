import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";
import { createBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "FAQ",
  description: "Temporary FAQ page for future customer support content.",
  pathname: "/faq",
});

export default function FaqPage() {
  return (
    <PlaceholderPage
      breadcrumbs={createBreadcrumbs([{ label: "FAQ", href: "/faq" }])}
      description="This placeholder will answer common customer questions once policies and operations are defined."
      title="FAQ"
    />
  );
}
