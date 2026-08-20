import Link from "next/link";
import type { ReactNode } from "react";
import { StorefrontImage } from "@/components/media/StorefrontImage";
import { cn } from "@/lib/utils/cn";
import type { Collection } from "@/types/collection";

type CollectionSeoSectionProps = {
  collection: Collection;
};

const markdownLinkPattern = /\[([^\]]+)\]\((\/[^)\s]+)\)/g;

function renderInlineLinks(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  markdownLinkPattern.lastIndex = 0;
  while ((match = markdownLinkPattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    nodes.push(
      <Link
        className="font-medium text-neutral-950 underline underline-offset-4"
        href={match[2]}
        key={`about-link-${key++}`}
      >
        {match[1]}
      </Link>,
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

export function CollectionSeoSection({ collection }: CollectionSeoSectionProps) {
  const image = collection.image;
  const aboutText = collection.about ?? collection.description;
  const paragraphs = aboutText.split(/\n\n+/);

  return (
    <section
      aria-labelledby="collection-seo-heading"
      className="rounded-3xl bg-neutral-100 p-5 sm:p-8 lg:p-10"
    >
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1fr] lg:items-center">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
          {image ? (
            <StorefrontImage
              alt={image.alt}
              className={cn("object-contain", image.objectClassName)}
              fill
              preset="collectionSeo"
              sizes="(min-width: 1024px) 40vw, 100vw"
              src={image.url}
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
          <div className="mt-4 grid gap-4">
            {paragraphs.map((paragraph, index) => (
              <p
                className="text-sm leading-7 text-neutral-700 sm:text-base"
                key={`about-p-${index}`}
              >
                {renderInlineLinks(paragraph)}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
