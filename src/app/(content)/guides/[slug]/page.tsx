import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";
import { getArticleBySlug, getArticlesByType } from "@/lib/data/articles";
import { createBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { createPageMetadata } from "@/lib/seo/metadata";
import { titleFromSlug } from "@/lib/utils/text";

type GuidePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return getArticlesByType("guide").map((guide) => ({
    slug: guide.slug,
  }));
}

export async function generateMetadata({
  params,
}: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getArticleBySlug(slug);
  const title = guide?.seoTitle ?? titleFromSlug(slug);

  return createPageMetadata({
    title,
    description: guide?.seoDescription,
    pathname: `/guides/${slug}`,
  });
}

export default async function GuideDetailPage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = getArticleBySlug(slug);

  if (!guide || guide.type !== "guide") {
    notFound();
  }

  return (
    <PlaceholderPage
      breadcrumbs={createBreadcrumbs([
        { label: "Guides", href: "/guides" },
        { label: guide.title, href: `/guides/${guide.slug}` },
      ])}
      description={guide.excerpt}
      title={guide.title}
    />
  );
}
