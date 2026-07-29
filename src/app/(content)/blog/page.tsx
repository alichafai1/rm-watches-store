import type { Metadata } from "next";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";
import { getArticlesByType } from "@/lib/data/articles";
import { createBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Blog",
  description: "Temporary blog index for future watch articles.",
  pathname: "/blog",
});

export default function BlogPage() {
  const articles = getArticlesByType("blog");

  return (
    <PlaceholderPage
      breadcrumbs={createBreadcrumbs([{ label: "Blog", href: "/blog" }])}
      description="This route will support timely watch articles and internal links to evergreen guides."
      title="Blog"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {articles.map((article) => (
          <ArticleCard article={article} hrefBase="/blog" key={article.id} />
        ))}
      </div>
    </PlaceholderPage>
  );
}
