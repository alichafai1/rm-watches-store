import type { Metadata } from "next";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";
import { ResponsiveGrid } from "@/components/ui/ResponsiveGrid";
import { getArticlesByType } from "@/lib/data/articles";
import { createBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Watch Blog | Buying Advice, Care & Style",
  description:
    "Read expert watch articles covering buying advice, watch care, movements, materials, and style.",
  pathname: "/blog",
});

export const revalidate = 60;

export default async function BlogPage() {
  const articles = await getArticlesByType("blog");

  return (
    <PlaceholderPage
      breadcrumbs={createBreadcrumbs([{ label: "Blog", href: "/blog" }])}
      description="Expert articles on choosing, understanding, styling, and caring for your watch."
      title="Watch Blog"
    >
      <ResponsiveGrid columns="three">
        {articles.map((article) => (
          <ArticleCard article={article} hrefBase="/blog" key={article.id} />
        ))}
      </ResponsiveGrid>
    </PlaceholderPage>
  );
}
