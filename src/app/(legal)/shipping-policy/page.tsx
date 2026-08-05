import type { Metadata } from "next";
import { PolicyPage } from "@/components/legal/PolicyPage";
import { createBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Shipping Policy",
  description: "Shipping Policy for RM Watches Store.",
  pathname: "/shipping-policy",
});

export default function ShippingPolicyPage() {
  return (
    <PolicyPage
      breadcrumbs={createBreadcrumbs([
        { label: "Shipping Policy", href: "/shipping-policy" },
      ])}
      title="Shipping Policy"
    />
  );
}
