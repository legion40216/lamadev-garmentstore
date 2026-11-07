"use client";

import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ColorSwatches from "@/components/global-ui/color-swatches";
import SizeSelector from "@/components/global-ui/size-selector";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { categories } from "@/data/categories";
import { LOW_STOCK_THRESHOLD } from "@/data/stock";
import useProductCartLine from "@/hooks/useProductCartLine";
import useWishlist from "@/hooks/useWishlist";
import type { ProductSize, ProductType } from "@/types/types";
import { formatter } from "@/utils/formatters";
import { getProductPath } from "@/utils/product-url";
import {
  changeSize,
  getColor,
  getDefaultSelection,
  getFinalPrice,
  getSizeOption,
  getStock,
  hasDiscount,
  isProductInStock,
  type Selection,
} from "@/utils/product-variants";

interface ProductCardProps {
  product: ProductType;
  // Set when the list is filtered to one size (?size=M). The card opens on it.
  selectedSize?: ProductSize;
  sizes?: string; // next/image `sizes` hint
}

export default function ProductCard({
  product,
  selectedSize,
  sizes = "(min-width: 768px) 25vw, 50vw",
}: ProductCardProps) {
  const { name, colors, isNew } = product;

  // What the shopper picked on this card. It remembers which list size filter
  // it was picked under, so changing that filter resets the card to the new
  // default instead of keeping a stale pick.
  const [picked, setPicked] = useState<{
    filterSize: ProductSize | undefined;
    selection: Selection;
  } | null>(null);

  const selection =
    picked && picked.filterSize === selectedSize
      ? picked.selection
      : getDefaultSelection(product, { size: selectedSize });

  const pick = (next: Selection) =>
    setPicked({ filterSize: selectedSize, selection: next });

  const option = getSizeOption(product, selection.size) ?? product.sizes[0];
  const color = getColor(product, selection.color) ?? colors[0];

  const stock = getStock(option, color.name);
  const finalPrice = getFinalPrice(option);
  const onSale = hasDiscount(option);
  const isProductSoldOut = !isProductInStock(product);
  const isLowStock = stock > 0 && stock <= LOW_STOCK_THRESHOLD;

  const cart = useProductCartLine(product, selection);
  const wishlist = useWishlist();
  const isWishlisted = wishlist.has(product.id);

  const categoryLabel =
    categories.find((item) => item.slug === product.category)?.name ??
    product.category;

  // Open the product page on what was picked here. Untouched cards link to the
  // plain URL so the page chooses its own default.
  const href = picked
    ? getProductPath(product.slug, picked.selection)
    : getProductPath(product.slug, { size: selectedSize });

  return (
    <article className="group relative flex min-w-0 flex-col">
      <div className="relative isolate aspect-[4/5] overflow-hidden bg-muted">
        <Link
          href={href}
          className="absolute inset-0 block"
          tabIndex={-1}
          aria-hidden="true"
        >
          <Image
            // The photo follows the chosen colour
            src={color.image}
            alt={`${name} in ${color.name}`}
            fill
            sizes={sizes}
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        </Link>

        {(onSale || isNew) && (
          <span className="pointer-events-none absolute left-2.5 top-2.5 z-10 bg-background px-2 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-foreground sm:left-3 sm:top-3">
            {onSale ? "Sale" : "New"}
          </span>
        )}

        {isProductSoldOut && (
          <div className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center bg-background/65">
            <span className="border border-foreground/20 bg-background/90 px-3 py-2 text-[10px] font-medium uppercase tracking-[0.14em]">
              Out of stock
            </span>
          </div>
        )}

        <div className="absolute right-2 top-2 z-20 sm:right-3 sm:top-3">
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

      <div className="mt-2.5 flex flex-1 flex-col gap-2 sm:mt-3">
        <div className="space-y-0.5">
          <h3 className="text-xs font-medium leading-snug text-foreground sm:text-[13px]">
            <Link href={href}>{name}</Link>
          </h3>
          <p className="text-[11px] leading-snug text-muted-foreground">
            {categoryLabel}
          </p>
        </div>

        {/* Colour: changes the photo. Colours the current size doesn't come in
            are disabled; sold-out ones can still be looked at. */}
        <div className="flex items-center gap-2">
          <ColorSwatches
            colors={colors}
            option={option}
            selected={color.name}
            onSelect={(name) => pick({ size: selection.size, color: name })}
          />
          <span className="truncate text-[11px] text-muted-foreground">
            {color.name}
          </span>
        </div>

        {/* Size: sold-out sizes stay selectable (struck through) so the shopper
            can see the colour options, but they can't be added. */}
        <SizeSelector
          sizes={product.sizes}
          selected={selection.size}
          onSelect={(next) => pick(changeSize(product, selection, next))}
        />

        <div className="mt-auto space-y-2 pt-0.5">
          <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
            <span className="flex items-baseline gap-1.5 text-xs tabular-nums text-foreground sm:text-[13px]">
              {formatter.format(finalPrice)}
              {onSale && (
                <s className="text-[11px] text-muted-foreground">
                  {formatter.format(option.price)}
                </s>
              )}
            </span>
            {isLowStock && (
              <span className="text-[11px] text-amber-700">
                Only {stock} left
              </span>
            )}
          </div>

          {stock === 0 ? (
            <Button variant="outline" size="sm" className="w-full" disabled>
              Sold out
            </Button>
          ) : cart.inCart ? (
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={cart.remove}
            >
              <Trash2 aria-hidden="true" />
              Remove from cart
            </Button>
          ) : (
            <Button size="sm" className="w-full" onClick={() => cart.add()}>
              <ShoppingCart aria-hidden="true" />
              Add to cart
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
