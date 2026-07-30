import Image from "next/image";
import Link from "next/link";
import { LinkButton } from "@/components/ui/LinkButton";
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
  showAction = false,
}: ProductCardProps) {
  const image = product.images[0];
  const Heading = headingLevel;
  const imageFrameClassName =
    product.slug ===
    "best-richard-mille-rm001-replica-men-s-tourbillon-watch-swiss-movement"
      ? "scale-[1.18] object-cover"
      : product.slug ===
          "umi-richard-mille-rm-67-02-alexis-pinturault-white-quartz-tpt-carbon-blue-strap-automatic-replica-watch"
        ? "object-contain object-center scale-[0.92] translate-y-[4%]"
        : "object-cover";

  return (
    <article
      className={cn(
        "group rounded-2xl border border-neutral-200 bg-white p-3 transition duration-300 hover:-translate-y-1 hover:border-neutral-300 hover:shadow-[var(--shadow-md)]",
        className,
      )}
    >
      <Link className="grid gap-4" href={`/products/${product.slug}`}>
        {image ? (
          <div className="aspect-square w-full overflow-hidden rounded-xl bg-white">
            <Image
              alt={image.alt}
              className={cn("h-full w-full", imageFrameClassName)}
              height={image.height}
              src={image.url}
              width={image.width}
            />
          </div>
        ) : null}
        <div className="grid gap-2 px-1 pb-1">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#9f7d3f]">
            {product.movement}
          </p>
          <Heading className="text-base font-semibold tracking-tight text-neutral-950">
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
        <LinkButton
          className="mt-2 w-full"
          href={`/products/${product.slug}`}
          size="sm"
          variant="outline"
        >
          View Product
        </LinkButton>
      ) : null}
    </article>
  );
}
