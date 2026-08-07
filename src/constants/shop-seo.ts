import type { FaqItem } from "@/types/faq";

export type ShopCategorySeoContent = {
  intro: string;
  sections: Array<{
    heading: string;
    paragraphs: string[];
  }>;
  faq: FaqItem[];
};

export const bestSellersSeo: ShopCategorySeoContent = {
  intro:
    "Explore our best-selling Richard Mille replica and super clone watches — popular skeleton, carbon, and tourbillon-inspired models chosen for finishing, wearability, and collector demand.",
  sections: [
    {
      heading: "Why these watches are best sellers",
      paragraphs: [
        "Our best sellers highlight the RM models shoppers request most often: bold tonneau cases, openworked dials, and sport-luxury straps that look sharp on and off the wrist. Each listing focuses on clear photos, key specs, and consistent presentation so you can compare options quickly.",
        "Whether you prefer a carbon sports look or a more refined skeleton design, this selection is a practical starting point for finding a high-quality Richard Mille-inspired replica without browsing the full catalog first.",
      ],
    },
    {
      heading: "How to choose a best-selling replica",
      paragraphs: [
        "Start with case size and strap comfort, then compare dial openness, colorway, and finishing details. If you want everyday wear, prioritize lighter builds and secure rubber straps; for a statement piece, look at more complex skeleton layouts and distinctive color accents.",
        "Use product pages for specifications and close-up images, and contact support if you need help matching a model to your wrist size or preferred style.",
      ],
    },
  ],
  faq: [
    {
      question: "How often does the best sellers list update?",
      answer:
        "We refresh featured best sellers as demand and inventory shift, so popular Richard Mille replica models stay visible while new favorites can move into the list over time.",
    },
    {
      question: "Are best sellers the highest quality replicas you offer?",
      answer:
        "Best sellers reflect popularity and strong customer interest. Quality cues — finishing, materials presentation, and movement style — are shown on each product page so you can judge fit for your needs.",
    },
    {
      question: "Do best sellers ship worldwide?",
      answer:
        "Yes. Orders follow our standard shipping policy with discreet packaging. Delivery timing depends on destination and the option selected at checkout.",
    },
    {
      question: "Can I return a best-selling watch?",
      answer:
        "Returns are handled under our refund and return policy. Contact support with your order details before sending anything back.",
    },
  ],
};

export const newArrivalsSeo: ShopCategorySeoContent = {
  intro:
    "Browse the latest Richard Mille replica and super clone arrivals — newly added models, colorways, and editions as they land in the catalog.",
  sections: [
    {
      heading: "What’s new in the catalog",
      paragraphs: [
        "New arrivals showcase recently published watches so you can spot fresh RM references, updated finishes, and seasonal colorways before they blend into the wider shop. This page is updated as new products go live.",
        "Each card links to a full product page with specifications, imagery, and purchase options so you can move from discovery to detail without extra steps.",
      ],
    },
    {
      heading: "Browse by collection",
      paragraphs: [
        "Prefer shopping by model family? Open New Arrival collections to explore RM groups such as RM 07, RM 26, and RM 51 in one place, then return here for a cross-collection feed of the newest individual listings.",
        "Best sellers remain the place for proven demand; new arrivals are best when you want the newest looks first.",
      ],
    },
  ],
  faq: [
    {
      question: "How often are new arrivals added?",
      answer:
        "We add products as inventory and listings are ready. Check this page regularly or browse New Arrival collections for model-family updates.",
    },
    {
      question: "What is the difference between new arrivals and best sellers?",
      answer:
        "New arrivals prioritize recently added watches. Best sellers prioritize models with strong ongoing interest. A watch can appear in both over time.",
    },
    {
      question: "Can I ask about an upcoming model?",
      answer:
        "Yes. Contact support with the RM reference you want and we will tell you whether a close match is already listed or expected soon.",
    },
  ],
};
