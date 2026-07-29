import { getCollections } from "@/lib/data/collections";
import { getNewArrivalCollections } from "@/lib/data/new-arrival-collections";
import type { AdminCollectionOption } from "@/components/admin/CollectionSelect";

export function getAdminCollectionOptions(): AdminCollectionOption[] {
  const featured = getCollections().map((collection) => ({
    id: collection.id,
    name: collection.name,
    slug: collection.slug,
    group: "Featured" as const,
  }));

  const newArrivals = getNewArrivalCollections().map((collection) => ({
    id: collection.id,
    name: collection.name,
    slug: collection.slug,
    group: "New Arrival" as const,
  }));

  return [...featured, ...newArrivals];
}
