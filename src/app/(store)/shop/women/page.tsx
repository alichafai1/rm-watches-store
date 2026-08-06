import type { Metadata } from "next";
import { ProductCard } from "@/components/ecommerce/ProductCard";
import { ShopCategorySeo } from "@/components/shop/ShopCategorySeo";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";
import { ResponsiveGrid } from "@/components/ui/ResponsiveGrid";
import { womenWatchesSeo } from "@/constants/shop-seo";
import { getProductsByGender } from "@/lib/data/products";
import { createBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { createPageMetadata } from "@/lib/seo/metadata";

export const revalidate = 60;

export const metadata: Metadata = createPageMetadata({
  title: "Women's Watches",
  description:
    "Shop women’s Richard Mille replica watches — ceramic cases, diamond accents, and elegant skeleton dials.",
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
      description={womenWatchesSeo.intro}
      title="Women's Watches"
    >
      <div className="grid gap-10">
        <ResponsiveGrid columns="product">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </ResponsiveGrid>
        <ShopCategorySeo content={womenWatchesSeo} />
      </div>
    </PlaceholderPage>
  );
}
