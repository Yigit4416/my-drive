import { Skeleton } from "~/components/ui/skeleton";

export default function SkeletonLoading() {
  return (
    <>
      <div className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between border-b bg-white p-4 dark:bg-gray-900">
        <div className="flex flex-row items-center gap-4">
          <Skeleton className="h-7 w-24" /> {/* Logo skeleton */}
          <Skeleton className="hidden h-6 w-16 md:block" /> {/* Nav item */}
          <Skeleton className="hidden h-6 w-16 md:block" /> {/* Nav item */}
        </div>
        <div className="flex flex-row items-center gap-4">
          <Skeleton className="h-9 w-9 rounded-full" /> {/* User button */}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 p-4 pt-[72px] sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {Array(6)
          .fill(null)
          .map((_, index) => (
            <Skeleton key={index} className="h-[130px] w-full rounded-md" />
          ))}
      </div>
    </>
  );
}
