import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleDetail } from "@/components/content/ArticleDetail";
import { JsonLd } from "@/components/seo/JsonLd";
import { getArticleBySlug, getArticlesByType } from "@/lib/data/articles";
import { createPageMetadata } from "@/lib/seo/metadata";
import { createArticleSchema } from "@/lib/seo/schema/article";
import { canonicalUrl } from "@/lib/seo/urls";
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
  const title = guide?.seoTitle ?? titleFromSlug(slug);
  const description = guide?.seoDescription ?? guide?.excerpt;
  const base = createPageMetadata({
    title,
    description,
    pathname: `/guides/${slug}`,
  });

  return guide?.image
    ? {
        ...base,
        openGraph: {
          title,
          description,
          url: canonicalUrl(`/guides/${slug}`),
          type: "article",
          publishedTime: guide.publishedAt,
          modifiedTime: guide.updatedAt,
          images: [
            {
              url: guide.image.url,
              width: guide.image.width,
              height: guide.image.height,
              alt: guide.image.alt,
            },
          ],
        },
        twitter: {
          card: "summary_large_image",
          title,
          description,
          images: [guide.image.url],
        },
      }
    : base;
}

export default async function GuideDetailPage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = await getArticleBySlug(slug);

  if (!guide || guide.type !== "guide") {
    notFound();
  }

  const url = canonicalUrl(`/guides/${guide.slug}`);
  return (
    <>
      <JsonLd data={createArticleSchema(guide, url)} />
      <ArticleDetail article={guide} />
    </>
  );
}
