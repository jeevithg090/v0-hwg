import { Skeleton } from "@/components/ui/skeleton"

/** Generic dashboard placeholder shown while a route segment loads. */
export function PageSkeleton() {
  return (
    <div role="status" aria-live="polite" aria-label="Loading page" className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-56 max-w-full" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-28 rounded-lg" />
        ))}
      </div>
      <Skeleton className="h-10 w-full rounded-md" />
      <div className="space-y-4">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="h-36 rounded-lg" />
        ))}
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  )
}
