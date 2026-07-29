type ProductFeaturesProps = {
  features: string[];
};

export function ProductFeatures({ features }: ProductFeaturesProps) {
  return (
    <section aria-labelledby="product-features-heading">
      <h2
        className="text-xl font-semibold tracking-tight text-neutral-950"
        id="product-features-heading"
      >
        Key Features
      </h2>
      <ul className="mt-5 grid gap-3 text-sm text-neutral-700">
        {features.map((feature) => (
          <li className="flex gap-3" key={feature}>
            <span className="mt-0.5 text-[#9a752e]" aria-hidden="true">
              <svg
                className="size-4"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path d="m5 12 4 4L19 6" />
              </svg>
            </span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
