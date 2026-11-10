"use client";

import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils";
import type { ProductType } from "@/types/types";
import {
  changeSize,
  getColor,
  getSizeOption,
  getStock,
  hasDiscount,
  isColorOffered,
  type Selection,
} from "@/utils/product-variants";
import ProductDetails from "../components/product-details";

export default function ProductSection({
  product,
  initialSelection,
}: {
  product: ProductType;
  initialSelection: Selection;
}) {
  const [selection, setSelection] = useState<Selection>(initialSelection);
  // The gallery can preview a colour that isn't offered in the selected size.
  // Product details and cart data continue to use selection.
  const [viewedColorName, setViewedColorName] = useState(initialSelection.color);

  const option = getSizeOption(product, selection.size) ?? product.sizes[0];
  const color = getColor(product, selection.color) ?? product.colors[0];
  const viewedColor = getColor(product, viewedColorName) ?? color;
  const viewedColorOffered = isColorOffered(option, viewedColor.name);

  const isSoldOut = getStock(option, color.name) === 0;
  const viewedColorIsSoldOut =
    viewedColorOffered && getStock(option, viewedColor.name) === 0;
  const onSale = hasDiscount(option);

  // A real product selection updates both the details and the gallery.
  // Keep the URL in step with that purchasable selection, not image previews.
  const select = (next: Selection) => {
    setSelection(next);
    setViewedColorName(next.color);

    const url = new URL(window.location.href);
    url.searchParams.set("size", next.size);
    url.searchParams.set("color", next.color);
    window.history.replaceState(null, "", url);
  };

  // Previewing an unavailable colour changes only the gallery image.
  const previewColor = (colorName: string) => {
    setViewedColorName(colorName);

    if (isColorOffered(option, colorName)) {
      select({ size: selection.size, color: colorName });
    }
  };

  return (
    <div className="grid gap-8 md:grid-cols-2 md:gap-12">
      <div className="space-y-3">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted">
          <Image
            src={viewedColor.image}
            alt={product.name + " in " + viewedColor.name}
            fill
            priority
            sizes="(min-width: 1200px) 560px, (min-width: 768px) 45vw, 100vw"
            className="object-cover"
          />

          {(onSale || product.isNew) && (
            <span className="pointer-events-none absolute left-3 top-3 bg-background px-2 py-1 text-[10px] font-medium uppercase tracking-[0.12em]">
              {onSale ? "Sale" : "New"}
            </span>
          )}

          {(!viewedColorOffered || viewedColorIsSoldOut || isSoldOut) && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background/65">
              <span className="border border-foreground/20 bg-background/90 px-3 py-2 text-[10px] font-medium uppercase tracking-[0.14em]">
                {!viewedColorOffered
                  ? "Not available in size " + option.size
                  : viewedColorIsSoldOut || isSoldOut
                    ? "Sold out"
                    : ""}
              </span>
            </div>
          )}
        </div>

        {/* Every colour photo stays viewable, including colours not offered in this size. */}
        {product.colors.length > 1 && (
          <ul className="grid grid-cols-4 gap-3" aria-label="Colour photos">
            {product.colors.map((item) => {
              const offered = isColorOffered(option, item.name);
              const isViewed = item.name === viewedColor.name;
              const isSelected = item.name === color.name;

              return (
                <li key={item.name}>
                  <button
                    type="button"
                    aria-pressed={isViewed}
                    aria-label={
                      offered
                        ? "Show " + item.name + (isSelected ? ", selected" : "")
                        : "Preview " + item.name + "; not available in size " + option.size
                    }
                    title={
                      offered ? item.name : "Not available in size " + option.size
                    }
                    onClick={() => previewColor(item.name)}
                    className={cn(
                      "relative block aspect-[4/5] w-full overflow-hidden border bg-muted outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                      isViewed
                        ? "border-foreground"
                        : "border-transparent hover:border-foreground/40",
                      !offered && "opacity-60",
                    )}
                  >
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 10vw, 22vw"
                      className="object-cover"
                    />
                    {!offered && (
                      <span className="pointer-events-none absolute bottom-1 left-1 right-1 bg-background/90 px-1 py-0.5 text-[9px] font-medium uppercase tracking-wide">
                        Unavailable
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <ProductDetails
        product={product}
        selection={selection}
        onSelectSize={(size) => select(changeSize(product, selection, size))}
        onSelectColor={(name) => select({ size: selection.size, color: name })}
      />
    </div>
  );
}
