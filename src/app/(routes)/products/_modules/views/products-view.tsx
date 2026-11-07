import CategoriesBar from "@/components/global-ui/categories-bar";
import ProductSection from "@/features/product-listing/product-section";
import type { SearchParamsValues } from "@/schema";

export default function ProductsView({
  params,
}: {
  params: SearchParamsValues;
}) {
  return (
    <div className="space-y-6">
      <CategoriesBar categoryParam={params.category} />

      {/* Category is picked with the tabs above, so the sidebar skips it. */}
      <ProductSection
        categoryParam={params.category}
        filterParam={params.filter}
        sizeParam={params.size}
        minPrice={params.minPrice}
        maxPrice={params.maxPrice}
        featuredParam={params.featured}
        inStockParam={params.inStock}
        showCategoryFilter={false}
        headingTitle="Products"
        headingSubtitle="Browse everything, or narrow it down with the filters."
      />
    </div>
  );
}
