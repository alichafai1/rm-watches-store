import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";
import { createBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Privacy Policy",
  description: "Temporary privacy policy page for future legal content.",
  pathname: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <PlaceholderPage
      breadcrumbs={createBreadcrumbs([
        { label: "Privacy Policy", href: "/privacy-policy" },
      ])}
      description="This placeholder will contain privacy policy content after legal review."
      title="Privacy Policy"
    />
  );
}
