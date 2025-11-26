"use client";

import { Search, X } from "lucide-react";
import debounce from "lodash.debounce";
import { useMemo } from "react";

interface SearchCategoryProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  onSearch?: (query?: string) => void;
}

const DEBOUNCE_DELAY = 500;

const SearchCategory: React.FC<SearchCategoryProps> = ({
  searchQuery,
  setSearchQuery,
  onSearch,
}) => {
  // Create a stable debounced function (memoized)
  const debouncedSearch = useMemo(() => {
    return debounce((value: string) => {
      onSearch?.(value);
    }, DEBOUNCE_DELAY);
  }, [onSearch]);

  const handleChange = (value: string) => {
    setSearchQuery(value);

    if (value.trim() === "") {
      debouncedSearch.cancel(); // cancel any pending search
      onSearch?.(""); // immediately reset displayed theses
    } else {
      debouncedSearch(value.trim());
    }
  };

  const handleClear = () => {
    setSearchQuery("");
    debouncedSearch.cancel(); // Cancel any pending search
    onSearch?.(""); // Immediately reset displayed theses
  };

  return (
    <section className="pt-10">
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        <div className="relative max-w-4xl mx-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Search by title, adviser, proponents, and keywords..."
            className="w-full pl-10 pr-12 py-3 md:text-base shadow-xs border border-gray-200 
              text-sm bg-white focus:shadow-sm focus:outline-none transition-colors rounded-sm"
          />

          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />

          {searchQuery && (
            <button
              onClick={handleClear}
              className="absolute cursor-pointer right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default SearchCategory;
