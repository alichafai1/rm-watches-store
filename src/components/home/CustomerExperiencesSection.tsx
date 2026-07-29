import { CustomerExperienceGallery } from "@/components/home/CustomerExperienceGallery";
import { HomeSectionHeader } from "@/components/home/HomeSectionHeader";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import type { CustomerReview } from "@/types/customer-review";

type CustomerExperiencesSectionProps = {
  reviews: CustomerReview[];
};

export function CustomerExperiencesSection({
  reviews,
}: CustomerExperiencesSectionProps) {
  return (
    <Section
      ariaLabelledBy="customer-experiences-heading"
      className="bg-neutral-50"
      spacing="lg"
    >
      <Container>
        <div className="grid gap-8">
          <HomeSectionHeader
            align="center"
            description="Real customer reviews and experiences from our watch community."
            eyebrow="Customer experiences"
            headingId="customer-experiences-heading"
            title="Loved by Watch Enthusiasts Worldwide"
          />

          <CustomerExperienceGallery reviews={reviews} />
        </div>
      </Container>
    </Section>
  );
}
