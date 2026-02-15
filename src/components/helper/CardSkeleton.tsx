// components/CardSkeleton.tsx
const CardSkeleton = () => {
  return (
    <div className="p-4 w-full sm:w-1/2 lg:w-1/3 shrink-0">
      <div className="animate-pulse rounded-2xl border border-gray-200 overflow-hidden bg-white">
        {/* Image */}
        <div className="h-48 bg-gray-300" />

        <div className="p-4 space-y-3">
          <div className="h-4 bg-gray-300 rounded" />
          <div className="h-3 bg-gray-300 rounded w-4/5" />
          <div className="h-3 bg-gray-300 rounded w-1/5" />
          <div className="h-6 bg-gray-300 rounded" />
          <div className="flex justify-between">
            <div className="h-6 bg-gray-300 rounded w-12 mt-6" />
            <div className="h-6 bg-gray-300 rounded w-24 mt-6" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardSkeleton;
