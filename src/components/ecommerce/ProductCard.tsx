import Image from "next/image";
import Link from "next/link";
import { ProductRatingStars } from "@/components/ecommerce/ProductRatingStars";
import { formatPrice } from "@/lib/utils/format-price";
import { cn } from "@/lib/utils/cn";
import type { Product } from "@/types/product";

type ProductCardProps = {
  className?: string;
  headingLevel?: "h2" | "h3";
  product: Product;
  showAction?: boolean;
};

export function ProductCard({
  className,
  headingLevel = "h2",
  product,
  showAction = true,
}: ProductCardProps) {
  const image = product.images[0];
  const Heading = headingLevel;

  return (
    <article
      className={cn(
        // Phones drop the card padding so the watch gets the full column width.
        "group rounded-2xl bg-white transition duration-300 hover:-translate-y-1 sm:p-3",
        className,
      )}
    >
      <Link className="grid gap-2.5 sm:gap-3" href={`/products/${product.slug}`}>
        {image ? (
          <div className="aspect-square w-full overflow-hidden rounded-xl bg-neutral-50 p-1 transition-shadow duration-300 group-hover:shadow-[var(--shadow-md)] sm:p-2">
            <Image
              alt={image.alt}
              className="h-full w-full object-contain object-center"
              height={image.height}
              src={image.url}
              width={image.width}
            />
          </div>
        ) : null}
        <div className="grid gap-1 px-0.5 sm:gap-1.5 sm:px-1">
          {/* Two lines on phones fit more of the model name; the reserved height
              keeps every card in a row the same height. */}
          <Heading className="line-clamp-2 min-h-10 text-[13px] font-semibold leading-5 tracking-tight text-neutral-950 sm:line-clamp-1 sm:min-h-0 sm:text-base sm:leading-6">
            {product.title}
          </Heading>
          <ProductRatingStars reviews={product.reviews} />
          <div className="flex flex-wrap items-baseline gap-1.5 sm:gap-2">
            <p className="text-[15px] font-semibold text-neutral-950 sm:text-base">
              {formatPrice(product.price, product.currency)}
            </p>
            {product.compareAtPrice &&
            product.compareAtPrice > product.price ? (
              <p className="text-[11px] text-neutral-400 line-through sm:text-xs">
                {formatPrice(product.compareAtPrice, product.currency)}
              </p>
            ) : null}
          </div>
        </div>
      </Link>
      {showAction ? (
        <Link
          className="product-card-cta mt-2.5 inline-flex w-full items-center justify-center rounded-md border border-neutral-950 bg-neutral-950 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors duration-300 hover:border-[#b08a3c] hover:bg-[#b08a3c] sm:mt-3 sm:px-4 sm:py-2.5 sm:text-[11px] sm:tracking-[0.18em]"
          href={`/products/${product.slug}`}
        >
          Shop Now
        </Link>
      ) : null}
    </article>
  );
}
