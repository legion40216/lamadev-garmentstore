"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { categories } from "@/data/categories";
import { Button } from "@/components/ui/button";

export default function CategoriesBar({
  categoryParam,
}: {
  categoryParam: string | string[];
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleCategoryClick = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("category", slug);
    router.replace(`?${params.toString()}`);
  };

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-2 rounded-md bg-gray-100 p-2">
      {categories.map((item) => {
        const Icon = item.icon;
        const isActive = categoryParam === item.slug;

        return (
          <Button
            key={item.slug}
            onClick={() => handleCategoryClick(item.slug)}
            variant="default"
            className={`bg-transparent text-sm hover:bg-lama-primary-background hover:!text-primary !text-muted-foreground ${isActive ? "!text-primary bg-lama-primary-background" : ""}`}
          >
            <span className="mr-2">
              <Icon className="size-5" />
            </span>
            {item.name}
          </Button>
        );
      })}
    </div>
  );
}
