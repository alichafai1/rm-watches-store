import type { Metadata } from "next";
import { ProductCard } from "@/components/ecommerce/ProductCard";
import { ShopCategorySeo } from "@/components/shop/ShopCategorySeo";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";
import { ResponsiveGrid } from "@/components/ui/ResponsiveGrid";
import { bestSellersSeo } from "@/constants/shop-seo";
import { getBestSellerProducts } from "@/lib/data/products";
import { createBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { createPageMetadata } from "@/lib/seo/metadata";

export const revalidate = 60;

export const metadata: Metadata = createPageMetadata({
  title: "Best Sellers",
  description:
    "Shop best-selling Richard Mille replica and super clone watches — popular skeleton, carbon, and tourbillon-inspired models.",
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
      description={bestSellersSeo.intro}
      title="Best Sellers"
    >
      <div className="grid gap-10">
        <ResponsiveGrid columns="product">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </ResponsiveGrid>
        <ShopCategorySeo content={bestSellersSeo} />
      </div>
    </PlaceholderPage>
  );
}
