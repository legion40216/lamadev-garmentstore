"use client";

import { ShoppingBasket } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import useCart from "@/hooks/useCartStore";
import useHydrated from "@/hooks/useHydrated";

export default function Cart() {
  const [isBumping, setIsBumping] = useState(false);
  const previousCount = useRef<number | null>(null);

  const items = useCart((state) => state.items);
  const hydrated = useHydrated();

  const totalCount = hydrated
    ? items.reduce((sum, item) => sum + item.count, 0)
    : 0;

  useEffect(() => {
    const previous = previousCount.current;
    previousCount.current = totalCount;

    if (previous !== null && previous !== totalCount) {
      setIsBumping(true);
      const timeout = window.setTimeout(() => setIsBumping(false), 450);
      return () => window.clearTimeout(timeout);
    }
  }, [totalCount]);

  return (
    <Link
      href="/checkout"
      aria-label={`Go to checkout, ${totalCount} items in cart`}
      className="relative inline-flex size-9 items-center justify-center rounded-md transition-colors hover:bg-accent hover:text-accent-foreground"
    >
      <ShoppingBasket className={`size-5 ${isBumping ? "animate-bounce" : ""}`} />

      {totalCount > 0 && (
        <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
          {totalCount > 9 ? "9+" : totalCount}
        </span>
      )}
    </Link>
  );
}
