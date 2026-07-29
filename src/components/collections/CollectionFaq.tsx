import type { FaqItem } from "@/types/faq";

type CollectionFaqProps = {
  items: FaqItem[];
};

export function CollectionFaq({ items }: CollectionFaqProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="collection-faq-heading" className="bg-white">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500">
            Questions
          </p>
          <h2
            className="mt-3 text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl"
            id="collection-faq-heading"
          >
            FAQ
          </h2>
        </div>
        <div className="mt-8 border-y border-neutral-200">
          {items.map((item) => (
            <details
              className="group border-b border-neutral-200 last:border-b-0"
              key={item.question}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left text-sm font-semibold text-neutral-950 marker:hidden">
                {item.question}
                <span
                  aria-hidden="true"
                  className="text-xl font-light text-neutral-500 transition group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="pb-5 text-sm leading-6 text-neutral-600">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
