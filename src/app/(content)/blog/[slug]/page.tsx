import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";
import { getArticleBySlug, getArticlesByType } from "@/lib/data/articles";
import { createBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { createPageMetadata } from "@/lib/seo/metadata";
import { titleFromSlug } from "@/lib/utils/text";

type BlogArticlePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return getArticlesByType("blog").map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: BlogArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  const title = article?.seoTitle ?? titleFromSlug(slug);

  return createPageMetadata({
    title,
    description: article?.seoDescription,
    pathname: `/blog/${slug}`,
  });
}

export default async function BlogArticlePage({
  params,
}: BlogArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article || article.type !== "blog") {
    notFound();
  }

  return (
    <PlaceholderPage
      breadcrumbs={createBreadcrumbs([
        { label: "Blog", href: "/blog" },
        { label: article.title, href: `/blog/${article.slug}` },
      ])}
      description={article.excerpt}
      title={article.title}
    />
  );
}
