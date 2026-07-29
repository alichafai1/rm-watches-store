import type { CustomerReview } from "@/types/customer-review";

const supabaseMediaBase =
  "https://jolmyqqzsqvyapoixnqh.supabase.co/storage/v1/object/public/website-media";

const michaelRCustomerImage = `${supabaseMediaBase}/${encodeURIComponent("Profile photo of customer Michael R..webp")}`;
const michaelRReviewImage = `${supabaseMediaBase}/richard-mille-rm-35-02-rafa-red-strap-customer-review.webp`;

const jamesTCustomerImage = `${supabaseMediaBase}/richard-mille-rm-67-02-customer-james-t.webp`;
const jamesTReviewImage = `${supabaseMediaBase}/richard-mille-rm-67-02-white-blue-customer-review.webp`;

const danielKCustomerImage = `${supabaseMediaBase}/richard-mille-rm-11-03-mclaren-customer-daniel-k.webp`;
const danielKReviewImage = `${supabaseMediaBase}/richard-mille-rm-11-03-mclaren-customer-review.webp`;

const alexPCustomerImage = `${supabaseMediaBase}/richard-mille-rm-35-03-customer-alex-p.webp`;
const alexPReviewImage = `${supabaseMediaBase}/richard-mille-rm-35-03-light-blue-customer-review.webp`;

const kevinMCustomerImage = `${supabaseMediaBase}/richard-mille-rm-67-customer-kevin-m.webp`;
const kevinMReviewImage = `${supabaseMediaBase}/richard-mille-rm-67-blue-customer-review.webp`;

const davidHCustomerImage = `${supabaseMediaBase}/richard-mille-rm-052-skull-customer-david-h.webp`;
const davidHReviewImage = `${supabaseMediaBase}/richard-mille-rm-052-skull-customer-review.webp`;

const michaelRZfV7CustomerImage = `${supabaseMediaBase}/richard-mille-rm-35-02-zf-v7-customer-michael-r.webp`;
const michaelRZfV7ReviewImage = `${supabaseMediaBase}/richard-mille-rm-35-02-zf-v7-customer-review.webp`;

const danielMCustomerImage = `${supabaseMediaBase}/richard-mille-rm-67-01-customer-daniel-m.webp`;
const danielMReviewImage = `${supabaseMediaBase}/richard-mille-rm-67-01-customer-review.webp`;

const michaelRReview: CustomerReview = {
  id: "experience-michael-r",
  customerName: "Michael R",
  customerImage: michaelRCustomerImage,
  customerImageAlt:
    "Customer Michael R. wearing the Richard Mille RM 35-02 Rafael Nadal watch.",
  reviewText:
    "I've owned a few versions of this model over the years, and this one is easily the best. The finish, weight, and overall feel are noticeably better, making it look and wear like a much more premium watch.",
  rating: 5,
  reviewImage: michaelRReviewImage,
  reviewImageAlt:
    "Customer wearing the Richard Mille RM 35-02 Rafael Nadal watch with a red strap during everyday use.",
  productName: "",
  productSlug: "",
  productImage: michaelRReviewImage,
};

const jamesTReview: CustomerReview = {
  id: "experience-james-t",
  customerName: "James T.",
  customerImage: jamesTCustomerImage,
  customerImageAlt:
    "Customer James T. wearing the Richard Mille RM 67-02 white watch with a blue strap.",
  reviewText:
    "I've been wearing the RM 67-02 for a few weeks now, and it's incredibly comfortable. The lightweight feel, clean finishing, and attention to detail make it one of my favorite watches to wear every day.",
  rating: 5,
  reviewImage: jamesTReviewImage,
  reviewImageAlt:
    "Customer wearing the Richard Mille RM 67-02 white watch with a blue strap during everyday use.",
  productName: "",
  productSlug: "",
  productImage: jamesTReviewImage,
};

const danielKReview: CustomerReview = {
  id: "experience-daniel-k",
  customerName: "Daniel K.",
  customerImage: danielKCustomerImage,
  customerImageAlt:
    "Customer James T. wearing the Richard Mille RM 67-02 white watch with a blue strap.",
  reviewText:
    "I've owned several sports watches, but the RM 11-03 stands out. The bold design, comfortable fit, and attention to detail make it a pleasure to wear every day.",
  rating: 5,
  reviewImage: danielKReviewImage,
  reviewImageAlt:
    "Customer wearing the Richard Mille RM 11-03 McLaren watch with an orange strap during everyday use.",
  productName: "",
  productSlug: "",
  productImage: danielKReviewImage,
};

