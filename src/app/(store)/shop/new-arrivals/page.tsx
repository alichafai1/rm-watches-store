import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/ecommerce/ProductCard";
import { ShopCategorySeo } from "@/components/shop/ShopCategorySeo";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";
import { ResponsiveGrid } from "@/components/ui/ResponsiveGrid";
import { newArrivalsSeo } from "@/constants/shop-seo";
import { getNewArrivalProducts } from "@/lib/data/products";
import { createBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { createPageMetadata } from "@/lib/seo/metadata";

export const revalidate = 60;

export const metadata: Metadata = createPageMetadata({
  title: "New Arrivals",
  description:
    "Browse the latest Richard Mille replica and super clone watches newly added to the catalog.",
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
      description={newArrivalsSeo.intro}
      title="New Arrivals"
    >
      <div className="grid gap-10">
        <ResponsiveGrid columns="product">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </ResponsiveGrid>
        <ShopCategorySeo content={newArrivalsSeo} />
        <p className="max-w-3xl text-sm leading-6 text-neutral-600">
          Prefer model families?{" "}
          <Link
            className="font-medium text-neutral-950 underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-900"
            href="/new-arrival-collections"
          >
            Browse New Arrival collections
          </Link>
          .
        </p>
      </div>
    </PlaceholderPage>
  );
}
