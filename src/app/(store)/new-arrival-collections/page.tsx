import type { Metadata } from "next";
import { CollectionCard } from "@/components/ecommerce/CollectionCard";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";
import { getNewArrivalCollections } from "@/lib/data/new-arrival-collections";
import { createBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "New Arrival",
  description:
    "Browse new arrival watch collections with clear paths into the catalog.",
  pathname: "/new-arrival-collections",
});

export default function NewArrivalCollectionsPage() {
  const collections = getNewArrivalCollections();

  return (
    <PlaceholderPage
      breadcrumbs={createBreadcrumbs([
        { label: "New Arrival", href: "/new-arrival-collections" },
      ])}
      description="This route lists new arrival watch collections."
      title="New Arrival"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {collections.map((collection) => (
          <CollectionCard
            basePath="/new-arrival-collections"
            collection={collection}
            key={collection.id}
          />
        ))}
      </div>
    </PlaceholderPage>
  );
}