const alexPReview: CustomerReview = {
  id: "experience-alex-p",
  customerName: "Alex P.",
  customerImage: alexPCustomerImage,
  customerImageAlt: "Customer Alex P. wearing the Richard Mille RM 35-03 watch.",
  reviewText:
    "The Richard Mille RM 35-03 is incredibly comfortable to wear. The lightweight case and clean finishing make it feel premium from every angle.",
  rating: 5,
  reviewImage: alexPReviewImage,
  reviewImageAlt:
    "Customer wearing the Richard Mille RM 35-03 watch with a light blue strap during everyday use.",
  productName: "",
  productSlug: "",
  productImage: alexPReviewImage,
};

const kevinMReview: CustomerReview = {
  id: "experience-kevin-m",
  customerName: "Kevin M.",
  customerImage: kevinMCustomerImage,
  customerImageAlt:
    "Customer Kevin M. wearing the Richard Mille RM 67 watch with a blue strap.",
  reviewText:
    "I bought the Richard Mille RM 67 for its slim profile, and it wears even better than I expected. It's lightweight, comfortable, and the blue accents really make the design stand out.",
  rating: 5,
  reviewImage: kevinMReviewImage,
  reviewImageAlt:
    "Customer wearing the Richard Mille RM 67 watch with a blue strap during everyday use.",
  productName: "",
  productSlug: "",
  productImage: kevinMReviewImage,
};

const davidHReview: CustomerReview = {
  id: "experience-david-h",
  customerName: "David H.",
  customerImage: davidHCustomerImage,
  customerImageAlt: "Customer David H. wearing the Richard Mille RM 052 Skull watch.",
  reviewText:
    "The Richard Mille RM 052 Skull has an incredible presence on the wrist. The unique skull dial and bold orange strap make it a real conversation starter wherever I wear it.",
  rating: 5,
  reviewImage: davidHReviewImage,
  reviewImageAlt:
    "Customer showcasing the Richard Mille RM 052 Skull watch with an orange strap.",
  productName: "",
  productSlug: "",
  productImage: davidHReviewImage,
};

const michaelRZfV7Review: CustomerReview = {
  id: "experience-michael-r-zf-v7",
  customerName: "Michael R.",
  customerImage: michaelRZfV7CustomerImage,
  customerImageAlt:
    "Customer Michael R. wearing the Richard Mille RM 35-02 ZF V7 watch.",
  reviewText:
    "I finally picked up the Richard Mille RM 35-02 ZF V7, and the finishing really impressed me. The carbon case looks incredible, the red strap is comfortable, and the overall quality exceeded my expectations.",
  rating: 5,
  reviewImage: michaelRZfV7ReviewImage,
  reviewImageAlt:
    "Customer wearing the Richard Mille RM 35-02 ZF V7 watch with a red strap during everyday use.",
  productName: "",
  productSlug: "",
  productImage: michaelRZfV7ReviewImage,
};

const danielMReview: CustomerReview = {
  id: "experience-daniel-m",
  customerName: "Daniel M.",
  customerImage: danielMCustomerImage,
  customerImageAlt: "Customer Daniel M. wearing the Richard Mille RM 67-01 watch.",
  reviewText:
    "I chose the Richard Mille RM 67-01 because of its ultra-thin design, and it hasn't disappointed. It's lightweight, comfortable, and the clean dial makes it perfect for everyday wear.",
  rating: 5,
  reviewImage: danielMReviewImage,
  reviewImageAlt:
    "Customer wearing the Richard Mille RM 67-01 watch with a light blue strap during everyday use.",
  productName: "",
  productSlug: "",
  productImage: danielMReviewImage,
};

export const mockCustomerReviews: CustomerReview[] = [
  michaelRReview,
  jamesTReview,
  danielKReview,
  alexPReview,
  kevinMReview,
  davidHReview,
  michaelRZfV7Review,
  danielMReview,
];
