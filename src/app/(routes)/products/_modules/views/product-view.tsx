import type { CategorySlug, FilterValue } from "@/schema";

import CategoriesBar from "@/components/global-ui/categories-bar";
import ProductsCategory from "../sections/products-category";

export default function ProductView({
  categoryParam,
  filterParam,
}: {
  categoryParam: CategorySlug;
  filterParam: FilterValue;
}) {
  return (
    <div className="space-y-4">
      <CategoriesBar categoryParam={categoryParam} />
      <ProductsCategory
        categoryParam={categoryParam}
        filterParam={filterParam}
      />
    </div>
  );
}
