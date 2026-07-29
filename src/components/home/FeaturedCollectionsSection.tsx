import { CollectionScroller } from "@/components/home/CollectionScroller";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { HomeSectionHeader } from "@/components/home/HomeSectionHeader";
import type { Collection } from "@/types/collection";

type FeaturedCollectionsSectionProps = {
  collections: Collection[];
};

export function FeaturedCollectionsSection({
  collections,
}: FeaturedCollectionsSectionProps) {
  return (
    <Section ariaLabelledBy="featured-collections-heading" className="bg-white" spacing="lg">
      <Container>
        <div className="grid min-w-0 gap-8">
          <HomeSectionHeader
            align="center"
            eyebrow="Shop by collection"
            headingId="featured-collections-heading"
            linkHref="/collections"
            linkLabel="View all collections"
            title="Featured Collections"
          />

          <CollectionScroller collections={collections} />
        </div>
      </Container>
    </Section>
  );
}
