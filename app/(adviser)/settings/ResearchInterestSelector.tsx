"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RESEARCH_INTEREST_OPTIONS } from "@/data/researchInterests";
import { X } from "lucide-react";
import { useState } from "react";

interface ResearchInterestSelectorProps {
  value: string;
  handleChange: (name: "research_interest", value: string) => void;
  error?: string;
}

export function ResearchInterestSelector({
  value,
  handleChange,
  error,
}: ResearchInterestSelectorProps) {
  const interests = value ? value.split(",").map((v) => v.trim()) : [];
  const [selectValue, setSelectValue] = useState("");

  const addInterest = (item: string) => {
    if (!interests.includes(item)) {
      handleChange("research_interest", [...interests, item].join(", "));
    }
  };

  const removeInterest = (item: string) => {
    handleChange(
      "research_interest",
      interests.filter((i) => i !== item).join(", ")
    );
  };

  const availableOptions = RESEARCH_INTEREST_OPTIONS.filter(
    (opt) => !interests.includes(opt)
  );

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
        Research Interest
      </label>

      <div className="flex flex-wrap gap-1 border border-gray-300 p-2 rounded min-h-[44px]">
        {interests.length ? (
          interests.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-2 bg-gray-700 text-white px-2 py-1 rounded-full text-xs"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeInterest(tag)}
                className="ml-1 cursor-pointer text-white/80 hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))
        ) : (
          <span className="text-gray-400 text-sm">
            No research interests selected
          </span>
        )}
      </div>

      <Select
        value={selectValue} // control the value
        onValueChange={(val) => {
          if (val) addInterest(val);
          setSelectValue(""); // reset after selection
        }}
      >
        <SelectTrigger
          className={`w-full hover:shadow-sm rounded cursor-pointer ${
            error ? "border-red-500" : ""
          }`}
        >
          <SelectValue placeholder="Select a research interest" />
        </SelectTrigger>
        <SelectContent>
          {availableOptions.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
  );
}
