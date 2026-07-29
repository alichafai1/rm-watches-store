import Image from "next/image";
import type { ProductAbout } from "@/types/product";

type ProductAboutSectionProps = {
  about: ProductAbout;
};

export function ProductAboutSection({ about }: ProductAboutSectionProps) {
  return (
    <section aria-labelledby="product-about-heading">
      <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr] lg:items-center">
        <div>
          <h2
            className="text-xl font-semibold tracking-tight text-neutral-950"
            id="product-about-heading"
          >
            {about.title}
          </h2>
          <p className="mt-4 text-sm leading-7 text-neutral-700">
            {about.description}
          </p>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100">
          <Image
            alt={about.image.alt}
            className="object-contain p-8"
            fill
            sizes="(min-width: 1024px) 38vw, 100vw"
            src={about.image.url}
          />
        </div>
      </div>
    </section>
  );
}
