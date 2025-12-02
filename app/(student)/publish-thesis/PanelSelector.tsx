import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface Panel {
  adviser_id: string;
  full_name: string;
}

interface PanelSelectorProps {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  panels: Panel[];
  error?: string;
}

export const PanelSelector = ({
  label,
  value,
  onChange,
  panels,
  error,
}: PanelSelectorProps) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAdvisers = panels
    .filter((adv) =>
      adv.full_name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => a.full_name.localeCompare(b.full_name));

  return (
    <div className="flex flex-col gap-1 relative">
      <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
        {label}
      </label>

      {/* Input Box */}
      <div
        onClick={() => setShowDropdown(!showDropdown)}
        className="border border-gray-300 rounded px-3 py-2 min-h-[44px] cursor-pointer flex items-center justify-between"
      >
        <span className={value ? "text-black" : "text-gray-400 text-sm"}>
          {value || "Select adviser"}
        </span>

        <ChevronDown
          size={18}
          className={`text-gray-500 transition-transform ${
            showDropdown ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute z-50 mt-14 w-full max-h-48 overflow-y-auto bg-white border border-gray-200 shadow-lg ">
          {/* Search */}
          <div className="p-2 border-b bg-white sticky top-0">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search faculty name"
              className="w-full p-2 text-black text-sm border rounded focus:outline-none"
            />
          </div>

          {filteredAdvisers.length === 0 ? (
            <div className="p-3 text-sm text-gray-500 text-center">
              No advisers found
            </div>
          ) : (
            filteredAdvisers.map((adv) => {
              return (
                <div
                  key={adv.adviser_id}
                  onClick={() => {
                    onChange(adv.full_name);
                    setShowDropdown(false);
                    setSearchQuery("");
                  }}
                  className="p-3 text-sm cursor-pointer text-black flex items-center transition hover:bg-gray-50"
                >
                  {adv.full_name}
                </div>
              );
            })
          )}
        </div>
      )}

      {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
  );
};
