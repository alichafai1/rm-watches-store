export type CustomerReview = {
  id: string;
  customerName: string;
  customerImage: string;
  customerImageAlt?: string;
  reviewText: string;
  rating: number;
  reviewImage: string;
  reviewImageAlt?: string;
  productName: string;
  productSlug: string;
  productImage: string;
};
