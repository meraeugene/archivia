"use client";

import { X, Download } from "lucide-react";
import { Thesis } from "@/types/thesis";
import HighlightText from "./HighlightText";

interface ThesisModalProps {
  thesis: Thesis | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (t: Thesis) => void;
  searchQuery?: string;
}

const ThesisModal: React.FC<ThesisModalProps> = ({
  thesis,
  isOpen,
  onClose,
  onDownload,
  searchQuery,
}) => {
  if (!isOpen || !thesis) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm md:px-6 "
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white/90 backdrop-blur-md 
             w-full h-full md:w-full md:max-w-5xl md:h-[80vh]
             relative shadow-lg border border-white/30
             animate-fadeInScale
             flex flex-col rounded-none md:rounded-lg overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute md:block  top-5 right-5 z-10 cursor-pointer text-gray-600 hover:text-black transition-colors"
        >
          <X size={24} />
        </button>

        <div className="md:p-12 md:pt-14 py-12 px-6 pt-14 overflow-y-auto scrollbar-none ">
          <h2 className="text-lg md:text-2xl font-bold mb-5">
            {/* Highlight Title */}
            <HighlightText text={thesis.title} query={searchQuery} />
          </h2>
          <div className="mb-4 space-y-2 text-gray-700">
            <div>
              <strong>Adviser:</strong>{" "}
              <span>
                {/* Highlight Adviser Name */}
                <HighlightText text={thesis.adviser_name} query={searchQuery} />
              </span>{" "}
            </div>
            <div>
              <strong>Panel:</strong>{" "}
              {[
                thesis.panel_member1 && `${thesis.panel_member1} (Chair)`,
                thesis.panel_member2,
                thesis.panel_member3,
              ]
                .filter(Boolean)
                .join(", ") || "N/A"}
            </div>

            <div>
              <strong>Proponents: </strong>

              {/* Highlight Proponents */}
              <HighlightText
                text={
                  Array.isArray(thesis.proponents)
                    ? thesis.proponents.join(", ")
                    : ""
                }
                query={searchQuery}
              />
            </div>

            <div>
              <strong>Year:</strong> {thesis.defense_year || "N/A"}
            </div>

            <div>
              <strong>Keywords:</strong>

              {/* Highlight Keywords */}
              <HighlightText
                text={
                  Array.isArray(thesis.keywords)
                    ? thesis.keywords.join(", ")
                    : ""
                }
                query={searchQuery}
              />
            </div>

            <div className="flex gap-2 mt-3">
              <div className="flex flex-wrap gap-2">
                {(thesis.category?.length
                  ? thesis.category
                  : ["Uncategorized"]
                ).map((cat, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-700 text-white shadow-sm text-xs md:text-sm md:font-medium rounded-full"
                  >
                    {/* Highlight Category */}
                    <HighlightText text={cat.trim()} query={searchQuery} />
                  </span>
                ))}
              </div>
            </div>
          </div>

          <h3 className="md:text-xl font-semibold md:mb-4 mb-2">Abstract</h3>
          <p className="leading-relaxed text-gray-800 mb-8">
            {/* Highlight Abstract */}
            <HighlightText text={thesis.abstract} query={searchQuery} />
          </p>

          <button
            onClick={() => {
              onDownload(thesis);
              onClose();
            }}
            className="w-full md:w-auto cursor-pointer text-white bg-black px-6 py-3 rounded font-medium hover:bg-black/90 transition-colors flex items-center justify-center md:justify-start gap-2"
          >
            <Download size={16} /> Download Full PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThesisModal;
