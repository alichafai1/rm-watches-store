import type { ProductFaqItem } from "@/types/product";

type ProductFaqProps = {
  items: ProductFaqItem[];
};

export function ProductFaq({ items }: ProductFaqProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="product-faq-heading"
      className="border-t border-neutral-200 pt-10"
    >
      <div className="mx-auto w-full max-w-3xl">
        <h2
          className="text-center text-2xl font-semibold tracking-tight text-neutral-950"
          id="product-faq-heading"
        >
          FAQ
        </h2>
        <div className="mt-5 border-y border-neutral-200">
          {items.map((item) => (
            <details
              className="group border-b border-neutral-200 last:border-b-0"
              key={item.question}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-sm font-semibold text-neutral-950 marker:hidden">
                {item.question}
                <span
                  aria-hidden="true"
                  className="text-xl font-light text-neutral-500 transition group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="pb-4 text-sm leading-6 text-neutral-600">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
