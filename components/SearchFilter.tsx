"use client";

import { Search, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";

interface CategoryOption {
  key: string;
  label: string;
}

interface SearchCategoryProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  currentCategory: string;
  categoryOptions: CategoryOption[];
  onSearch?: (query?: string) => void;
}

const COOKIE_KEY = "archivia_search_history";
const MAX_HISTORY = 3;

const SearchCategory: React.FC<SearchCategoryProps> = ({
  searchQuery,
  setSearchQuery,
  onSearch,
}) => {
  const [history, setHistory] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load history from cookies on mount
  useEffect(() => {
    const cookie = Cookies.get(COOKIE_KEY);
    if (cookie) setHistory(JSON.parse(cookie));
  }, []);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Handle search action
  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    const newHistory = [
      searchQuery,
      ...history.filter((h) => h !== searchQuery),
    ].slice(0, MAX_HISTORY);
    setHistory(newHistory);
    Cookies.set(COOKIE_KEY, JSON.stringify(newHistory), { expires: 30 });

    setShowDropdown(false);
    if (onSearch) onSearch();
  };

  const handleClear = () => {
    setSearchQuery("");
    setShowDropdown(false);
  };

  // Click a history item
  const handleHistoryClick = (item: string) => {
    setSearchQuery(item);
    setShowDropdown(false);

    // Trigger search with the clicked history item
    if (onSearch) onSearch(item);
  };

  return (
    <section className="pt-10">
      <div className="max-w-5xl mx-auto px-4" ref={containerRef}>
        <div className="relative max-w-4xl mx-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            placeholder="Search by title, adviser, proponents, and keywords..."
            className={`w-full pl-10 pr-12 py-3 md:text-base shadow-sm border border-gray-200 
            text-sm bg-white focus:shadow-md focus:outline-none transition-colors
            ${showDropdown ? "rounded-t-lg rounded-b-none" : "rounded-lg"}`}
          />

          {/* Search Icon on left */}
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />

          {/* Clear X Button */}
          {searchQuery && (
            <button
              onClick={handleClear}
              className="absolute cursor-pointer right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700"
            >
              <X size={18} />
            </button>
          )}

          {/* Dropdown */}
          {showDropdown && history.length > 0 && (
            <ul
              className={`absolute z-50 w-full bg-white border border-t-0 border-gray-200 rounded-b-lg shadow-md max-h-60 overflow-auto`}
            >
              {history.map((item, index) => (
                <li
                  key={index}
                  onClick={() => handleHistoryClick(item)}
                  className="flex items-center gap-2 p-3 hover:bg-gray-100 cursor-pointer text-gray-700"
                >
                  <Search size={18} className="text-gray-400" />
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
};

export default SearchCategory;
