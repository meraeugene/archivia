"use client";

import React from "react";
import { X, Download } from "lucide-react";
import { HandledThesis } from "@/types/handledThesis";

interface HandledThesisModalProps {
  thesis: HandledThesis | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (t: HandledThesis) => void;
}

const HandledThesisModal: React.FC<HandledThesisModalProps> = ({
  thesis,
  isOpen,
  onClose,
  onDownload,
}) => {
  if (!isOpen || !thesis) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/20 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white/90 backdrop-blur-md rounded-lg max-w-5xl w-full max-h-[80vh] overflow-y-auto relative shadow-lg border border-white/30"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute cursor-pointer top-5 right-5 text-gray-600 hover:text-black transition-colors"
        >
          <X size={24} />
        </button>

        <div className="p-10 mt-4">
          <h2 className="text-2xl font-bold mb-5">{thesis.title}</h2>

          <div className="mb-4 space-y-2 text-gray-700">
            <div>
              <strong>Adviser:</strong> {thesis.adviser_full_name || "N/A"}
            </div>

            <div>
              <strong>Panel Chair:</strong> {thesis.panel_chair_name || "N/A"}
            </div>

            <div>
              <strong>Panel Members:</strong>{" "}
              {thesis.panel_members?.join(", ") || "N/A"}
            </div>

            <div>
              <strong>Proponents:</strong>{" "}
              {thesis.proponents?.join(", ") || "N/A"}
            </div>

            <div>
              <strong>Year:</strong> {thesis.defense_year || "N/A"}
            </div>

            <div>
              <strong>Keywords:</strong> {thesis.keywords?.join(", ") || "N/A"}
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              {(thesis.category?.length
                ? thesis.category
                : ["Uncategorized"]
              ).map((cat, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-700 text-white shadow-sm text-sm font-medium rounded-full"
                >
                  {cat.trim()}
                </span>
              ))}
            </div>
          </div>

          <h3 className="text-xl font-semibold mb-4">Abstract</h3>
          <p className="leading-relaxed text-gray-800 mb-8">
            {thesis.abstract || "No abstract available."}
          </p>

          {thesis.file_url && (
            <button
              onClick={() => {
                onDownload(thesis);
                onClose();
              }}
              className="cursor-pointer text-white bg-black px-6 py-3 rounded font-medium hover:bg-black/90 transition-colors flex items-center gap-2"
            >
              <Download size={16} /> Download Full PDF
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HandledThesisModal;
