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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/20 backdrop-blur-sm">
      <div className="bg-white/90 backdrop-blur-md rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto relative shadow-lg border border-white/30">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 cursor-pointer right-5 text-gray-600 hover:text-black transition-colors"
        >
          <X size={24} />
        </button>

        <div className="p-10 mt-4">
          <h2 className="text-2xl font-bold mb-5">{thesis.title}</h2>
          <div className="mb-8 space-y-2 text-gray-700">
            <div>
              <strong>Author:</strong> {thesis.author}
            </div>
            <div>
              <strong>University:</strong> {thesis.university}
            </div>
            <div>
              <strong>Year:</strong> {thesis.year}
            </div>
            <div>
              <strong>Pages:</strong> {thesis.pages}
            </div>
            <div>
              <strong>Keywords:</strong> {thesis.keywords.join(", ")}
            </div>
          </div>

          <h3 className="text-xl font-semibold mb-4">Abstract</h3>
          <p className="leading-relaxed text-gray-800 mb-8">
            {thesis.abstract}
          </p>

          <button
            onClick={() => {
              onDownload(thesis);
              onClose();
            }}
            className="  cursor-pointer text-white bg-black px-6 py-3 rounded font-medium hover:bg-black/90  transition-colors flex items-center gap-2"
          >
            <Download size={16} /> Download Full PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThesisModal;
