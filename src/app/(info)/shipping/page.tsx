import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";
import { createBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Shipping",
  description: "Temporary shipping page for future fulfillment policy content.",
  pathname: "/shipping",
});

export default function ShippingPage() {
  return (
    <PlaceholderPage
      breadcrumbs={createBreadcrumbs([{ label: "Shipping", href: "/shipping" }])}
      description="This placeholder will document shipping information after fulfillment policies are confirmed."
      title="Shipping"
    />
  );
}
