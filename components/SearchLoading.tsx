import Masonry from "react-masonry-css";

const SearchLoading = () => {
  const breakpointColumnsObj = {
    default: 2,
    768: 1,
  };

  return (
    <div>
      <div className="mb-6 md:mb-10 flex flex-col gap-4 animate-pulse">
        <div className="flex w-full justify-between flex-col-reverse items-center md:flex-row gap-4">
          {/* Left side text skeleton */}
          <div className="mb-3 sm:mb-0 w-full md:w-1/2">
            <div className="h-4 bg-gray-200 rounded w-2/3 md:w-1/2"></div>
          </div>

          {/* Right side selects skeleton */}
          <div className="flex gap-4 flex-col md:flex-row w-full md:w-fit">
            <div className="h-8  bg-gray-200 rounded w-full md:w-[150px]"></div>
            <div className="h-8 bg-gray-200 rounded w-full md:w-[150px]"></div>
          </div>
        </div>
      </div>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex gap-8"
        columnClassName="space-y-8"
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={`skeleton-${i}`}
            className="animate-pulse bg-white border border-gray-100 rounded-lg p-6 shadow h-fit"
          >
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>

            <div className="flex gap-2 mb-4">
              <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
              <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
            </div>

            <div className="space-y-2 mb-6">
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-4/5"></div>
              <div className="h-3 bg-gray-200 rounded w-3/5"></div>
            </div>

            <div className="flex gap-3 mt-6">
              <div className="h-10 bg-gray-200 rounded w-1/2"></div>
              <div className="h-10 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </Masonry>
    </div>
  );
};

export default SearchLoading;
