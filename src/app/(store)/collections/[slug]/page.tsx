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
  getCollectionByLegacySlug,
  getCollectionBySlug,
  getCollectionProducts,
  getCollections,
} from "@/lib/data/collections";
import { getNewArrivalCollectionBySlug } from "@/lib/data/new-arrival-collections";
import { createBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { createPageMetadata } from "@/lib/seo/metadata";
import { titleFromSlug } from "@/lib/utils/text";

type CollectionPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const revalidate = 60;

export function generateStaticParams() {
  return getCollections().map((collection) => ({
    slug: collection.slug,
  }));
}

export async function generateMetadata({
  params,
}: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection =
    getCollectionBySlug(slug) ?? getCollectionByLegacySlug(slug);
  const title = collection?.seoTitle ?? titleFromSlug(slug);

  return createPageMetadata({
    title,
    description: collection?.seoDescription ?? collection?.description,
    pathname: `/collections/${collection?.slug ?? slug}`,
  });
}

export default async function CollectionDetailPage({
  params,
}: CollectionPageProps) {
  const { slug } = await params;
  const legacyCollection = getCollectionByLegacySlug(slug);
  if (legacyCollection) {
    permanentRedirect(`/collections/${legacyCollection.slug}`);
  }

  // New-arrival collections live under /new-arrival-collections/[slug].
  // Redirect misplaced /collections/{slug} requests so they don't 404.
  const newArrivalCollection = getNewArrivalCollectionBySlug(slug);
  if (newArrivalCollection) {
    permanentRedirect(
      `/new-arrival-collections/${newArrivalCollection.slug}`,
    );
  }

  const collection = getCollectionBySlug(slug);

  if (!collection) {
    notFound();
  }

  const products = await getCollectionProducts(collection);
  const relatedCollections = getRelatedCollections("collection", collection.slug);
  const breadcrumbs = createBreadcrumbs([
    { label: "Collections", href: "/collections" },
    { label: collection.name, href: `/collections/${collection.slug}` },
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
