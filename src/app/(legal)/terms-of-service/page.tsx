import type { Metadata } from "next";
import { PolicyPage } from "@/components/legal/PolicyPage";
import { createBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Terms of Service",
  description: "Terms of Service for RM Watches Store.",
  pathname: "/terms-of-service",
});

export default function TermsOfServicePage() {
  return (
    <PolicyPage
      breadcrumbs={createBreadcrumbs([
        { label: "Terms of Service", href: "/terms-of-service" },
      ])}
      title="Terms of Service"
    />
  );
}
