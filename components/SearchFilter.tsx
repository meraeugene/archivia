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
  currentCategory,
  setCurrentCategory,
  categoryOptions,
  onSearch,
}) => {
  return (
    <section className="py-10 border-t border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-5">
        <div className="relative mb-5 max-w-4xl mx-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && onSearch) onSearch();
            }}
            placeholder="Search theses by title, adviser, or keywords..."
            className="w-full px-5 py-4 pr-24 text-base border border-gray-300 rounded-lg bg-white focus:border-gray-800 focus:outline-none transition-colors"
          />
          <button
            onClick={onSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 px-4 py-2 rounded font-medium bg-black text-white hover:bg-gray-800 cursor-pointer transition-colors flex items-center gap-2"
          >
            <Search size={16} />
            Search
          </button>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          {categoryOptions.map((option) => (
            <button
              key={option.key}
              onClick={() => setCurrentCategory(option.key)}
              className={`px-4 cursor-pointer py-2 rounded-full text-xs font-medium transition-all ${
                currentCategory === option.key
                  ? "bg-black text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-800"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SearchCategory;
