import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import type { Collection } from "@/types/collection";

type CollectionSeoSectionProps = {
  collection: Collection;
};

export function CollectionSeoSection({ collection }: CollectionSeoSectionProps) {
  const image = collection.image;

  return (
    <section
      aria-labelledby="collection-seo-heading"
      className="rounded-3xl bg-neutral-100 p-5 sm:p-8 lg:p-10"
    >
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1fr] lg:items-center">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
          {image ? (
            <Image
              alt={image.alt}
              className={cn("object-contain", image.objectClassName)}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              src={image.url}
              unoptimized
            />
          ) : null}
        </div>
        <div>
          <h1
            className="text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl"
            id="collection-seo-heading"
          >
            About {collection.name}
          </h1>
          <p className="mt-4 text-sm leading-7 text-neutral-700 sm:text-base">
            {collection.about ??
              `This short placeholder area is reserved for future SEO content about ${collection.name.toLowerCase()}. Use it to explain the collection style, common use cases, materials, movements, and buying guidance once final product data is connected.`}
          </p>
        </div>
      </div>
    </section>
  );
}
