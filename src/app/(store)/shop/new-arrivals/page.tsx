import type { Metadata } from "next";
import { ProductCard } from "@/components/ecommerce/ProductCard";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";
import { getNewArrivalProducts } from "@/lib/data/products";
import { createBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { createPageMetadata } from "@/lib/seo/metadata";

export const revalidate = 60;

export const metadata: Metadata = createPageMetadata({
  title: "New Arrivals",
  description: "Temporary new arrivals route for future product merchandising.",
  pathname: "/shop/new-arrivals",
});

export default async function NewArrivalsPage() {
  const products = await getNewArrivalProducts();

  return (
    <PlaceholderPage
      breadcrumbs={createBreadcrumbs([
        { label: "Shop", href: "/shop" },
        { label: "New Arrivals", href: "/shop/new-arrivals" },
      ])}
      description="This placeholder will support newly published products when catalog data is connected."
      title="New Arrivals"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </PlaceholderPage>
  );
}
