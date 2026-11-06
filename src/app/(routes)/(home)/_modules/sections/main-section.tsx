import EmptyState from "@/components/global-ui/empty-state";
import ProductList from "@/components/global-ui/product-list";
import { products } from "@/data/data";
import type { CategorySlug } from "@/schema";

const HOME_PRODUCT_LIMIT = 8;

export default function MainSection({
  categoryParam,
}: {
  categoryParam: CategorySlug;
}) {
  const visibleProducts = products
    .filter(
      (product) =>
        categoryParam === "all" || product.category === categoryParam,
    )
    .slice(0, HOME_PRODUCT_LIMIT);

  if (visibleProducts.length === 0) {
    return <EmptyState title="Nothing here yet" subtitle="Check back soon." />;
  }

  return <ProductList initialData={visibleProducts} />;
}
