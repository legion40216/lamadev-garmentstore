"use client";

import { CircleAlert, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { categories } from "@/data/categories";
import { LOW_STOCK_THRESHOLD } from "@/data/stock";
import useWishlist from "@/hooks/useWishlist";
import type { ProductType } from "@/types/types";
import { formatter } from "@/utils/formatters";
import { getProductPath } from "@/utils/product-url";
import {
  getHighestPrice,
  getLowestPrice,
  hasDiscount,
  isProductInStock,
  isSizeInStock,
} from "@/utils/product-variants";

interface HomepageProductCardProps {
  product: ProductType;
  sizes?: string;
}

/**
 * A compact, browse-only card inspired by the older align-main-with-setup
 * design. The catalogue keeps using the interactive ProductCard.
 */
export default function HomepageProductCard({
  product,
  sizes = "(min-width: 768px) 25vw, 50vw",
}: HomepageProductCardProps) {
  const { name, slug, colors, isNew } = product;
  const wishlist = useWishlist();
  const isWishlisted = wishlist.has(product.id);

  const isOutOfStock = !isProductInStock(product);
  const onSale = product.sizes.some(hasDiscount);

  const soldOutSizes = product.sizes
    .filter((option) => !isSizeInStock(option))
    .map((option) => option.size);

  const lowStockSizes = product.sizes
    .map((option) => ({
      size: option.size,
      units: Object.values(option.stock).reduce((sum, units) => sum + units, 0),
    }))
    .filter(({ units }) => units > 0 && units <= LOW_STOCK_THRESHOLD)
    .map(({ size, units }) => `${size}: only ${units} left`);

  const stockTooltip = [
    lowStockSizes.join(" • "),
    soldOutSizes.length > 0 ? `${soldOutSizes.join(", ")} sold out` : "",
  ]
    .filter(Boolean)
    .join(" • ");

  const showStockWarning =
    !isOutOfStock && stockTooltip.length > 0;

  const lowest = getLowestPrice(product);
  const highest = getHighestPrice(product);
  const priceLabel =
    lowest === highest
      ? formatter.format(lowest)
      : `${formatter.format(lowest)} – ${formatter.format(highest)}`;

  const sizeLabel = product.sizes.map((option) => option.size).join(" / ");
  const categoryLabel =
    categories.find((item) => item.slug === product.category)?.name ??
    product.category;
  const href = getProductPath(slug);

  return (
    <article className="group relative min-w-0">
      <div className="relative isolate aspect-[4/5] overflow-hidden bg-muted">
        <Link
          href={href}
          className="absolute inset-0 block"
          tabIndex={-1}
          aria-hidden="true"
        >
          <Image
            src={colors[0].image}
            alt={name}
            fill
            sizes={sizes}
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        </Link>

        {(isNew || onSale) && (
          <span className="pointer-events-none absolute left-2.5 top-2.5 z-10 bg-background px-2 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-foreground sm:left-3 sm:top-3">
            {onSale ? "Sale" : "New"}
          </span>
        )}

        {isOutOfStock && (
          <div className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center bg-background/65">
            <span className="border border-foreground/20 bg-background/90 px-3 py-2 text-[10px] font-medium uppercase tracking-[0.14em]">
              Out of stock
            </span>
          </div>
        )}

        <div className="absolute right-2 top-2 z-20 flex flex-col items-center gap-1.5 sm:right-3 sm:top-3 sm:gap-2">
          {showStockWarning && (
            <Tooltip>
              <TooltipTrigger
                render={
                  <button
                    type="button"
                    className="flex size-7 items-center justify-center rounded-full bg-background/95 text-amber-700 shadow-sm transition-colors hover:bg-background"
                    aria-label={stockTooltip}
                  />
                }
              >
                <CircleAlert className="size-3.5" aria-hidden="true" />
              </TooltipTrigger>
              <TooltipContent side="left">{stockTooltip}</TooltipContent>
            </Tooltip>
          )}

          <Tooltip>
            <TooltipTrigger
              render={
                <button
                  type="button"
                  className="flex size-7 items-center justify-center rounded-full bg-background/95 shadow-sm transition-colors hover:bg-background"
                  aria-label={
                    isWishlisted
                      ? `Remove ${name} from wishlist`
                      : `Add ${name} to wishlist`
                  }
                  aria-pressed={isWishlisted}
                  onClick={() => wishlist.toggle(product.id)}
                />
              }
            >
              <Heart
                className={
                  isWishlisted
                    ? "size-3.5 fill-rose-600 text-rose-600"
                    : "size-3.5"
                }
                aria-hidden="true"
              />
            </TooltipTrigger>
            <TooltipContent side="left">
              {isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      <Link href={href} className="mt-2.5 block space-y-1.5 sm:mt-3">
        <h3 className="text-xs font-medium leading-snug text-foreground sm:text-[13px]">
          {name}
        </h3>
        <p className="text-[11px] leading-snug text-muted-foreground">
          {categoryLabel}
        </p>

        <ul className="flex gap-1" aria-label="Available colours">
          {colors.map((color) => (
            <li
              key={color.name}
              title={color.name}
              className="size-3 rounded-full border border-foreground/20"
              style={{ backgroundColor: color.code }}
            />
          ))}
        </ul>

        <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1 pt-0.5">
          <span className="text-xs font-normal tabular-nums text-foreground sm:text-[13px]">
            {priceLabel}
          </span>
          <span className="text-[10px] text-muted-foreground sm:text-[11px]">
            {sizeLabel}
          </span>
        </div>
      </Link>
    </article>
  );
}
