"use client";
import React from "react";
import { Download, Eye, Bookmark } from "lucide-react";
import { Thesis } from "@/types/thesis";

interface ThesisCardProps {
  thesis: Thesis;
  onPreview: (t: Thesis) => void;
  onDownload: (t: Thesis) => void;
}

const ThesisCard: React.FC<ThesisCardProps> = ({
  thesis,
  onPreview,
  onDownload,
}) => (
  <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-300 h-fit ">
    <div className="flex items-start justify-between mb-3">
      <h3 className="text-lg font-bold leading-tight ">{thesis.title}</h3>
      <button className="ml-3 text-gray-500 cursor-pointer hover:text-black transition-colors">
        <Bookmark
          size={20}
          // className={isBookmarked ? "fill-black text-black" : ""}
        />
      </button>
    </div>

    <div className="space-y-1 mb-4 text-sm text-gray-600">
      <div>
        <strong>Adviser:</strong> {thesis.adviser_name || "N/A"}
      </div>

      <div className="flex items-center gap-2">
        <strong>Panel:</strong>
        <div className="flex flex-wrap gap-2 ">
          {[
            thesis.panel_chair_name && `${thesis.panel_chair_name} (Chair)`,
            ...(thesis.panel_members || []),
          ]
            .filter(Boolean)
            .join(", ") || "N/A"}{" "}
        </div>
      </div>

      <div>
        <strong>Proponents:</strong>{" "}
        {Array.isArray(thesis.proponents)
          ? thesis.proponents.join(", ")
          : "N/A"}
      </div>

      <div>
        <strong>Year:</strong> {thesis.defense_year || "N/A"}
      </div>

      {/* <div>
        <strong>Keywords:</strong>{" "}
        {Array.isArray(thesis.keywords) ? thesis.keywords.join(", ") : "N/A"}
      </div> */}

      <div className="flex gap-2 mt-3">
        <div className="flex flex-wrap gap-2">
          {(thesis.category?.split(",").slice(0, 2) || ["Uncategorized"]).map(
            (cat, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-700 text-white shadow-sm text-xs font-medium rounded-full"
              >
                {cat.trim()}
              </span>
            )
          )}

          {thesis.category?.split(",").length > 2 && (
            <span
              onClick={() => onPreview(thesis)}
              className="px-2 py-1 bg-gray-200 text-gray-700 text-xs font-medium rounded-full cursor-pointer hover:bg-gray-300 transition"
            >
              +{thesis.category.split(",").length - 2} more
            </span>
          )}
        </div>
      </div>
    </div>

    <p className="text-sm text-gray-700 mb-5 leading-relaxed line-clamp-4 mt-5">
      {thesis.abstract}
    </p>

    <div className="flex gap-3 mt-6">
      <button
        onClick={() => onPreview(thesis)}
        className="flex-1 bg-gray-50 border cursor-pointer border-gray-200 text-black px-4 py-2.5 rounded font-medium hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
      >
        <Eye size={16} /> Preview
      </button>
      <button
        onClick={() => onDownload(thesis)}
        className="flex-1 text-white bg-black hover:bg-black/90 cursor-pointer px-4 py-2.5 rounded font-medium transition-colors flex items-center justify-center gap-2"
      >
        <Download size={16} /> Download
      </button>
    </div>
  </div>
);

export default ThesisCard;
