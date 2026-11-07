import ProductList from "@/components/global-ui/product-list";
import { categories } from "@/data/categories";
import { products } from "@/data/data";
import type { ProductType } from "@/types/types";

const RELATED_LIMIT = 4;

// Other products from the same category, under the product being viewed.
export default function RelatedProducts({ product }: { product: ProductType }) {
  const related = products
    .filter(
      (item) => item.category === product.category && item.id !== product.id,
    )
    .slice(0, RELATED_LIMIT);

  if (related.length === 0) return null;

  const categoryName =
    categories.find((item) => item.slug === product.category)?.name ??
    product.category;

  return (
    <section className="space-y-4 pt-6" aria-labelledby="related-products">
      <h2
        id="related-products"
        className="text-xl font-semibold tracking-tight"
      >
        More in {categoryName}
      </h2>
      <ProductList initialData={related} />
    </section>
  );
}
