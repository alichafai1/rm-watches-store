import Image from "next/image";
import Link from "next/link";
import { CollectionCardBase } from "@/components/ecommerce/CollectionCardBase";
import type { Collection } from "@/types/collection";

type CollectionCardProps = {
  basePath?: string;
  collection: Collection;
  headingLevel?: "h2" | "h3";
};

export function CollectionCard({
  basePath = "/collections",
  collection,
  headingLevel = "h2",
}: CollectionCardProps) {
  const Heading = headingLevel;

  return (
    <CollectionCardBase
      media={
        collection.image ? (
          <Image
            alt={collection.image.alt}
            className="aspect-square w-full rounded object-cover"
            height={collection.image.height}
            src={collection.image.url}
            width={collection.image.width}
          />
        ) : null
      }
    >
      <Heading className="text-base font-semibold">
        <Link href={`${basePath}/${collection.slug}`}>{collection.name}</Link>
      </Heading>
      <p className="text-sm text-neutral-700">{collection.description}</p>
    </CollectionCardBase>
  );
}
