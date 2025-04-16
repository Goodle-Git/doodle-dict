import { Skeleton } from "@/components/ui/skeleton"

export const LeaderboardSkeleton = () => {
  return (
    <div className="p-6 border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] bg-white">
      <Skeleton className="h-10 w-48 mx-auto mb-6" />
      
      {/* Current user rank skeleton */}
      <div className="mb-6">
        <Skeleton className="h-4 w-32 mb-2" />
        <div className="p-4 border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] bg-opacity-20">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="flex gap-4">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-24" />
            </div>
          </div>
        </div>
      </div>

      {/* Separator skeleton */}
      <div className="relative py-4 mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t-2 border-black border-dashed"></div>
        </div>
        <div className="relative flex justify-center">
          <Skeleton className="h-4 w-36 bg-white" />
        </div>
      </div>

      {/* Top 10 entries skeleton */}
      <div className="space-y-4">
        {[...Array(10)].map((_, i) => (
          <div 
            key={i}
            className={`p-4 border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] ${
              i === 0 ? 'bg-doodle-yellow/50' :
              i === 1 ? 'bg-gray-200/50' :
              i === 2 ? 'bg-orange-200/50' : 'bg-white'
            }`}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-6 w-32" />
              </div>
              <div className="flex gap-4">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
