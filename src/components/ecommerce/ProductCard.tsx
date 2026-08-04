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
        "group rounded-2xl bg-white p-3 transition duration-300 hover:-translate-y-1",
        className,
      )}
    >
      <Link className="grid gap-3" href={`/products/${product.slug}`}>
        {image ? (
          <div className="aspect-square w-full overflow-hidden rounded-xl bg-neutral-50 p-1.5 transition-shadow duration-300 group-hover:shadow-[var(--shadow-md)] sm:p-2">
            <Image
              alt={image.alt}
              className="h-full w-full object-contain object-center"
              height={image.height}
              src={image.url}
              width={image.width}
            />
          </div>
        ) : null}
        <div className="grid gap-1.5 px-1">
          <Heading className="truncate text-base font-semibold tracking-tight text-neutral-950">
            {product.title}
          </Heading>
          <ProductRatingStars reviews={product.reviews} />
          <div className="flex flex-wrap items-baseline gap-2">
            <p className="text-base font-semibold text-neutral-950">
              {formatPrice(product.price, product.currency)}
            </p>
            {product.compareAtPrice &&
            product.compareAtPrice > product.price ? (
              <p className="text-xs text-neutral-400 line-through">
                {formatPrice(product.compareAtPrice, product.currency)}
              </p>
            ) : null}
          </div>
        </div>
      </Link>
      {showAction ? (
        <Link
          className="product-card-cta mt-3 inline-flex w-full items-center justify-center rounded-md border border-neutral-950 bg-neutral-950 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors duration-300 hover:border-[#b08a3c] hover:bg-[#b08a3c]"
          href={`/products/${product.slug}`}
        >
          Shop Now
        </Link>
      ) : null}
    </article>
  );
}
