import type { Metadata } from "next";
import { Suspense } from "react";
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

/**
 * Hero is static and is the LCP element on mobile. Keep it outside any CMS
 * awaits so it streams in the first paint; below-fold sections load in Suspense.
 */
export default function HomePage() {
  return (
    <>
      <JsonLd data={createFaqPageSchema(homepageFaqItems)} />
      <HeroSection />
      <Suspense>
        {/*
          Defer style/layout of below-fold DOM so the hero LCP text can paint
          immediately (homepage HTML is large once collections/products render).
        */}
        <div className="home-below-fold">
          <HomePageBelowFold />
        </div>
      </Suspense>
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
