import type { Metadata } from "next";
import { CollectionCard } from "@/components/ecommerce/CollectionCard";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";
import { getCollections } from "@/lib/data/collections";
import { createBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Collections",
  description: "Temporary collections index for future watch collection pages.",
  pathname: "/collections",
});

export default function CollectionsPage() {
  const collections = getCollections();

  return (
    <PlaceholderPage
      breadcrumbs={createBreadcrumbs([
        { label: "Collections", href: "/collections" },
      ])}
      description="This route will list curated watch collections once real collection data is connected."
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
