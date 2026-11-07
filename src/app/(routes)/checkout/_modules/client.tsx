"use client";

import useCart from "@/hooks/useCartStore";
import CheckoutReview from "./client/checkout-review";

export default function Client() {
  const items = useCart((state) => state.items);

  const totalPrice = items.reduce(
    (total, item) => total + item.price * item.count,
    0,
  );

  return (
    <CheckoutReview
      items={items}
      totalPrice={totalPrice}
      itemsLenghtZero={items.length === 0}
    />
  );
}
