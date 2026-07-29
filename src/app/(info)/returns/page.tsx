import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";
import { createBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Returns",
  description: "Temporary returns page for future policy content.",
  pathname: "/returns",
});

export default function ReturnsPage() {
  return (
    <PlaceholderPage
      breadcrumbs={createBreadcrumbs([{ label: "Returns", href: "/returns" }])}
      description="This placeholder will document return policies after operations are confirmed."
      title="Returns"
    />
  );
}
