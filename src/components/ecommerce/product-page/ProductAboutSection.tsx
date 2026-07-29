import type { ProductAbout } from "@/types/product";

type ProductAboutSectionProps = {
  about: ProductAbout;
};

export function ProductAboutSection({ about }: ProductAboutSectionProps) {
  return (
    <section aria-labelledby="product-about-heading" className="grid gap-4">
      <h2
        className="text-xl font-semibold tracking-tight text-neutral-950"
        id="product-about-heading"
      >
        {about.title}
      </h2>
      <p className="text-sm leading-7 text-neutral-700">{about.description}</p>
    </section>
  );
}
