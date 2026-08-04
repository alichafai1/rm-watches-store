import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleDetail } from "@/components/content/ArticleDetail";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  getArticleBySlug,
  getArticlesByType,
  getRelatedArticles,
} from "@/lib/data/articles";
import { createPageMetadata } from "@/lib/seo/metadata";
import { createArticleSchema } from "@/lib/seo/schema/article";
import { createBreadcrumbSchema } from "@/lib/seo/schema/breadcrumb";
import { absoluteUrl, canonicalUrl } from "@/lib/seo/urls";
import { titleFromSlug } from "@/lib/utils/text";

type GuidePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const revalidate = 60;

export async function generateStaticParams() {
  return (await getArticlesByType("guide")).map((guide) => ({
    slug: guide.slug,
  }));
}

export async function generateMetadata({
  params,
}: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = await getArticleBySlug(slug);
  const publishedGuide =
    guide?.type === "guide" && guide.status === "published" ? guide : null;
  const title = publishedGuide?.seoTitle ?? titleFromSlug(slug);
  const description = publishedGuide?.seoDescription ?? publishedGuide?.excerpt;
  const base = createPageMetadata({
    title,
    description,
    pathname: `/guides/${slug}`,
  });

  if (!publishedGuide) {
    return {
      ...base,
      robots: { index: false, follow: false },
    };
  }

  const image = publishedGuide.image
    ? {
        url: absoluteUrl(publishedGuide.image.url),
        width: publishedGuide.image.width,
        height: publishedGuide.image.height,
        alt: publishedGuide.image.alt,
      }
    : undefined;

  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      title,
      description,
      url: canonicalUrl(`/guides/${slug}`),
      type: "article",
      publishedTime: publishedGuide.publishedAt,
      modifiedTime: publishedGuide.updatedAt,
      images: image ? [image] : undefined,
    },
    twitter: {
      ...base.twitter,
      card: "summary_large_image",
      title,
      description,
      images: image ? [image.url] : undefined,
    },
  };
}

export default async function GuideDetailPage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = await getArticleBySlug(slug);

  if (!guide || guide.type !== "guide") {
    notFound();
  }

  const url = canonicalUrl(`/guides/${guide.slug}`);
  const relatedArticles = await getRelatedArticles(guide);
  const breadcrumbs = [
    { label: "Home", href: absoluteUrl("/") },
    { label: "Guides", href: absoluteUrl("/guides") },
    { label: guide.title, href: url },
  ];
  return (
    <>
      <JsonLd data={createArticleSchema(guide, url)} />
      <JsonLd data={createBreadcrumbSchema(breadcrumbs)} />
      <ArticleDetail article={guide} relatedArticles={relatedArticles} />
    </>
  );
}
