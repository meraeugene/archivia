"use client";
import React from "react";
import { Search } from "lucide-react";

interface SearchFilterProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  currentFilter: string;
  setCurrentFilter: (f: string) => void;
  filterOptions: { key: string; label: string }[];
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  searchQuery,
  setSearchQuery,
  currentFilter,
  setCurrentFilter,
  filterOptions,
}) => {
  return (
    <section id="browse" className="py-10    border-t border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-5">
        <div className="relative mb-5">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search theses by title, author, or keywords..."
            className="w-full px-5 py-4 pr-24 text-base border border-gray-300 rounded-lg bg-white focus:border-gray-800 focus:outline-none transition-colors"
          />
          <button className="absolute right-3 top-1/2 transform -translate-y-1/2 px-4 py-2 rounded font-medium  transition-colors flex items-center gap-2 bg-black hover:bg-black/90 cursor-pointer  text-white ">
            <Search size={16} />
            Search
          </button>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          {filterOptions.map((option) => (
            <button
              key={option.key}
              onClick={() => setCurrentFilter(option.key)}
              className={`px-4 cursor-pointer py-2 rounded-full text-sm font-medium transition-all ${
                currentFilter === option.key
                  ? "bg-black/90 text-white"
                  : "bg-white border border-gray-200 hover:bg-gray-100"
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

export default SearchFilter;
