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
}: CategorySelectorProps) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
      Category
    </label>

    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2 border border-gray-300 p-2 rounded min-h-[44px] bg-white">
        {form.category?.length ? (
          form.category.map((cat: string) => (
            <span
              key={cat}
              className="bg-gray-700 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1"
            >
              {categories.find((c) => c.key === cat)?.label || cat}
              <button
                type="button"
                onClick={() =>
                  handleChange(
                    "category",
                    form.category.filter((v: string) => v !== cat)
                  )
                }
                className="ml-1 text-white/80 hover:text-white"
              >
                ✕
              </button>
            </span>
          ))
        ) : (
          <span className="text-gray-400 text-sm">No categories selected</span>
        )}
      </div>

      <select
        className={`w-full border border-gray-300 p-2 rounded bg-white ${
          error ? "border-red-500" : ""
        }`}
        onChange={(e) => {
          const selected = e.target.value;
          if (selected && !form.category.includes(selected)) {
            handleChange("category", [...form.category, selected]);
          }
          e.target.value = "";
        }}
        defaultValue=""
      >
        <option value="">Select a category</option>
        {categories
          .filter(
            (cat) => cat.key !== "all" && !form.category.includes(cat.key)
          )
          .map((cat) => (
            <option key={cat.key} value={cat.key}>
              {cat.label}
            </option>
          ))}
      </select>
    </div>

    {error && <span className="text-red-500 text-xs">{error}</span>}
  </div>
);
