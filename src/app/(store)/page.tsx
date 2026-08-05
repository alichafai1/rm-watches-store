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

export const metadata: Metadata = createPageMetadata({
  title: "Watches for Men and Women | Modern Watch Store",
  description:
    "Explore automatic, chronograph, dress, sports, and everyday watches through a clean and easy-to-use online watch store.",
  pathname: "/",
});

export const revalidate = 60;

export default async function HomePage() {
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
      <JsonLd data={createFaqPageSchema(homepageFaqItems)} />
      <HeroSection />
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
