import { CollectionFaq } from "@/components/collections/CollectionFaq";
import type { ShopCategorySeoContent } from "@/constants/shop-seo";

type ShopCategorySeoProps = {
  content: ShopCategorySeoContent;
};

/** SEO copy + FAQ below shop category product grids. Design matches collection pages. */
export function ShopCategorySeo({ content }: ShopCategorySeoProps) {
  return (
    <div className="grid gap-10">
      <section
        aria-labelledby="shop-category-seo-heading"
        className="max-w-3xl"
      >
        <h2
          className="text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl"
          id="shop-category-seo-heading"
        >
          {content.sections[0]?.heading}
        </h2>
        <div className="mt-4 grid gap-4 text-sm leading-7 text-neutral-700 sm:text-base">
          {content.sections[0]?.paragraphs.map((paragraph, index) => (
            <p key={`lead-${index}`}>{paragraph}</p>
          ))}
        </div>

        {content.sections.slice(1).map((section) => (
          <div className="mt-8" key={section.heading}>
            <h2 className="text-xl font-semibold tracking-tight text-neutral-950 sm:text-2xl">
              {section.heading}
            </h2>
            <div className="mt-3 grid gap-4 text-sm leading-7 text-neutral-700 sm:text-base">
              {section.paragraphs.map((paragraph, index) => (
                <p key={`${section.heading}-${index}`}>{paragraph}</p>
              ))}
            </div>
          </div>
        ))}
      </section>

      <CollectionFaq items={content.faq} />
    </div>
  );
}
