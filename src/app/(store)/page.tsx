import type { Metadata } from "next";
import {
  BenefitsSection,
  EditorialSection,
  FaqSection,
  FeaturedCollectionsSection,
  HeroSection,
  NewArrivalCollectionsSection,
  ProductSection,
  CustomerExperiencesSection,
} from "@/components/home";
import { TrustAssurancesSection } from "@/components/ecommerce/TrustAssurancesSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { getLatestArticles, getFeaturedGuide } from "@/lib/data/articles";
import { getFeaturedCollections } from "@/lib/data/collections";
import { getFeaturedNewArrivalCollections } from "@/lib/data/new-arrival-collections";
import { getCustomerReviews } from "@/lib/data/customer-reviews";
import {
  getHomepageBestSellerProducts,
  getHomepageNewArrivalProducts,
} from "@/lib/data/products";
import { createPageMetadata } from "@/lib/seo/metadata";
import { createFaqPageSchema } from "@/lib/seo/schema/faq-page";
import { homepageFaqItems } from "@/mock/homepage-faq";

const homepageTitle = "Richard Mille Replica Watches | Super Clone RM Watches";
const homepageDescription =
  "Shop Richard Mille replica watches and super clone RM models. Compare popular collections, new arrivals, specifications, prices, and product details.";

export const metadata: Metadata = {
  ...createPageMetadata({
    title: homepageTitle,
    description: homepageDescription,
    pathname: "/",
  }),
  title: {
    absolute: homepageTitle,
  },
};

export const revalidate = 60;

/**
 * Do not wrap below-fold content in Suspense. Next.js streaming emits
 * `<!--/$-->` markers and an inline `"/$"` script string that Googlebot
 * treats as https://www.rm-replica.com/$ (GSC 404).
 */
export default async function HomePage() {
  return (
    <>
      <JsonLd data={createFaqPageSchema(homepageFaqItems)} />
      <HeroSection />
      <div className="home-below-fold">
        <HomePageBelowFold />
      </div>
    </>
  );
}

async function HomePageBelowFold() {
  const featuredCollections = getFeaturedCollections(20);
  const newArrivalCollections = getFeaturedNewArrivalCollections(20);
  const [bestSellerProducts, newArrivalProducts, featuredGuide, latestArticles] =
    await Promise.all([
      getHomepageBestSellerProducts(4),
      getHomepageNewArrivalProducts(4),
      getFeaturedGuide(),
      getLatestArticles(3),
    ]);
  const customerReviews = getCustomerReviews();

  return (
    <>
      <FeaturedCollectionsSection collections={featuredCollections} />
      <ProductSection
        description="A focused selection of watches presented with clean imagery, concise details, and clear paths to explore more."
        eyebrow="Popular picks"
        products={bestSellerProducts}
        title="Best Sellers"
        viewAllHref="/shop/best-sellers"
        viewAllLabel="View best sellers"
      />
      <NewArrivalCollectionsSection collections={newArrivalCollections} />
      <ProductSection
        description="Fresh additions arranged for quick scanning and easy product discovery."
        products={newArrivalProducts}
        title="New Arrivals"
        viewAllHref="/shop/new-arrivals"
        viewAllLabel="View new arrivals"
      />
      <CustomerExperiencesSection reviews={customerReviews} />
      <EditorialSection articles={latestArticles} guide={featuredGuide} />
      <BenefitsSection />
      <FaqSection />
      <TrustAssurancesSection />
    </>
  );
}
