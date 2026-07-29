import { mockCustomerReviews } from "@/mock/customer-reviews";

export function getCustomerReviews() {
  return mockCustomerReviews;
}

export function getHomepageCustomerReviews(limit = 8) {
  return mockCustomerReviews.slice(0, limit);
}

export function getCustomerReviewById(id: string) {
  return mockCustomerReviews.find((review) => review.id === id);
}
