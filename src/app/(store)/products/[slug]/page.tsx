import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductAboutSection } from "@/components/ecommerce/product-page/ProductAboutSection";
import { ProductFaq } from "@/components/ecommerce/product-page/ProductFaq";
import { ProductFeatures } from "@/components/ecommerce/product-page/ProductFeatures";
import { ProductMainSection } from "@/components/ecommerce/product-page/ProductMainSection";
import { ProductReviews } from "@/components/ecommerce/product-page/ProductReviews";
import { ProductSpecifications } from "@/components/ecommerce/product-page/ProductSpecifications";
import { RelatedProducts } from "@/components/ecommerce/product-page/RelatedProducts";
import { TrustAssurancesSection } from "@/components/ecommerce/TrustAssurancesSection";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import {
  getPrimaryProductCollection,
  getProductBySlug,
  getProductCollectionPath,
  getProducts,
  getRelatedProducts,
} from "@/lib/data/products";
import { createBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { createPageMetadata } from "@/lib/seo/metadata";
import { titleFromSlug } from "@/lib/utils/text";
import { normalizeProductSpecifications } from "@/lib/utils/specifications";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const revalidate = 60;
/** ISR window for CMS product copy, including the RM 35-02 cluster. */

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  const title = product?.seoTitle ?? titleFromSlug(slug);

  return createPageMetadata({
    title,
    description: product?.seoDescription,
    pathname: `/products/${slug}`,
  });
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const collection = getPrimaryProductCollection(product);
  const relatedProducts = await getRelatedProducts(product, 4);
  const breadcrumbs = createBreadcrumbs([
    {
      label: collection?.name ?? "Collection",
      href: collection
        ? getProductCollectionPath(collection.slug)
        : "/collections",
    },
    { label: product.title, href: `/products/${product.slug}` },
  ]);

  return (
    <>
      <Section className="bg-white pt-6 pb-8 sm:pt-8 sm:pb-10" spacing="none">
        <Container>
          <ProductMainSection
            breadcrumbs={breadcrumbs}
            collection={collection}
            product={product}
          />
          <div className="mt-5 sm:mt-10 grid gap-10 lg:grid-cols-[0.85fr_1fr_0.85fr] lg:items-start">
            <ProductSpecifications
              items={normalizeProductSpecifications({
                specifications: product.specifications,
                specificationDetails: product.specificationDetails,
              })}
            />
            <ProductAboutSection about={product.about} />
            <ProductFeatures features={product.features} />
          </div>
          <div className="mt-10 grid gap-10">
            <ProductReviews reviews={product.reviews} />
            <ProductFaq items={product.faq} />
            <RelatedProducts products={relatedProducts} />
          </div>
        </Container>
      </Section>
      <TrustAssurancesSection />
    </>
  );
}
