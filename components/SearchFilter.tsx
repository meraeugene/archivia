"use client";

import { Search } from "lucide-react";
interface CategoryOption {
  key: string;
  label: string;
}

interface SearchCategoryProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  currentCategory: string;
  setCurrentCategory: (value: string) => void;
  categoryOptions: CategoryOption[];
  onSearch?: () => void;
}

const SearchCategory: React.FC<SearchCategoryProps> = ({
  searchQuery,
  setSearchQuery,
  // currentCategory,
  // setCurrentCategory,
  // categoryOptions,
  onSearch,
}) => {
  return (
    <section className="pt-10 ">
      <div className="max-w-5xl mx-auto px-4">
        <div className="relative mb-5 max-w-4xl mx-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && onSearch) onSearch();
            }}
            placeholder="Search by title, adviser, proponents, and keywords..."
            className="w-full pl-3 md:pl-5 py-4 pr-30 md:pr-34 md:text-base shadow-sm border border-gray-200 rounded-lg text-sm bg-white focus:shadow-md focus:outline-none transition-colors"
          />
          <button
            onClick={onSearch}
            className="absolute right-2 md:right-3 top-1/2 transform -translate-y-1/2 px-4 py-2 rounded font-medium bg-black text-white shadow-sm hover:bg-gray-800 cursor-pointer transition-colors flex items-center gap-2"
          >
            <Search size={16} />
            Search
          </button>
        </div>

        {/* <div className="flex flex-wrap gap-3 justify-center">
          {categoryOptions.map((option) => (
            <button
              key={option.key}
              onClick={() => setCurrentCategory(option.key)}
              className={`px-4 cursor-pointer py-2 rounded-full shadow-sm text-xs font-medium transition-all ${
                currentCategory === option.key
                  ? "bg-black text-white"
                  : "bg-white border border-gray-50 hover:bg-gray-50 text-gray-800 "
              }`}
            >
              {option.label}
            </button>
          ))}
        </div> */}
      </div>
    </section>
  );
};

export default SearchCategory;
