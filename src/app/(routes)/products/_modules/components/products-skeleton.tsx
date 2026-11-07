import { Skeleton } from "@/components/ui/skeleton";

const PLACEHOLDERS = ["a", "b", "c", "d", "e", "f"];

export default function ProductsSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-14 w-full" />

      <div className="space-y-2">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>

      <div className="flex flex-col gap-6 md:flex-row">
        <Skeleton className="hidden h-96 w-56 shrink-0 md:block" />

        <div className="grid flex-1 grid-cols-2 gap-4 md:grid-cols-3">
          {PLACEHOLDERS.map((id) => (
            <Skeleton key={id} className="aspect-[4/5] w-full rounded-none" />
          ))}
        </div>
      </div>
    </div>
  );
}
