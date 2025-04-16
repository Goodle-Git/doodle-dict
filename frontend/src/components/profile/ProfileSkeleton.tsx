import { Skeleton } from "@/components/ui/skeleton"

export const ProfileSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-24" />
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Column Skeleton */}
        <div className="md:w-1/3 space-y-6">
          <div className="border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] bg-white p-6">
            <div className="text-center pb-2">
              <Skeleton className="h-20 w-20 rounded-full mx-auto" />
              <Skeleton className="h-6 w-32 mx-auto mt-4" />
              <Skeleton className="h-4 w-24 mx-auto mt-2" />
            </div>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-2 w-full" />
                <Skeleton className="h-3 w-20 ml-auto" />
              </div>
              <div className="space-y-4 pt-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] bg-white p-6">
            <Skeleton className="h-6 w-40 mb-4" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>

        {/* Right Column Skeleton */}
        <div className="md:w-2/3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] bg-white p-4">
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
