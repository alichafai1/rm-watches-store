import type { Metadata } from "next";
import { PolicyPage } from "@/components/legal/PolicyPage";
import { createBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Refund & Return Policy",
  description: "Refund and Return Policy for RM Watches Store.",
  pathname: "/refund-return-policy",
});

export default function RefundReturnPolicyPage() {
  return (
    <PolicyPage
      breadcrumbs={createBreadcrumbs([
        { label: "Refund & Return Policy", href: "/refund-return-policy" },
      ])}
      title="Refund & Return Policy"
    />
  );
}
