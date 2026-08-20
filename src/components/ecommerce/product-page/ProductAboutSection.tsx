import type { ProductAbout } from "@/types/product";
import { normalizeAboutHtml } from "@/lib/utils/rich-text";

type ProductAboutSectionProps = {
  about: ProductAbout;
};

export function ProductAboutSection({ about }: ProductAboutSectionProps) {
  const descriptionHtml = normalizeAboutHtml(about.description);

  return (
    <section aria-labelledby="product-about-heading" className="grid gap-5">
      <h2
        className="text-xl font-semibold tracking-tight text-neutral-950"
        id="product-about-heading"
      >
        {about.title}
      </h2>

      {descriptionHtml ? (
        <div
          className={[
            "max-w-prose text-[15px] leading-7 text-neutral-700",
            "[&_p]:mb-4 [&_p:last-child]:mb-0",
            "[&_strong]:font-semibold [&_strong]:text-neutral-800",
            "[&_b]:font-semibold [&_b]:text-neutral-800",
            "[&_em]:italic",
            "[&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5",
            "[&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5",
            "[&_li]:mb-1",
            "[&_a]:font-medium [&_a]:text-neutral-950 [&_a]:underline [&_a]:underline-offset-4",
          ].join(" ")}
          dangerouslySetInnerHTML={{ __html: descriptionHtml }}
        />
      ) : null}
    </section>
  );
}
