import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectionFaq } from "@/components/collections/CollectionFaq";
import { CollectionHeader } from "@/components/collections/CollectionHeader";
import { CollectionProductGrid } from "@/components/collections/CollectionProductGrid";
import { CollectionSeoSection } from "@/components/collections/CollectionSeoSection";
import { TrustAssurancesSection } from "@/components/ecommerce/TrustAssurancesSection";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import {
  getCollectionBySlug,
  getCollectionProducts,
  getCollections,
} from "@/lib/data/collections";
import { createBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { createPageMetadata } from "@/lib/seo/metadata";
import { titleFromSlug } from "@/lib/utils/text";

type CollectionPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return getCollections().map((collection) => ({
    slug: collection.slug,
  }));
}

export async function generateMetadata({
  params,
}: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  const title = collection?.seoTitle ?? titleFromSlug(slug);

  return createPageMetadata({
    title,
    description: collection?.seoDescription ?? collection?.description,
    pathname: `/collections/${slug}`,
  });
}

export default async function CollectionDetailPage({
  params,
}: CollectionPageProps) {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);

  if (!collection) {
    notFound();
  }

  const products = await getCollectionProducts(collection);
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
          </div>
        </Container>
      </Section>
      <TrustAssurancesSection />
    </>
  );
}
