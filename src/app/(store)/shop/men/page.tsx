import type { Metadata } from "next";
import { ProductCard } from "@/components/ecommerce/ProductCard";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";
import { getProductsByGender } from "@/lib/data/products";
import { createBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { createPageMetadata } from "@/lib/seo/metadata";

export const revalidate = 60;

export const metadata: Metadata = createPageMetadata({
  title: "Men's Watches",
  description: "Temporary men's watches route for future product listings.",
  pathname: "/shop/men",
});

export default async function MenWatchesPage() {
  const products = await getProductsByGender("men");

  return (
    <PlaceholderPage
      breadcrumbs={createBreadcrumbs([
        { label: "Shop", href: "/shop" },
        { label: "Men's Watches", href: "/shop/men" },
      ])}
      description="This placeholder route is prepared for a men's watches landing page once product data exists."
      title="Men's Watches"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </PlaceholderPage>
  );
}
