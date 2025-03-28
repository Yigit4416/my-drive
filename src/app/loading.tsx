import { Skeleton } from "~/components/ui/skeleton";

export default function SkeletonLoading() {
  return (
    <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
      {Array(6)
        .fill(null)
        .map((_, index) => (
          <Skeleton key={index} className="h-[130px] w-[192px] rounded-md" />
        ))}
    </div>
  );
}
