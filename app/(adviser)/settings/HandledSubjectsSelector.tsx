"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface HandledSubjectsSelectorProps {
  value: string; // CSV string
  handleChange: (name: "handled_subjects", value: string) => void;
  error?: string;
}

export function HandledSubjectsSelector({
  value,
  handleChange,
  error,
}: HandledSubjectsSelectorProps) {
  const subjects = value ? value.split(",").map((v) => v.trim()) : [];
  const [inputValue, setInputValue] = useState("");

  const addSubject = (subject: string) => {
    if (!subjects.includes(subject)) {
      handleChange("handled_subjects", [...subjects, subject].join(", "));
      setInputValue("");
    }
  };

  const removeSubject = (subject: string) => {
    handleChange(
      "handled_subjects",
      subjects.filter((s) => s !== subject).join(", ")
    );
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
        Handled Subjects
      </label>

      <div className="flex flex-wrap gap-1 border border-gray-300 p-2 rounded min-h-[44px]">
        {subjects.length ? (
          subjects.map((subject) => (
            <span
              key={subject}
              className="flex items-center gap-2 bg-gray-700 text-white px-2 py-1 rounded-full text-xs"
            >
              {subject}
              <button
                type="button"
                onClick={() => removeSubject(subject)}
                className="ml-1 cursor-pointer text-white/80 hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))
        ) : (
          <span className="text-gray-400 text-sm">No subjects added</span>
        )}
      </div>

      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && inputValue.trim() !== "") {
            e.preventDefault();
            addSubject(inputValue.trim());
          }
        }}
        placeholder="Type a subject and press Enter"
        className={error ? "border-red-500" : "rounded"}
      />

      {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
  );
}
