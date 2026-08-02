import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleDetail } from "@/components/content/ArticleDetail";
import { JsonLd } from "@/components/seo/JsonLd";
import { getArticleBySlug, getArticlesByType } from "@/lib/data/articles";
import { createPageMetadata } from "@/lib/seo/metadata";
import { createArticleSchema } from "@/lib/seo/schema/article";
import { canonicalUrl } from "@/lib/seo/urls";
import { titleFromSlug } from "@/lib/utils/text";

type BlogArticlePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const revalidate = 60;

export async function generateStaticParams() {
  return (await getArticlesByType("blog")).map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: BlogArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  const title = article?.seoTitle ?? titleFromSlug(slug);
  const description = article?.seoDescription ?? article?.excerpt;
  const base = createPageMetadata({
    title,
    description,
    pathname: `/blog/${slug}`,
  });

  return article?.image
    ? {
        ...base,
        openGraph: {
          title,
          description,
          url: canonicalUrl(`/blog/${slug}`),
          type: "article",
          publishedTime: article.publishedAt,
          modifiedTime: article.updatedAt,
          images: [
            {
              url: article.image.url,
              width: article.image.width,
              height: article.image.height,
              alt: article.image.alt,
            },
          ],
        },
        twitter: {
          card: "summary_large_image",
          title,
          description,
          images: [article.image.url],
        },
      }
    : base;
}

export default async function BlogArticlePage({
  params,
}: BlogArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article || article.type !== "blog") {
    notFound();
  }

  const url = canonicalUrl(`/blog/${article.slug}`);
  return (
    <>
      <JsonLd data={createArticleSchema(article, url)} />
      <ArticleDetail article={article} />
    </>
  );
}
