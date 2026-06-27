// Skeleton loading components

export function ProductCardSkeleton({ count = 1 }: { count?: number }) {
  if (count > 1) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-2">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="shrink-0 w-55">
            <ProductCardSkeleton />
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col animate-pulse">
      <div className="h-44 bg-gray-100" />
      <div className="p-3 flex flex-col gap-2 flex-1">
        <div className="h-3 bg-gray-100 rounded-full w-1/3" />
        <div className="h-4 bg-gray-100 rounded-full w-4/5" />
        <div className="h-3 bg-gray-100 rounded-full w-2/3" />
        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="h-5 bg-gray-100 rounded-full w-1/3" />
          <div className="h-7 bg-gray-100 rounded-full w-1/4" />
        </div>
      </div>
    </div>
  );
}

export function FeaturedProductCardSkeleton() {
  return (
    <div className="relative flex gap-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-2.5 animate-pulse h-full">
      <div className="w-20 h-20 shrink-0 rounded-xl bg-gray-100" />
      <div className="flex flex-col gap-2 flex-1 py-1">
        <div className="h-3 bg-gray-100 rounded-full w-1/3" />
        <div className="h-4 bg-gray-100 rounded-full w-4/5" />
        <div className="h-3 bg-gray-100 rounded-full w-1/2" />
        <div className="h-5 bg-gray-100 rounded-full w-2/5 mt-auto" />
      </div>
    </div>
  );
}

export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-gray-100 rounded-full w-3/4" />
        </td>
      ))}
    </tr>
  );
}

export function CardSkeleton({ count = 1 }: { count?: number }) {
  if (count > 1) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i}>
            <CardSkeleton />
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 animate-pulse flex flex-col gap-3">
      <div className="h-32 bg-gray-100 rounded-xl" />
      <div className="h-4 bg-gray-100 rounded-full w-2/3" />
      <div className="h-3 bg-gray-100 rounded-full w-1/2" />
      <div className="h-3 bg-gray-100 rounded-full w-3/4" />
    </div>
  );
}

export function KoperasiCardSkeleton({ count = 1 }: { count?: number }) {
  if (count > 1) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-2">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="shrink-0 w-60">
            <KoperasiCardSkeleton />
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
      <div className="h-28 bg-gray-100" />
      <div className="p-4 flex flex-col gap-2">
        <div className="h-4 bg-gray-100 rounded-full w-2/3" />
        <div className="h-3 bg-gray-100 rounded-full w-1/2" />
        <div className="h-3 bg-gray-100 rounded-full w-3/4" />
        <div className="flex gap-2 mt-2">
          <div className="h-6 bg-gray-100 rounded-full w-16" />
          <div className="h-6 bg-gray-100 rounded-full w-16" />
        </div>
      </div>
    </div>
  );
}
