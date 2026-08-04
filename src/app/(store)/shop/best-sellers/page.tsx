import type { Metadata } from "next";
import { ProductCard } from "@/components/ecommerce/ProductCard";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";
import { ResponsiveGrid } from "@/components/ui/ResponsiveGrid";
import { getBestSellerProducts } from "@/lib/data/products";
import { createBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { createPageMetadata } from "@/lib/seo/metadata";

export const revalidate = 60;

export const metadata: Metadata = createPageMetadata({
  title: "Best Sellers",
  description: "Temporary best sellers route for future product merchandising.",
  pathname: "/shop/best-sellers",
});

export default async function BestSellersPage() {
  const products = await getBestSellerProducts();

  return (
    <PlaceholderPage
      breadcrumbs={createBreadcrumbs([
        { label: "Shop", href: "/shop" },
        { label: "Best Sellers", href: "/shop/best-sellers" },
      ])}
      description="This placeholder will support best-selling product merchandising after real sales or editorial data exists."
      title="Best Sellers"
    >
      <ResponsiveGrid columns="product">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </ResponsiveGrid>
    </PlaceholderPage>
  );
}
