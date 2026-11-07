import { cn } from "@/lib/utils";
import type { ProductSize, ProductSizeOption } from "@/types/types";
import { isSizeInStock } from "@/utils/product-variants";

const variants = {
  sm: { button: "h-7 min-w-8 px-1.5 text-[11px]", gap: "gap-1" }, // card
  md: { button: "h-10 min-w-12 px-3 text-sm", gap: "gap-2" }, // product page
} as const;

interface SizeSelectorProps {
  sizes: ProductSizeOption[];
  selected: ProductSize;
  onSelect: (size: ProductSize) => void;
  size?: keyof typeof variants;
}

// Size picker shared by the product card and the product page. Sold-out sizes
// stay selectable (struck through) so the shopper can see the colour options,
// but they can't be added to the cart.
export default function SizeSelector({
  sizes,
  selected,
  onSelect,
  size = "sm",
}: SizeSelectorProps) {
  const { button, gap } = variants[size];

  return (
    <ul className={cn("flex flex-wrap", gap)} aria-label="Size">
      {sizes.map((item) => {
        const isSelected = item.size === selected;
        const soldOut = !isSizeInStock(item);

        return (
          <li key={item.size}>
            <button
              type="button"
              aria-pressed={isSelected}
              aria-label={
                soldOut ? `Size ${item.size}, sold out` : `Size ${item.size}`
              }
              onClick={() => onSelect(item.size)}
              className={cn(
                "border tabular-nums outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                button,
                isSelected
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-foreground hover:border-foreground",
                soldOut && !isSelected && "text-muted-foreground line-through",
              )}
            >
              {item.size}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
