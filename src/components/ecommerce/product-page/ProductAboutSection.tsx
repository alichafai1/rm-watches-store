"use client";

import { ImageZoomTrigger } from "@/components/ecommerce/product-page/ImageZoomTrigger";
import type { ProductAbout } from "@/types/product";

type ProductAboutSectionProps = {
  about: ProductAbout;
};

export function ProductAboutSection({ about }: ProductAboutSectionProps) {
  return (
    <section aria-labelledby="product-about-heading" className="grid gap-5">
      <h2
        className="order-2 text-xl font-semibold tracking-tight text-neutral-950 lg:order-1"
        id="product-about-heading"
      >
        {about.title}
      </h2>

      <ImageZoomTrigger
        alt={about.image.alt}
        className="order-1 mx-auto aspect-[4/3] w-full max-w-md lg:order-2 lg:mx-0 lg:max-w-none"
        imageClassName="object-contain p-1 sm:p-2"
        sizes="(min-width: 1024px) 28vw, 100vw"
        src={about.image.url}
      />

      <p className="order-3 text-sm leading-7 text-neutral-700">
        {about.description}
      </p>
    </section>
  );
}
