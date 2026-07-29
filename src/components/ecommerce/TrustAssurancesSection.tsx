import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

type TrustAssurance = {
  description: string;
  iconAlt?: string;
  iconClassName?: string;
  iconSrc?: string;
  id: string;
  title: string;
};

const trustAssurances: TrustAssurance[] = [
  {
    id: "free-shipping",
    title: "Free Shipping",
    description: "Expected delivery between 2–3 days",
    iconSrc: "/images/trust-icons/free-shipping.png",
    iconAlt: "Free shipping",
  },
  {
    id: "returns",
    title: "30 Days Return",
    description: "Return label included for easy returns",
    iconSrc:
      "https://jolmyqqzsqvyapoixnqh.supabase.co/storage/v1/object/public/website-media/days%20moneyback.webp",
    iconAlt: "30 days return",
    // This asset fills nearly the full canvas; others have ~20% padding.
    iconClassName: "scale-[1]",
  },
  {
    id: "secure-checkout",
    title: "Secure checkout powered by Stripe",
    description: "Payments are processed securely",
    iconSrc: "/images/trust-icons/secure-checkout.png",
    iconAlt: "Secure checkout",
  },
];

function TrustAssuranceIconPlaceholder() {
  return (
    <span
      aria-hidden="true"
      className="flex size-12 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-neutral-100 text-[10px] font-medium uppercase tracking-[0.14em] text-neutral-400"
    >
      Icon
    </span>
  );
}

function TrustAssuranceIcon({ item }: { item: TrustAssurance }) {
  if (item.iconSrc) {
    return (
      <span className="relative block size-12 shrink-0">
        <Image
          alt={item.iconAlt ?? item.title}
          className={`object-contain object-center ${item.iconClassName ?? "scale-[1.25]"}`}
          fill
          sizes="48px"
          src={item.iconSrc}
        />
      </span>
    );
  }

  return <TrustAssuranceIconPlaceholder />;
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
