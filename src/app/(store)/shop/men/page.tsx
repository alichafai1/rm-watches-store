import type { Metadata } from "next";
import { ProductCard } from "@/components/ecommerce/ProductCard";
import { ShopCategorySeo } from "@/components/shop/ShopCategorySeo";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";
import { ResponsiveGrid } from "@/components/ui/ResponsiveGrid";
import { menWatchesSeo } from "@/constants/shop-seo";
import { getProductsByGender } from "@/lib/data/products";
import { createBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { createPageMetadata } from "@/lib/seo/metadata";

export const revalidate = 60;

export const metadata: Metadata = createPageMetadata({
  title: "Men's Watches",
  description:
    "Shop men’s Richard Mille replica watches — carbon cases, skeleton dials, and bold sport-luxury straps.",
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
      description={menWatchesSeo.intro}
      title="Men's Watches"
    >
      <div className="grid gap-10">
        <ResponsiveGrid columns="product">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </ResponsiveGrid>
        <ShopCategorySeo content={menWatchesSeo} />
      </div>
    </PlaceholderPage>
  );
}
