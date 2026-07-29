import Image from "next/image";
import type { ProductAbout } from "@/types/product";

type ProductAboutSectionProps = {
  about: ProductAbout;
  /** When true, only render title + description (image rendered separately). */
  textOnly?: boolean;
};

export function ProductAboutImage({ about }: { about: ProductAbout }) {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 sm:aspect-[16/10]">
        <Image
          alt={about.image.alt}
          className="object-contain p-6 sm:p-10"
          fill
          sizes="(min-width: 1024px) 48rem, 100vw"
          src={about.image.url}
          priority={false}
        />
      </div>
    </div>
  );
}

export function ProductAboutSection({
  about,
  textOnly = false,
}: ProductAboutSectionProps) {
  const text = (
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
  );

  if (textOnly) {
    return <section aria-labelledby="product-about-heading">{text}</section>;
  }

  return (
    <section aria-labelledby="product-about-heading" className="grid gap-8">
      <ProductAboutImage about={about} />
      {text}
    </section>
  );
}
