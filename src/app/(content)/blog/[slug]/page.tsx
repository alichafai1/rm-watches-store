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
  const publishedArticle =
    article?.type === "blog" && article.status === "published" ? article : null;
  const title = publishedArticle?.seoTitle ?? titleFromSlug(slug);
  const description =
    publishedArticle?.seoDescription ?? publishedArticle?.excerpt;
  const base = createPageMetadata({
    title,
    description,
    pathname: `/blog/${slug}`,
  });

  if (!publishedArticle) {
    return {
      ...base,
      robots: { index: false, follow: false },
    };
  }

  const image = publishedArticle.image
    ? {
        url: absoluteUrl(publishedArticle.image.url),
        width: publishedArticle.image.width,
        height: publishedArticle.image.height,
        alt: publishedArticle.image.alt,
      }
    : undefined;

  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      title,
      description,
      url: canonicalUrl(`/blog/${slug}`),
      type: "article",
      publishedTime: publishedArticle.publishedAt,
      modifiedTime: publishedArticle.updatedAt,
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

export default async function BlogArticlePage({
  params,
}: BlogArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article || article.type !== "blog") {
    notFound();
  }

  const url = canonicalUrl(`/blog/${article.slug}`);
  const relatedArticles = await getRelatedArticles(article);
  const breadcrumbs = [
    { label: "Home", href: absoluteUrl("/") },
    { label: "Blog", href: absoluteUrl("/blog") },
    { label: article.title, href: url },
  ];
  return (
    <>
      <JsonLd data={createArticleSchema(article, url)} />
      <JsonLd data={createBreadcrumbSchema(breadcrumbs)} />
      <ArticleDetail article={article} relatedArticles={relatedArticles} />
    </>
  );
}
