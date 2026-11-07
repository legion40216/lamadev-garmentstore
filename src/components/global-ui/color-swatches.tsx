import { cn } from "@/lib/utils";
import type { ProductColor, ProductSizeOption } from "@/types/types";
import { getStock, isColorOffered } from "@/utils/product-variants";

const variants = {
  sm: { swatch: "size-5", gap: "gap-1.5" }, // product card
  md: { swatch: "size-8", gap: "gap-3" }, // product page
} as const;

interface ColorSwatchesProps {
  colors: ProductColor[];
  // The size currently chosen. Colours it doesn't come in are disabled.
  option: ProductSizeOption;
  selected: string; // colour name
  onSelect: (colorName: string) => void;
  size?: keyof typeof variants;
}

// Colour picker shared by the product card and the product page. Colours the
// size isn't made in are disabled; sold-out ones can still be looked at.
export default function ColorSwatches({
  colors,
  option,
  selected,
  onSelect,
  size = "sm",
}: ColorSwatchesProps) {
  const { swatch, gap } = variants[size];

  return (
    <ul className={cn("flex flex-wrap", gap)} aria-label="Colour">
      {colors.map((item) => {
        const offered = isColorOffered(option, item.name);
        const soldOut = offered && getStock(option, item.name) === 0;
        const isSelected = item.name === selected;

        return (
          <li key={item.name}>
            <button
              type="button"
              disabled={!offered}
              aria-pressed={isSelected}
              aria-label={
                !offered
                  ? `${item.name}, not made in size ${option.size}`
                  : soldOut
                    ? `${item.name}, sold out`
                    : item.name
              }
              title={item.name}
              onClick={() => onSelect(item.name)}
              className={cn(
                "relative block overflow-hidden rounded-full border border-foreground/20 outline-none transition-opacity focus-visible:ring-2 focus-visible:ring-ring",
                swatch,
                isSelected &&
                  "ring-2 ring-foreground ring-offset-2 ring-offset-background",
                !offered && "cursor-not-allowed opacity-30",
                soldOut && "opacity-60",
              )}
              style={{ backgroundColor: item.code }}
            >
              {(!offered || soldOut) && (
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-1/2 h-px w-full -rotate-45 bg-foreground/70"
                />
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
