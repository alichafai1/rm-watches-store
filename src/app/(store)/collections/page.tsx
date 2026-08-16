import type { Metadata } from "next";
import { CollectionCard } from "@/components/ecommerce/CollectionCard";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";
import { getCollections } from "@/lib/data/collections";
import { createBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Collections",
  description:
    "Shop Richard Mille replica collections by model, including replica Richard Mille watch and super clone styles.",
  pathname: "/collections",
});

export default function CollectionsPage() {
  const collections = getCollections();

  return (
    <PlaceholderPage
      breadcrumbs={createBreadcrumbs([
        { label: "Collections", href: "/collections" },
      ])}
      description="Browse our Richard Mille replica collections, grouped by model so you can compare case styles, skeleton layouts, and finishing before you open a product page. Each collection gathers Richard Mille replica watch options around one reference, from early tourbillons to later sports automatics. If you are looking for a replica Richard Mille watch with a specific silhouette, start here rather than scrolling a mixed catalog. Shoppers comparing Richard Mille replicas can move from a collection card into detailed photos, prices, and variants. We also list Richard Mille super clone styles where the finishing and movement presentation matter most. Choose a model collection to see the watches currently available."
      title="Collections"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {collections.map((collection) => (
          <CollectionCard collection={collection} key={collection.id} />
        ))}
      </div>
    </PlaceholderPage>
  );
}
