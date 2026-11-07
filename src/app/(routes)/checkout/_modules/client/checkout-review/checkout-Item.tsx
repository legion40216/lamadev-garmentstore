"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import useCart from "@/hooks/useCartStore";
import type { CartItemType } from "@/types/cart";
import { formatter } from "@/utils/formatters";
import { getProductPath } from "@/utils/product-url";

type CheckoutItemProps = {
  item: CartItemType;
};

export default function CheckoutItem({ item }: CheckoutItemProps) {
  const removeItem = useCart((state) => state.removeItem);
  const updateItemCount = useCart((state) => state.updateItemCount);

  return (
    <li className="group flex gap-3">
      <Link
        href={getProductPath(item.slug, { size: item.size, color: item.color })}
        className="relative block aspect-square w-24 shrink-0 overflow-hidden rounded-md border border-gray-200"
      >
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="96px"
          className="object-cover"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={getProductPath(item.slug, {
                size: item.size,
                color: item.color,
              })}
              className="font-semibold underline-offset-4 hover:underline"
            >
              {item.name}
            </Link>
            <p className="mt-1 text-xs text-muted-foreground">
              Size: {item.size} · Color: {item.color}
            </p>
          </div>

          <div className="shrink-0 text-right">
            <p className="text-sm tabular-nums">
              {formatter.format(item.price * item.count)}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatter.format(item.price)} each
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex w-max items-center rounded-md border">
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Decrease quantity of ${item.name}`}
              onClick={() => updateItemCount(item.id, item.count - 1)}
              disabled={item.count <= 1}
            >
              <Minus className="size-4" />
            </Button>
            <span className="px-3 text-sm tabular-nums">{item.count}</span>
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Increase quantity of ${item.name}`}
              onClick={() => updateItemCount(item.id, item.count + 1)}
              disabled={item.count >= item.stock}
            >
              <Plus className="size-4" />
            </Button>
          </div>

          <Button
            className="text-red-600 hover:text-red-600"
            variant="ghost"
            size="sm"
            onClick={() => removeItem(item.id)}
          >
            <Trash2 className="mr-2 size-4" />
            Remove
          </Button>
        </div>
      </div>
    </li>
  );
}
