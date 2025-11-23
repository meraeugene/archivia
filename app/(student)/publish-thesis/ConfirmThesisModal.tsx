"use client";

import { Thesis } from "@/types/thesis";
import { highlightText } from "@/utils/highlightText";

interface ConfirmThesisModalProps {
  thesis: Thesis;
  isOpen: boolean;
  onBack: () => void;
  onConfirm: () => void;
  searchQuery?: string;
  isPending: boolean;
}

const ConfirmThesisModal: React.FC<ConfirmThesisModalProps> = ({
  thesis,
  isOpen,
  onBack,
  onConfirm,
  searchQuery = "",
  isPending,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed  inset-0 z-50 flex items-start md:items-center justify-center overflow-auto bg-black/30 backdrop-blur-sm  scrollbar-none md:p-8">
      <div className="bg-white md:h-[95vh] overflow-auto  w-full   max-w-4xl h-full shadow-2xl border border-gray-200 rounded-lg flex flex-col">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-white p-4 md:p-6 border-b border-gray-200 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-black">
            Preview Thesis
          </h3>
          <p className="text-gray-500 text-sm mt-1">
            Review your thesis details before publishing
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto scrollbar-none flex-1 p-4 md:p-6 ">
          {/* Title */}
          <h3
            className="text-lg font-extrabold leading-tight text-gray-900 uppercase mb-3"
            dangerouslySetInnerHTML={{
              __html: highlightText(thesis.title, searchQuery),
            }}
          />

          {/* Adviser */}
          <div className="text-gray-700">
            <strong>Adviser:</strong>{" "}
            <span
              dangerouslySetInnerHTML={{
                __html: highlightText(thesis.adviser_name, searchQuery),
              }}
            />
          </div>

          {/* Panel */}
          <div className="text-gray-700">
            <strong>Panel:</strong>{" "}
            {[
              thesis.panel_member1 && `${thesis.panel_member1} (Chair)`,
              thesis.panel_member2,
              thesis.panel_member3,
            ]
              .filter(Boolean)
              .join(", ") || "N/A"}
          </div>

          {/* Proponents */}
          <div className="text-gray-700">
            <strong>Proponents:</strong>{" "}
            {Array.isArray(thesis.proponents) && thesis.proponents.length > 0
              ? thesis.proponents.join(", ")
              : "N/A"}
          </div>

          {/* Year */}
          <div className="text-gray-700">
            <strong>Year:</strong> {thesis.defense_year || "N/A"}
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mt-4">
            {thesis.category?.length
              ? thesis.category.map((cat, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-gray-700 text-white shadow-sm text-sm md:font-medium rounded-full"
                  >
                    {cat.trim()}
                  </span>
                ))
              : null}
          </div>

          {/* Abstract */}
          <p className="text-gray-700 mt-4 leading-relaxed whitespace-pre-wrap">
            {thesis.abstract || "N/A"}
          </p>

          {/* Footer Buttons */}
          <div className="flex  gap-4 mt-8  ">
            <button
              onClick={onBack}
              className="flex-1 px-4 py-3 rounded-md border border-gray-200 bg-white text-gray-700 cursor-pointer font-medium transition-all hover:bg-gray-100"
            >
              Back
            </button>
            <button
              onClick={onConfirm}
              className={` flex-1  px-5 py-3 rounded-md bg-black text-white font-semibold hover:bg-black/90 transition-all flex items-center justify-center gap-2 ${
                isPending ? "opacity-70 cursor-not-allowed" : "cursor-pointer"
              }`}
              disabled={isPending}
            >
              {isPending ? "Publishing..." : "Publish"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmThesisModal;
