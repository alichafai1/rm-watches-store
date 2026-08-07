import { StorefrontImage } from "@/components/media/StorefrontImage";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { trustAssurances, type TrustAssurance } from "@/constants/trust-assurances";

function TrustAssuranceIcon({ item }: { item: TrustAssurance }) {
  return (
    <span className="relative block size-12 shrink-0">
      <StorefrontImage
        alt={item.iconAlt}
        className="object-contain object-center"
        fill
        preset="trustIcon"
        sizes="48px"
        src={item.iconSrc}
      />
    </span>
  );
}

export function TrustAssurancesSection() {
  return (
    <Section className="border-t border-neutral-200 bg-white" spacing="sm">
      <Container>
        <div className="grid gap-3 md:grid-cols-3">
          {trustAssurances.map((item) => (
            <article
              className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3"
              key={item.id}
            >
              <TrustAssuranceIcon item={item} />
              <div className="grid gap-0.5">
                <h2 className="text-sm font-semibold leading-5 text-neutral-950">
                  {item.title}
                </h2>
                <p className="text-sm leading-5 text-neutral-500">
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
