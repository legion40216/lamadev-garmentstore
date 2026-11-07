import { Suspense } from "react";

import { resolveListingParams } from "@/utils/resolve-listing-params";
import HomepageSkeleton from "./_modules/components/homepage-skeleton";
import HomepageView from "./_modules/views/homepage-view";

export default function Page({ searchParams }: PageProps<"/">) {
  // ?category= is request-time data, so it is read inside Suspense.
  return (
    <Suspense fallback={<HomepageSkeleton />}>
      <Home searchParams={searchParams} />
    </Suspense>
  );
}

async function Home({ searchParams }: Pick<PageProps<"/">, "searchParams">) {
  // Unusable values (e.g. ?category=red) redirect to the clean "/" URL.
  const { category } = await resolveListingParams(searchParams, "/");

  return <HomepageView categoryParam={category} />;
}
