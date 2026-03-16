const CardSkelton = () => {
  return (
    <div className="flex flex-col gap-2 w-full animate-pulse">
      {/* Poster Image Skeleton */}
      <div className="aspect-2/3 w-full rounded-xl bg-neutral-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
      </div>

      {/* Text Info Skeleton */}
      <div className="px-1 space-y-2">
        {/* Title Line */}
        <div className="h-3 w-3/4 rounded-md bg-neutral-800" />
        {/* Date Line */}
        <div className="h-2 w-1/4 rounded-md bg-neutral-900" />
      </div>
    </div>
  )
}

export default CardSkelton