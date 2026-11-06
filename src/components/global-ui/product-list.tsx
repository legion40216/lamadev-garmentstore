import ProductCard from "@/components/global-ui/product-card";
import type { ProductType } from "@/types/types";

type ProductListProps = {
  initialData: ProductType[];
};

export default function ProductList({ initialData }: ProductListProps) {
  if (initialData.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">
        No products found.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4">
      {initialData.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
