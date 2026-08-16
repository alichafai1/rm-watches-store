import type { Metadata } from "next";
import { CollectionCard } from "@/components/ecommerce/CollectionCard";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";
import { getNewArrivalCollections } from "@/lib/data/new-arrival-collections";
import { createBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "New Arrival",
  description:
    "Browse newly added Richard Mille replica watch collections and recently listed RM model styles.",
  pathname: "/new-arrival-collections",
});

export default function NewArrivalCollectionsPage() {
  const collections = getNewArrivalCollections();

  return (
    <PlaceholderPage
      breadcrumbs={createBreadcrumbs([
        { label: "New Arrival", href: "/new-arrival-collections" },
      ])}
      description="These new arrival collections highlight recently added Richard Mille replica watch styles, from compact ladies references to later sports and racing models. Each card leads to a focused model page so you can review the newest replica Richard Mille pieces without mixing them into the main catalog. Browse newly listed Richard Mille swiss replicas and superclone options when you want a current colorway or a recently added silhouette. Open a collection to compare photos, prices, and available versions of that exact RM number."
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
