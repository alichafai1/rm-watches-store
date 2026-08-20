import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { CollectionFaq } from "@/components/collections/CollectionFaq";
import { CollectionHeader } from "@/components/collections/CollectionHeader";
import { CollectionProductGrid } from "@/components/collections/CollectionProductGrid";
import { CollectionSeoSection } from "@/components/collections/CollectionSeoSection";
import { RelatedCollections } from "@/components/collections/RelatedCollections";
import { TrustAssurancesSection } from "@/components/ecommerce/TrustAssurancesSection";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { getRelatedCollections } from "@/lib/collections/related-collections";
import {
  getNewArrivalCollectionByLegacySlug,
  getNewArrivalCollectionBySlug,
  getNewArrivalCollectionProducts,
  getNewArrivalCollections,
} from "@/lib/data/new-arrival-collections";
import { createBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { createPageMetadata } from "@/lib/seo/metadata";
import { titleFromSlug } from "@/lib/utils/text";

type NewArrivalCollectionPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const revalidate = 60;

export function generateStaticParams() {
  return getNewArrivalCollections().map((collection) => ({
    slug: collection.slug,
  }));
}

export async function generateMetadata({
  params,
}: NewArrivalCollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection =
    getNewArrivalCollectionBySlug(slug) ??
    getNewArrivalCollectionByLegacySlug(slug);
  const title = collection?.seoTitle ?? titleFromSlug(slug);

  return createPageMetadata({
    title,
    description: collection?.seoDescription ?? collection?.description,
    pathname: `/new-arrival-collections/${collection?.slug ?? slug}`,
  });
}

export default async function NewArrivalCollectionDetailPage({
  params,
}: NewArrivalCollectionPageProps) {
  const { slug } = await params;
  const legacyCollection = getNewArrivalCollectionByLegacySlug(slug);
  if (legacyCollection) {
    permanentRedirect(`/new-arrival-collections/${legacyCollection.slug}`);
  }

  const collection = getNewArrivalCollectionBySlug(slug);

  if (!collection) {
    notFound();
  }

  const products = await getNewArrivalCollectionProducts(collection);
  const relatedCollections = getRelatedCollections(
    "new-arrival",
    collection.slug,
  );
  const breadcrumbs = createBreadcrumbs([
    { label: "New Arrival", href: "/new-arrival-collections" },
    {
      label: collection.name,
      href: `/new-arrival-collections/${collection.slug}`,
    },
  ]);

  return (
    <>
      <Section className="bg-white" spacing="lg">
        <Container>
          <Breadcrumbs items={breadcrumbs} />
          <div className="grid gap-10">
            <CollectionHeader
              collection={collection}
              productCount={products.length}
            />
            <CollectionProductGrid products={products} />
            <CollectionSeoSection collection={collection} />
            <CollectionFaq items={collection.faq ?? []} />
            <RelatedCollections items={relatedCollections} />
          </div>
        </Container>
      </Section>
      <TrustAssurancesSection />
    </>
  );
}
