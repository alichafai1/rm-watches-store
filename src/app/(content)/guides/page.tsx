import type { Metadata } from "next";
import { GuideCard } from "@/components/guides/GuideCard";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";
import { getArticlesByType } from "@/lib/data/articles";
import { createBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Watch Guides | Expert Buying & Ownership Advice",
  description:
    "Explore practical watch guides for choosing, comparing, wearing, and caring for luxury watches.",
  pathname: "/guides",
});

export const revalidate = 60;

export default async function GuidesPage() {
  const guides = await getArticlesByType("guide");

  return (
    <PlaceholderPage
      breadcrumbs={createBreadcrumbs([{ label: "Guides", href: "/guides" }])}
      description="Detailed resources to help you choose, understand, and care for your watch."
      title="Watch Guides"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {guides.map((guide) => (
          <GuideCard guide={guide} key={guide.id} />
        ))}
      </div>
    </PlaceholderPage>
  );
}
