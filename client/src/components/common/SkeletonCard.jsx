const SkeletonCard = () => (
  <div className="card overflow-hidden">
    <div className="skeleton aspect-product w-full" />
    <div className="p-4 space-y-3">
      <div className="skeleton h-3 w-16 rounded" />
      <div className="skeleton h-4 w-full rounded" />
      <div className="skeleton h-4 w-3/4 rounded" />
      <div className="skeleton h-3 w-20 rounded" />
      <div className="skeleton h-5 w-24 rounded" />
    </div>
  </div>
);

export const SkeletonGrid = ({ count = 8 }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
    {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
  </div>
);

export default SkeletonCard;
