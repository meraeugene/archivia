"use client";

import { Download, Eye, Bookmark } from "lucide-react";
import { Thesis } from "@/types/thesis";
import { useBookmark } from "@/hooks/useBookmark";
import { useState } from "react";

interface ThesisCardProps {
  thesis: Thesis;
  onPreview: (t: Thesis) => void;
  onDownload: (t: Thesis) => void;
  isInitiallyBookmarked?: boolean;
}

const ThesisCard: React.FC<ThesisCardProps> = ({
  thesis,
  onPreview,
  onDownload,
  isInitiallyBookmarked = false,
}) => {
  const { isBookmarked, handleToggle, isPending } = useBookmark(
    thesis.id!,
    isInitiallyBookmarked
  );

  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setIsAnimating(true);

    handleToggle();

    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-all duration-300 h-fit ">
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="text-lg font-bold leading-tight ">{thesis.title}</h3>
        <button
          onClick={handleClick}
          disabled={isPending || thesis.id === undefined}
          className=" text-gray-500 cursor-pointer hover:text-black transition-colors"
        >
          <Bookmark
            size={20}
            className={`
    ${
      isBookmarked
        ? "fill-black text-black "
        : "text-gray-500 hover:fill-black hover:text-black"
    }
    transition-transform duration-300  
    ${isAnimating ? "scale-125 rotate-12" : "scale-100 rotate-0"}
  `}
          />
        </button>
      </div>

      <div className="space-y-1 mb-4 text-sm text-gray-600">
        <div>
          <strong>Adviser:</strong> {thesis.adviser_name || "N/A"}
        </div>

        <div className="flex  gap-2">
          <strong>Panel:</strong>
          <div className="flex flex-wrap gap-2">
            {[
              thesis.panel_member1 && `${thesis.panel_member1} (Chair)`,
              thesis.panel_member2,
              thesis.panel_member3,
            ]
              .filter(Boolean)
              .join(", ") || "N/A"}
          </div>
        </div>

        <div>
          <strong>Proponents:</strong>{" "}
          {Array.isArray(thesis.proponents) && thesis.proponents.length > 0
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
            {(thesis.category?.slice(0, 2) ?? ["Uncategorized"]).map(
              (cat, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-700 text-white shadow-sm text-xs font-medium rounded-full"
                >
                  {cat.trim()}
                </span>
              )
            )}

            {thesis.category && thesis.category.length > 2 && (
              <span
                onClick={() => onPreview(thesis)}
                className="px-2 py-1 bg-gray-200 text-gray-700 text-xs font-medium rounded-full cursor-pointer hover:bg-gray-300 transition"
              >
                +{thesis.category.length - 2} more
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
          className="flex-1 bg-gray-50 border cursor-pointer border-gray-200 text-black px-4 py-2.5 rounded font-medium  hover:shadow-md transition-colors flex items-center justify-center gap-2"
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
};

export default ThesisCard;
