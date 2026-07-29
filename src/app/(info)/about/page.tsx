import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";
import { createBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "About",
  description: "Temporary about page for the watch ecommerce foundation.",
  pathname: "/about",
});

export default function AboutPage() {
  return (
    <PlaceholderPage
      breadcrumbs={createBreadcrumbs([{ label: "About", href: "/about" }])}
      description="This placeholder will describe the business once real brand content is available."
      title="About"
    />
  );
}
