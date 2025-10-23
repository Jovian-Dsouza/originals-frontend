import { Skeleton } from "@/components/ui/skeleton";

export const CollabCardSkeleton = () => {
  return (
    <div className="glass-card rounded-3xl overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="relative h-3/5">
        <Skeleton className="w-full h-full" />
        <div className="absolute top-4 right-4">
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-3/4" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>

        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />

        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-18 rounded-full" />
          <Skeleton className="h-6 w-14 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export const PingItemSkeleton = () => {
  return (
    <div className="border-b border-white/10 p-4 animate-pulse">
      <div className="flex items-start gap-3 mb-3">
        <Skeleton className="h-12 w-12 rounded-full" />
        
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3 w-12" />
          </div>
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-48" />
        </div>
      </div>

      <div className="flex gap-2 ml-15 mt-2">
        <Skeleton className="h-7 w-16" />
        <Skeleton className="h-7 w-20" />
        <Skeleton className="h-7 w-18" />
      </div>
    </div>
  );
};

export const MatchItemSkeleton = () => {
  return (
    <div className="border-b border-white/10 p-4 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Skeleton className="h-14 w-14 rounded-full" />
          <Skeleton className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full" />
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3 w-12" />
          </div>
          
          <Skeleton className="h-4 w-40" />
          
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-5 w-5 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const MessageSkeleton = () => {
  return (
    <div className="flex gap-3 p-3 animate-pulse">
      <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-full max-w-xs" />
      </div>
    </div>
  );
};
