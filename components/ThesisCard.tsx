"use client";
import React from "react";
import { Download, Eye, Bookmark } from "lucide-react";
import { Thesis } from "@/types/thesis";

interface ThesisCardProps {
  thesis: Thesis;
  onPreview: (t: Thesis) => void;
  onDownload: (t: Thesis) => void;
  onBookmark: (t: Thesis) => void;
  isBookmarked: boolean;
}

const ThesisCard: React.FC<ThesisCardProps> = ({
  thesis,
  onPreview,
  onDownload,
  onBookmark,
  isBookmarked,
}) => (
  <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-300">
    <div className="flex items-start justify-between mb-3">
      <h3 className="text-lg font-bold leading-tight">{thesis.title}</h3>
      <button
        onClick={() => onBookmark(thesis)}
        className="ml-3 text-gray-500 cursor-pointer hover:text-black transition-colors"
      >
        <Bookmark
          size={20}
          className={isBookmarked ? "fill-black text-black" : ""}
        />
      </button>
    </div>

    <div className="space-y-1 mb-4 text-sm text-gray-600">
      <div>
        <strong>Author:</strong> {thesis.author}
      </div>
      <div>
        <strong>University:</strong> {thesis.university}
      </div>
      <div>
        <strong>Year:</strong> {thesis.year} • {thesis.pages} pages
      </div>
    </div>

    <p className="text-sm text-gray-700 mb-5 leading-relaxed line-clamp-4">
      {thesis.abstract}
    </p>

    <div className="flex gap-3">
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
