import type { MetadataRoute } from "next";
import { staticRoutes } from "@/constants/routes";
import { siteConfig } from "@/constants/site";
import { getCollections } from "@/lib/data/collections";
import { getNewArrivalCollections } from "@/lib/data/new-arrival-collections";
import { getPublishedCmsProducts } from "@/lib/data/cms-products";
import { getPublishedCmsArticles } from "@/lib/data/cms-articles";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const collectionRoutes = getCollections().map((collection) => ({
    href: `/collections/${collection.slug}`,
  }));
  const newArrivalCollectionRoutes = getNewArrivalCollections().map(
    (collection) => ({
      href: `/new-arrival-collections/${collection.slug}`,
    }),
  );
  const [cmsProducts, cmsArticles] = await Promise.all([
    getPublishedCmsProducts(),
    getPublishedCmsArticles(),
  ]);
  const productRoutes = cmsProducts.map((product) => ({
    href: `/products/${product.slug}`,
  }));
  const articleRoutes = cmsArticles.map((article) => ({
    href: `/${article.type === "guide" ? "guides" : "blog"}/${article.slug}`,
    lastModified: article.updatedAt ? new Date(article.updatedAt) : now,
  }));
  const routes: Array<{ href: string; lastModified?: Date }> = [
    ...staticRoutes,
    ...collectionRoutes,
    ...newArrivalCollectionRoutes,
    ...productRoutes,
    ...articleRoutes,
  ];

  return routes.map((route) => ({
    url: new URL(route.href, siteConfig.url).toString(),
    lastModified: route.lastModified ?? now,
    changeFrequency: route.href === "/" ? "weekly" : "monthly",
    priority: route.href === "/" ? 1 : 0.7,
  }));
}
