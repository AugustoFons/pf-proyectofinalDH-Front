export function CardSkeleton() {
  return (
    <article className="bg-fb-surface border border-fb-stroke rounded-lg overflow-hidden shadow-sm animate-pulse">
      <div className="w-full h-48 bg-gray-300"></div>
      <div className="p-3">
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      </div>
    </article>
  );
}
