"use client";

import { Heart, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import ColorSwatches from "@/components/global-ui/color-swatches";
import SizeSelector from "@/components/global-ui/size-selector";
import { Button, buttonVariants } from "@/components/ui/button";
import { categories } from "@/data/categories";
import { LOW_STOCK_THRESHOLD } from "@/data/stock";
import useProductCartLine from "@/hooks/useProductCartLine";
import useWishlist from "@/hooks/useWishlist";
import { cn } from "@/lib/utils";
import type { ProductSize, ProductType } from "@/types/types";
import { formatter } from "@/utils/formatters";
import {
  getColor,
  getFinalPrice,
  getSizeOption,
  getStock,
  hasDiscount,
  type Selection,
} from "@/utils/product-variants";

interface ProductDetailsProps {
  product: ProductType;
  selection: Selection;
  onSelectSize: (size: ProductSize) => void;
  onSelectColor: (colorName: string) => void;
}

export default function ProductDetails({
  product,
  selection,
  onSelectSize,
  onSelectColor,
}: ProductDetailsProps) {
  const option = getSizeOption(product, selection.size) ?? product.sizes[0];
  const color = getColor(product, selection.color) ?? product.colors[0];

  const stock = getStock(option, color.name);
  const finalPrice = getFinalPrice(option);
  const onSale = hasDiscount(option);
  const isSoldOut = stock === 0;

  const cart = useProductCartLine(product, selection);
  const wishlist = useWishlist();
  const isWishlisted = wishlist.has(product.id);

  // Quantity for the "Add to cart" button. Once the line is in the cart the
  // stepper edits the cart itself, so there is a single source of truth.
  const [pendingQuantity, setPendingQuantity] = useState(1);
  const quantity = cart.inCart
    ? cart.count
    : Math.min(Math.max(pendingQuantity, 1), Math.max(stock, 1));

  const setQuantity = (next: number) => {
    if (cart.inCart) cart.setCount(next);
    else setPendingQuantity(next);
  };

  const categoryLabel =
    categories.find((item) => item.slug === product.category)?.name ??
    product.category;

  return (
    // Sticky on desktop so the buy box stays in view beside the tall photo
    <div className="space-y-6 md:sticky md:top-24 md:self-start">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
          {categoryLabel}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {product.name}
        </h1>

        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-xl tabular-nums">
            {formatter.format(finalPrice)}
          </span>
          {onSale && (
            <>
              <s className="tabular-nums text-muted-foreground">
                {formatter.format(option.price)}
              </s>
              <span className="text-sm font-medium text-green-700">
                Save {formatter.format(option.discount ?? 0)}
              </span>
            </>
          )}
        </div>
      </div>

      <p className="text-sm leading-relaxed text-muted-foreground">
        {product.description}
      </p>

      <fieldset className="space-y-2">
        <legend className="text-sm">
          Colour: <span className="font-medium">{color.name}</span>
        </legend>
        <ColorSwatches
          colors={product.colors}
          option={option}
          selected={color.name}
          onSelect={onSelectColor}
          size="md"
        />
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="text-sm">
          Size: <span className="font-medium">{selection.size}</span>
        </legend>
        <SizeSelector
          sizes={product.sizes}
          selected={selection.size}
          onSelect={onSelectSize}
          size="md"
        />
      </fieldset>

      <p
        className={cn(
          "text-sm",
          isSoldOut
            ? "text-destructive"
            : stock <= LOW_STOCK_THRESHOLD
              ? "text-amber-700"
              : "text-green-700",
        )}
        aria-live="polite"
      >
        {isSoldOut
          ? `Sold out in ${color.name}, size ${selection.size}`
          : stock <= LOW_STOCK_THRESHOLD
            ? `Only ${stock} left`
            : "In stock"}
      </p>

      <div className="space-y-3">
        <div className="flex gap-3">
          {!isSoldOut && (
            <div className="flex h-10 items-center border">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-full rounded-none"
                aria-label="Decrease quantity"
                disabled={quantity <= 1}
                onClick={() => setQuantity(quantity - 1)}
              >
                <Minus aria-hidden="true" />
              </Button>
              <span
                className="min-w-8 text-center text-sm tabular-nums"
                aria-live="polite"
              >
                {quantity}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-full rounded-none"
                aria-label="Increase quantity"
                disabled={quantity >= stock}
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus aria-hidden="true" />
              </Button>
            </div>
          )}

          {isSoldOut ? (
            <Button className="h-10 flex-1" variant="outline" disabled>
              Sold out
            </Button>
          ) : cart.inCart ? (
            <Button
              className="h-10 flex-1"
              variant="outline"
              onClick={cart.remove}
            >
              <Trash2 aria-hidden="true" />
              Remove from cart
            </Button>
          ) : (
            <Button className="h-10 flex-1" onClick={() => cart.add(quantity)}>
              <ShoppingCart aria-hidden="true" />
              Add to cart
            </Button>
          )}

          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-10"
            aria-label={
              isWishlisted ? "Remove from wishlist" : "Add to wishlist"
            }
            aria-pressed={isWishlisted}
            onClick={() => wishlist.toggle(product.id)}
          >
            <Heart
              aria-hidden="true"
              className={isWishlisted ? "fill-rose-600 text-rose-600" : ""}
            />
          </Button>
        </div>

        {cart.inCart && (
          // A plain link styled as a button, so it is announced as a link
          <Link
            href="/checkout"
            className={buttonVariants({ className: "h-10 w-full" })}
          >
            Go to checkout
          </Link>
        )}
      </div>
    </div>
  );
}
