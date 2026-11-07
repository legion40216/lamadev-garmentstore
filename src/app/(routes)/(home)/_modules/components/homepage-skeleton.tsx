import { Skeleton } from "@/components/ui/skeleton";

const PLACEHOLDERS = ["a", "b", "c", "d", "e", "f", "g", "h"];

export default function HomepageSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="aspect-[3/1] w-full rounded-none" />
      <Skeleton className="h-14 w-full" />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {PLACEHOLDERS.map((id) => (
          <Skeleton key={id} className="aspect-[4/5] w-full rounded-none" />
        ))}
      </div>
    </div>
  );
}
