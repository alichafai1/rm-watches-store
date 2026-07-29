import type { Metadata } from "next";
import { ProductCard } from "@/components/ecommerce/ProductCard";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";
import { getProducts } from "@/lib/data/products";
import { createBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { createPageMetadata } from "@/lib/seo/metadata";

export const revalidate = 60;

export const metadata: Metadata = createPageMetadata({
  title: "Shop",
  description: "Temporary shop index for future ecommerce product listings.",
  pathname: "/shop",
});

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <PlaceholderPage
      breadcrumbs={createBreadcrumbs([{ label: "Shop", href: "/shop" }])}
      description="This route will become the primary product listing page when catalog data and filtering are introduced later."
      title="Shop"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </PlaceholderPage>
  );
}
