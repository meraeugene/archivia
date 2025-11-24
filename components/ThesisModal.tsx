"use client";

import React from "react";
import { X, Download } from "lucide-react";
import { Thesis } from "@/types/thesis";

interface ThesisModalProps {
  thesis: Thesis | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (t: Thesis) => void;
}

const ThesisModal: React.FC<ThesisModalProps> = ({
  thesis,
  isOpen,
  onClose,
  onDownload,
}) => {
  if (!isOpen || !thesis) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm md:px-6 "
    >
      <button
        onClick={onClose}
        className="fixed  top-5 right-5 z-5 md:hidden cursor-pointer text-gray-600 hover:text-black transition-colors"
      >
        <X size={24} />
      </button>

      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white/90 backdrop-blur-md 
             w-full h-full md:w-full md:max-w-5xl md:max-h-[80vh]
             overflow-y-auto scrollbar-none
             relative shadow-lg border border-white/30
             animate-fadeInScale
             flex flex-col rounded-none md:rounded-lg"
      >
        <button
          onClick={onClose}
          className="fixed hidden md:block  top-5 right-5 z-50 cursor-pointer text-gray-600 hover:text-black transition-colors"
        >
          <X size={24} />
        </button>

        <div className="md:p-10 py-10 px-6 mt-4">
          <h2 className="text-lg md:text-2xl font-bold mb-5">{thesis.title}</h2>
          <div className="mb-4 space-y-2 text-gray-700">
            <div>
              <strong>Adviser:</strong> <span>{thesis.adviser_name}</span>{" "}
            </div>
            <div className="flex gap-2">
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
              {thesis.proponents.join(", ") || "N/A"}
            </div>

            <div>
              <strong>Year:</strong> {thesis.defense_year || "N/A"}
            </div>

            <div>
              <strong>Keywords:</strong>{" "}
              {Array.isArray(thesis.keywords) && thesis.keywords.length > 0
                ? thesis.keywords.join(", ")
                : "N/A"}
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
                    {cat.trim()}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <h3 className="md:text-xl font-semibold md:mb-4 mb-2">Abstract</h3>
          <p className="leading-relaxed text-gray-800 mb-8">
            {thesis.abstract}
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
