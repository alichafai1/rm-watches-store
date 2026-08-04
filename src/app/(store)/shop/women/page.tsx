import type { Metadata } from "next";
import { ProductCard } from "@/components/ecommerce/ProductCard";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";
import { ResponsiveGrid } from "@/components/ui/ResponsiveGrid";
import { getProductsByGender } from "@/lib/data/products";
import { createBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { createPageMetadata } from "@/lib/seo/metadata";

export const revalidate = 60;

export const metadata: Metadata = createPageMetadata({
  title: "Women's Watches",
  description: "Temporary women's watches route for future product listings.",
  pathname: "/shop/women",
});

export default async function WomenWatchesPage() {
  const products = await getProductsByGender("women");

  return (
    <PlaceholderPage
      breadcrumbs={createBreadcrumbs([
        { label: "Shop", href: "/shop" },
        { label: "Women's Watches", href: "/shop/women" },
      ])}
      description="This placeholder route is prepared for a women's watches landing page once product data exists."
      title="Women's Watches"
    >
      <ResponsiveGrid columns="product">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </ResponsiveGrid>
    </PlaceholderPage>
  );
}
