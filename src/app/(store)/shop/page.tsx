import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/ecommerce/ProductCard";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";
import { ResponsiveGrid } from "@/components/ui/ResponsiveGrid";
import { getProducts } from "@/lib/data/products";
import { createBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { createPageMetadata } from "@/lib/seo/metadata";

export const revalidate = 60;

const shopTitle = "Richard Mille Replica Watches for Sale | RM Super Clones";
const shopDescription =
  "Shop Richard Mille replica watches and RM super clones. Browse available models, compare specifications, designs, quality options, prices, and new arrivals.";
const shopIntro =
  "Shop Richard Mille replica watches across popular RM collections and newly added models. Compare super clone Richard Mille watches by design, case style, dial, strap, specifications, quality options, and price. Browse the available catalog below and open any watch for detailed product images, specifications, pricing, and ordering information.";

export const metadata: Metadata = {
  ...createPageMetadata({
    title: shopTitle,
    description: shopDescription,
    pathname: "/shop",
  }),
  title: {
    absolute: shopTitle,
  },
};

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <PlaceholderPage
      breadcrumbs={createBreadcrumbs([{ label: "Shop", href: "/shop" }])}
      description={shopIntro}
      title="Richard Mille Replica Watches"
    >
      <div className="grid gap-10">
        <ResponsiveGrid columns="product">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </ResponsiveGrid>
        <div className="grid max-w-2xl gap-1.5 text-sm leading-6 text-neutral-600">
          <p className="flex flex-wrap items-baseline gap-x-1.5 gap-y-1">
            <span>Looking for a specific RM model?</span>
            <Link
              className="inline-flex whitespace-nowrap font-medium text-neutral-950 underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-900"
              href="/collections"
            >
              Browse collections
            </Link>
            <span>or</span>
            <span className="inline-flex items-baseline whitespace-nowrap">
              <Link
                className="font-medium text-neutral-950 underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-900"
                href="/new-arrival-collections"
              >
                new arrival collections
              </Link>
              .
            </span>
          </p>
          <p className="flex flex-wrap items-baseline gap-x-1.5 gap-y-1">
            <span>You can also shop</span>
            <Link
              className="inline-flex whitespace-nowrap font-medium text-neutral-950 underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-900"
              href="/shop/new-arrivals"
            >
              new arrivals
            </Link>
            <span>and</span>
            <span className="inline-flex items-baseline whitespace-nowrap">
              <Link
                className="font-medium text-neutral-950 underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-900"
                href="/shop/best-sellers"
              >
                best sellers
              </Link>
              .
            </span>
          </p>
        </div>
      </div>
    </PlaceholderPage>
  );
}
