import Skeleton from '@/components/Skeleton'

export default function DashboardLoading() {
  return (
    <div>
      {/* Page header skeleton */}
      <Skeleton className="h-8 w-48 mb-8" />

      {/* Widget grid skeleton — 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Scores widget skeleton */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <Skeleton className="h-5 w-32 mb-4" />
          <div className="space-y-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>

        {/* Fixtures widget skeleton */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <Skeleton className="h-5 w-40 mb-4" />
          <div className="space-y-3">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        </div>

        {/* Standings widget skeleton */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 md:col-span-2">
          <Skeleton className="h-5 w-36 mb-4" />
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}