import Skeleton from "@/app/_components/Skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Skeleton className="h-10 w-2/3 rounded-xl" />
      <Skeleton className="mt-3 h-5 w-1/2 rounded-xl" />
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <Skeleton className="h-80 w-full rounded-2xl" />
          <Skeleton className="mt-6 h-28 w-full rounded-2xl" />
        </div>
        <div className="lg:col-span-4">
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
