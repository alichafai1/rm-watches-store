import Link from "next/link";
import type { ReactNode } from "react";
import { HomeSectionHeader } from "@/components/home/HomeSectionHeader";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

type FaqItem = {
  answer: ReactNode;
  question: string;
};

const faqItems: FaqItem[] = [
  {
    question: "What makes your Richard Mille Super Clone Replica so high quality?",
    answer:
      "Our super clone watches focus on detailed case finishing, dial design, strap construction, and clearly listed movement specifications. Quality and features vary by model, so we recommend reviewing the product photos, specifications, dimensions, and available quality options on each individual product page before ordering.",
  },
  {
    question: 'What defines a "high-quality" Richard Mille replica?',
    answer: (
      <>
        A truly high-quality replica goes beyond just looking good. It means the movement
        must function precisely, the case material (carbon fiber texture, metal grain) must
        be accurate, and the dial printing should have a depth that mimics the
        original&apos;s complex layering. Look for replicas that match the case shape as
        closely as they match the surface details.
      </>
    ),
  },
  {
    question: "How closely do these replicas match an authentic Richard Mille watch?",
    answer:
      "Our Richard Mille replica watches are inspired by the design and appearance of original RM models, but they are replica products and are not authentic Richard Mille watches. Materials, movements, dimensions, and finishing can vary by model and quality level. Each product page provides images and specifications so customers can compare the available options.",
  },
  {
    question:
      "Do you have special editions like the Iced Out or Yellow RM 67-02 replica?",
    answer:
      "Availability changes as new RM replica models and variations are added. Check our current collections and product listings for available RM 67-02 styles, colors, straps, and other special-edition-inspired designs.",
  },
  {
    question:
      "Why should I buy a high quality replica from you instead of another seller?",
    answer:
      "We focus on clear product information, detailed images, transparent pricing, secure checkout, worldwide shipping, and customer support. Each watch listing includes its available specifications and quality options so you can compare products before purchasing. Eligible orders can also be returned in accordance with our published 14-day return policy.",
  },
  {
    question: "What is your quality assurance policy on these replicas?",
    answer:
      "If you receive an incorrect or defective item, contact our support team as soon as possible so we can review the issue. Return requests may be submitted within 14 days of delivery, subject to the conditions in our Refund & Return Policy. Defective or incorrect-item claims should be reported within 48 hours of delivery.",
  },
  {
    question: "Where to buy replica Richard Mille watches online?",
    answer: (
      <>
        You are in the right place! We are one of the premier destinations for
        authentic-looking luxury timepieces. You can browse our entire collection and find
        your perfect piece here:{" "}
        <Link className="font-medium text-neutral-950 underline underline-offset-4" href="/shop">
          View our catalog
        </Link>
        . Whether you want a RM 88 replica or an Iced Out Richard Mille, we make buying
        easy and secure.
      </>
    ),
  },
];

export function FaqSection() {
  return (
    <Section ariaLabelledBy="faq-heading" className="bg-white" spacing="lg">
      <Container size="lg">
        <div className="grid gap-8">
          <HomeSectionHeader
            align="center"
            description="Your Complete Q&A Buyer's Guide"
            eyebrow="Questions"
            headingId="faq-heading"
            title="FAQ"
          />

          <div className="divide-y divide-neutral-200 border-y border-neutral-200">
            {faqItems.map((item, index) => (
              <details className="group" key={item.question} open={index === 0}>
                <summary className="flex w-full cursor-pointer list-none items-center justify-between gap-6 py-5 text-left [&::-webkit-details-marker]:hidden">
                  <span className="text-base font-semibold text-neutral-950">
                    {item.question}
                  </span>
                  <span
                    aria-hidden="true"
                    className="text-xl leading-none text-[#9f7d3f]"
                  >
                    <span className="group-open:hidden">+</span>
                    <span className="hidden group-open:inline">-</span>
                  </span>
                </summary>
                <div className="max-w-3xl overflow-hidden pb-5 text-sm leading-7 text-neutral-600 [&_strong]:font-semibold [&_strong]:text-neutral-950">
                  {item.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
