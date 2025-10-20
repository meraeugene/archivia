"use client";

const ThesisCardSkeleton = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse space-y-4">
      {/* Title + Bookmark */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex flex-col gap-2 flex-1">
          <div className="h-5 bg-gray-200 rounded w-full"></div>
          <div className="h-5 bg-gray-200 rounded w-5/6"></div>
        </div>
        <div className="h-5 w-4 bg-gray-300 rounded"></div>
      </div>

      {/* Adviser / Proponents / Year / Pages */}
      <div className="space-y-2 text-sm text-gray-400 mb-4">
        <div className="h-3 bg-gray-300 rounded w-1/4"></div>
        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
        <div className="h-3 bg-gray-300 rounded w-1/6"></div>
        <div className="h-3 bg-gray-300 rounded w-1/6"></div>

        {/* Category skeleton */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="h-4 w-16 bg-gray-300 rounded"></div>
          <div className="h-4 w-32 bg-gray-200 rounded-full"></div>
          <div className="h-4 w-32 bg-gray-200 rounded-full"></div>
          <div className="h-4 w-32 bg-gray-200 rounded-full"></div>
        </div>
      </div>

      {/* Abstract */}
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 mt-7">
        <div className="flex-1 h-10 bg-gray-300 rounded"></div>
        <div className="flex-1 h-10 bg-gray-400 rounded"></div>
      </div>
    </div>
  );
};

export default ThesisCardSkeleton;
