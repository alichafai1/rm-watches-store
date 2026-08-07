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
    answer: (
      <>
        A &ldquo;Super Clone&rdquo; is not just a copy&mdash;it&apos;s a meticulously
        engineered, high-quality replica. We don&apos;t settle for basic knockoffs. Our
        pieces are designed to be virtually indistinguishable from the original Swiss
        masterpiece, matching every minute detail: the texture of the dial, the precision
        of the movement, the perfect mirror polish on the case, and the flawless
        stitching of the strap. When you buy a Super Clone Watch from us, you are buying
        an authentic-looking piece that truly performs like the real thing!
      </>
    ),
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
    answer: (
      <>
        <p>
          Our watches meet or exceed the standards set by RM itself. While they offer
          incredible value compared to the retail price, our replica Richard Mille watches
          feature:
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>
            <strong>High Fidelity Dial Work:</strong> The printing and text are perfect.
          </li>
          <li>
            <strong>Flawless Case Finishing:</strong> Superior polishing and brushing
            techniques.
          </li>
          <li>
            <strong>Accurate Movement:</strong> Our movements run with remarkable
            precision, providing a true luxury timepiece experience.
          </li>
        </ul>
      </>
    ),
  },
  {
    question:
      "Do you have special editions like the Iced Out or Yellow RM 67-02 replica?",
    answer: (
      <>
        Absolutely! We pride ourselves on stocking every major style variation. Whether
        you are looking for a dazzling Iced Out Replica, the sleek Black and Red Richard
        Mille, or the sought-after Yellow Richard Mille, we have it. Our catalog features
        all your favorite models, including the legendary RM 67-02 replica.
      </>
    ),
  },
  {
    question:
      "Why should I buy a high quality replica from you instead of another seller?",
    answer: (
      <>
        Because we offer unmatched trust and guarantees! We eliminate the risk associated
        with buying &ldquo;just a copy.&rdquo; Every watch comes with our{" "}
        <strong>100% Authenticity Guarantee</strong>. You are getting premium
        craftsmanship, superior materials, and transparent pricing.
      </>
    ),
  },
  {
    question: "What is your quality assurance policy on these replicas?",
    answer: (
      <>
        We stand by every single piece. All our Super Clone Watches come with warranty
        coverage. If you receive a watch that doesn&apos;t meet the standard of
        high-quality replica, contact us immediately for a full refund, exchange, or
        repair&mdash;on us!
      </>
    ),
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
