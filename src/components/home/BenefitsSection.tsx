import { HomeSectionHeader } from "@/components/home/HomeSectionHeader";
import { Container } from "@/components/ui/Container";
import { ResponsiveGrid } from "@/components/ui/ResponsiveGrid";
import { Section } from "@/components/ui/Section";

type Benefit = {
  description: string;
  title: string;
};

const benefits: Benefit[] = [
  {
    title: "Richard Mille Replicas",
    description:
      "Explore a carefully selected collection of watches chosen for their design, quality, and timeless appeal.",
  },
  {
    title: "Detailed Product Information",
    description:
      "Find clear specifications, detailed descriptions, and high-quality images to make confident decisions.",
  },
  {
    title: "Secure Shopping Experience",
    description:
      "Enjoy a smooth and reliable shopping journey designed around simplicity, security, and convenience.",
  },
  {
    title: "Dedicated Customer Support",
    description:
      "Our support team is available to help you with questions and provide assistance throughout your journey.",
  },
];

function BenefitIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-5 text-[#9f7d3f]"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.75}
      viewBox="0 0 24 24"
    >
      <path d="M12 3 20 7v5c0 5-3.4 8.5-8 9-4.6-.5-8-4-8-9V7l8-4Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function BenefitsSection() {
  return (
    <Section ariaLabelledBy="benefits-heading" className="bg-neutral-50" spacing="lg">
      <Container>
        <div className="grid gap-10">
          <HomeSectionHeader
            align="center"
            description="Explore a wide selection of watches crafted with quality materials, precise movements, and exceptional attention to detail."
            eyebrow="Why shop from us"
            headingId="benefits-heading"
            title="Super Clone Watches. Better Experience."
          />

          <ResponsiveGrid columns="four">
            {benefits.map((benefit) => (
              <article
                className="grid gap-4 border-t border-neutral-200 pt-6"
                key={benefit.title}
              >
                <div className="flex size-11 items-center justify-center rounded-full border border-[#d6bd7f]/40 bg-white">
                  <BenefitIcon />
                </div>
                <div className="grid gap-2">
                  <h3 className="text-base font-semibold">{benefit.title}</h3>
                  <p className="text-sm leading-6 text-neutral-600">
                    {benefit.description}
                  </p>
                </div>
              </article>
            ))}
          </ResponsiveGrid>
        </div>
      </Container>
    </Section>
  );
}
