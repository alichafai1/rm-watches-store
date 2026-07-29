import { CollectionScroller } from "@/components/home/CollectionScroller";
import { HomeSectionHeader } from "@/components/home/HomeSectionHeader";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import type { Collection } from "@/types/collection";

type NewArrivalCollectionsSectionProps = {
  collections: Collection[];
};

export function NewArrivalCollectionsSection({
  collections,
}: NewArrivalCollectionsSectionProps) {
  return (
    <Section
      ariaLabelledBy="new-arrival-collections-heading"
      className="bg-white"
      spacing="lg"
    >
      <Container>
        <div className="grid min-w-0 gap-8">
          <HomeSectionHeader
            align="center"
            eyebrow="Shop by collection"
            headingId="new-arrival-collections-heading"
            linkHref="/new-arrival-collections"
            linkLabel="View all new arrival collections"
            title="New Arrival"
          />

          <CollectionScroller
            basePath="/new-arrival-collections"
            collections={collections}
          />
        </div>
      </Container>
    </Section>
  );
}
