import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Thesis } from "@/types/thesis";

interface CategorySelectorProps {
  form: { category: string[] };
  handleChange: <K extends keyof Thesis>(key: K, value: Thesis[K]) => void;
  categories: Array<{ key: string; label: string }>;
  error?: string;
}

export const CategorySelector = ({
  form,
  handleChange,
  categories,
  error,
}: CategorySelectorProps) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const availableCategories = categories.filter(
    (cat) => cat.key !== "all" && !form.category.includes(cat.key)
  );

  const filteredCategories = availableCategories.filter((cat) =>
    cat.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-1 relative">
      <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
        Category
      </label>

      <div className="flex flex-col gap-2">
        {/* Selected categories + Arrow */}
        <div
          className="flex flex-wrap gap-2 border border-gray-300 p-2 rounded min-h-[44px] cursor-pointer items-center justify-between"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <div className="flex flex-wrap gap-2">
            {form.category?.length ? (
              form.category.map((cat: string) => (
                <span
                  key={cat}
                  className="bg-gray-700 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1"
                >
                  {categories.find((c) => c.key === cat)?.label || cat}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleChange(
                        "category",
                        form.category.filter((v: string) => v !== cat)
                      );
                    }}
                    className="ml-1 text-white/80 hover:text-white"
                  >
                    ✕
                  </button>
                </span>
              ))
            ) : (
              <span className="text-gray-400 text-sm">
                No categories selected
              </span>
            )}
          </div>

          {/* Down Arrow Icon */}
          <ChevronDown
            size={18}
            className={`text-gray-500 transition-transform duration-200 ${
              showDropdown ? "rotate-180" : ""
            }`}
          />
        </div>

        {/* Dropdown */}
        {showDropdown && (
          <div className="absolute z-50 mt-10 w-full max-h-64 overflow-y-auto bg-white border border-gray-200 text-black shadow-lg animate-in fade-in slide-in-from-top-1">
            {/* Search Input */}
            <div className="p-2 border-b border-gray-200 sticky top-0 bg-white">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search category..."
                className="w-full p-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black/10"
              />
            </div>

            {filteredCategories.length === 0 ? (
              <div className="p-3 text-gray-500 text-sm text-center">
                No categories found
              </div>
            ) : (
              filteredCategories.map((cat) => (
                <div
                  key={cat.key}
                  onClick={() => {
                    handleChange("category", [...form.category, cat.key]);
                    setShowDropdown(false);
                    setSearchQuery("");
                  }}
                  className="p-3 text-sm cursor-pointer flex items-center transition hover:bg-gray-50"
                >
                  {cat.label}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
  );
};
