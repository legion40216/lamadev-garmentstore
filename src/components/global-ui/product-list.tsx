import ProductCard from "@/components/global-ui/product-card";
import { cn } from "@/lib/utils";
import type { ProductSize, ProductType } from "@/types/types";

type ProductListProps = {
  initialData: ProductType[];
  // Set when the list is filtered to one size (?size=M); cards open on it.
  selectedSize?: ProductSize;
  // next/image `sizes` hint, so the browser fetches the right photo width
  cardSizes?: string;
  // Replaces the default column layout (e.g. when the shopper picks one)
  className?: string;
};

const DEFAULT_COLUMNS = "grid-cols-2 md:grid-cols-4";

// The one product grid, shared by the homepage and the /products listing.
export default function ProductList({
  initialData,
  selectedSize,
  cardSizes,
  className = DEFAULT_COLUMNS,
}: ProductListProps) {
  if (initialData.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">
        No products found.
      </p>
    );
  }

  return (
    <div className={cn("grid gap-4", className)}>
      {initialData.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          selectedSize={selectedSize}
          sizes={cardSizes}
        />
      ))}
    </div>
  );
}
