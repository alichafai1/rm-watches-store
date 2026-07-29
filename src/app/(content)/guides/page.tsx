import type { Metadata } from "next";
import { GuideCard } from "@/components/guides/GuideCard";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";
import { getArticlesByType } from "@/lib/data/articles";
import { createBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Guides",
  description: "Temporary guide index for future evergreen watch guides.",
  pathname: "/guides",
});

export default function GuidesPage() {
  const guides = getArticlesByType("guide");

  return (
    <PlaceholderPage
      breadcrumbs={createBreadcrumbs([{ label: "Guides", href: "/guides" }])}
      description="This route will organize evergreen watch buying and care guides when editorial content is available."
      title="Guides"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {guides.map((guide) => (
          <GuideCard guide={guide} key={guide.id} />
        ))}
      </div>
    </PlaceholderPage>
  );
}
