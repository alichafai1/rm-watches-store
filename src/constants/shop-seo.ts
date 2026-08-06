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

export const menWatchesSeo: ShopCategorySeoContent = {
  intro:
    "Shop men’s Richard Mille replica watches built around sport-luxury design — carbon cases, skeleton dials, and bold straps for collectors who want a strong wrist presence.",
  sections: [
    {
      heading: "Popular men’s RM styles",
      paragraphs: [
        "Men’s picks often center on RM sports and racing-inspired references: NTPT-style carbon looks, open skeleton dials, and colorful rubber straps. These designs emphasize technical aesthetics and everyday durability more than dress-watch restraint.",
        "Browse models by silhouette and color first, then open each product page for dimensions, strap details, and close photography before you decide.",
      ],
    },
    {
      heading: "What to check before buying",
      paragraphs: [
        "Confirm case diameter and thickness against your wrist size, and decide whether you want a stealth black build or a brighter accent strap. Finishing quality on the dial edges, pushers, and case flanks is usually the clearest quality signal in photos.",
        "If you are choosing between similar RM references, compare weight feel descriptions, strap length notes, and whether the look is more daily-sport or statement piece.",
      ],
    },
  ],
  faq: [
    {
      question: "What case size works best for men’s replicas?",
      answer:
        "Most men’s RM-inspired models wear larger than classic dress watches. Check the listed case size on the product page and compare it with watches you already wear comfortably.",
    },
    {
      question: "Are rubber straps standard on men’s models?",
      answer:
        "Many men’s sports replicas ship with rubber straps for grip and comfort. Exact strap color and style vary by model and are shown in each product gallery.",
    },
    {
      question: "Do you offer men’s tourbillon-style replicas?",
      answer:
        "Yes. Several men’s listings feature tourbillon-inspired skeleton layouts. Filter visually by dial complexity on the product cards, then review the detail page for specifics.",
    },
    {
      question: "How can I get help choosing a men’s model?",
      answer:
        "Contact our support team with your wrist size and preferred style — carbon sport, colorful strap, or ultra-light skeleton — and we will point you to suitable options.",
    },
  ],
};

export const womenWatchesSeo: ShopCategorySeoContent = {
  intro:
    "Discover women’s and ladies’ Richard Mille replica watches — ceramic cases, diamond accents, and refined skeleton dials designed for a lighter, more elegant wrist presence.",
  sections: [
    {
      heading: "Women’s collection highlights",
      paragraphs: [
        "Ladies’ favourites often include RM 07-inspired ceramics, pastel and diamond-pavé dials, and compact luxury proportions. These pieces keep the brand’s modern architecture while shifting toward color, sparkle, and everyday elegance.",
        "Use this page to compare white ceramic, pink, powder blue, and rose-gold-toned options side by side before opening a full product page.",
      ],
    },
    {
      heading: "Choosing a ladies replica",
      paragraphs: [
        "Focus on case size first — many women’s models are easier to wear daily than oversized sports references. Then choose dial treatment (diamond, skeleton, or solid color) and a strap that matches how you dress.",
        "If you want a statement evening look, prioritize diamond bezels and ornate dials; for daily wear, ceramic cases with cleaner dials are usually more versatile.",
      ],
    },
  ],
  faq: [
    {
      question: "Are these watches suitable for smaller wrists?",
      answer:
        "Many ladies’ RM-inspired models are designed with more wearable proportions. Check each product’s case size and gallery on-wrist cues when available.",
    },
    {
      question: "Do women’s replicas include diamond detailing?",
      answer:
        "Several listings feature diamond-set bezels or pavé dial accents. Product titles and images call out those details so you can filter by look quickly.",
    },
    {
      question: "How should I care for a ceramic or diamond-accent watch?",
      answer:
        "Wipe with a soft dry cloth after wear and avoid harsh chemicals. For diamond-accent pieces, store separately to limit scratching against other jewelry.",
    },
    {
      question: "What is your return policy for women’s watches?",
      answer:
        "Returns follow our standard refund and return policy. Reach out through the contact page with your order number for guidance before returning an item.",
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
