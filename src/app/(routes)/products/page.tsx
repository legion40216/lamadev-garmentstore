import { Suspense } from "react";

import { resolveListingParams } from "@/utils/resolve-listing-params";
import ProductsSkeleton from "./_modules/components/products-skeleton";
import ProductsView from "./_modules/views/products-view";

export default function Page({ searchParams }: PageProps<"/products">) {
  // The filters live in the URL, which is request-time data, so everything
  // that reads it sits inside Suspense with a skeleton as the fallback.
  return (
    <Suspense fallback={<ProductsSkeleton />}>
      <Listing searchParams={searchParams} />
    </Suspense>
  );
}

async function Listing({
  searchParams,
}: Pick<PageProps<"/products">, "searchParams">) {
  // Unusable values (e.g. ?category=red) redirect to a clean /products URL.
  const params = await resolveListingParams(searchParams, "/products");

  return <ProductsView params={params} />;
}
