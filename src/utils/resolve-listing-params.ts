import { redirect } from "next/navigation";
import { PRICE_BOUNDS } from "@/data/constants";
import {
  getValidatedSearchParams,
  normalizeSearchParams,
  type RawSearchParams,
} from "@/utils/parseSearchParams";

function isPrice(value: string): boolean {
  const price = Number(value);

  return (
    value.trim() !== "" &&
    Number.isFinite(price) &&
    price >= PRICE_BOUNDS.min &&
    price <= PRICE_BOUNDS.max
  );
}

/**
 * Shared search-param handling for listing pages (/ and /products).
 *
 * Parses and validates the URL params. Every param already falls back to a
 * safe default, but if the URL carries a value that was not usable (e.g.
 * ?category=red) the shopper is redirected to `basePath` with only the valid
 * params kept, so the address always matches what the page shows. The user
 * stays on the same page.
 */
export async function resolveListingParams(
  searchParams: Promise<RawSearchParams>,
  basePath: string,
) {
  const raw = normalizeSearchParams(await searchParams);
  const validated = getValidatedSearchParams(raw);

  // The params a listing understands, and whether a given value is usable.
  const isUsable: Record<string, (value: string) => boolean> = {
    category: (value) => value === validated.category,
    filter: (value) => value === validated.filter,
    size: (value) => value === validated.size,
    minPrice: isPrice,
    maxPrice: isPrice,
    inStock: (value) => value === "true",
    featured: (value) => value === "true",
  };

  const clean = new URLSearchParams();
  let hasUnusableValue = false;

  for (const [key, check] of Object.entries(isUsable)) {
    const value = raw[key];
    if (value === undefined) continue;

    if (check(value)) clean.set(key, value);
    else hasUnusableValue = true;
  }

  if (hasUnusableValue) {
    const query = clean.toString();
    redirect(query ? `${basePath}?${query}` : basePath);
  }

  return validated;
}
