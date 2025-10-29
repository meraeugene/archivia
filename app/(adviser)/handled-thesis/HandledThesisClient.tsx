"use client";

import { HandledThesis } from "@/types/handledThesis";
import { useState } from "react";
import HandledThesisModal from "./HandledThesisModal";

export default function HandledThesisClient({
  handledTheses,
}: {
  handledTheses: HandledThesis[];
}) {
  const [selectedThesis, setSelectedThesis] = useState<HandledThesis | null>(
    null
  );
  const [isOpen, setIsOpen] = useState(false);

  const handleDownload = async (thesis: HandledThesis) => {
    if (!thesis.file_url) return;
    try {
      const response = await fetch(thesis.file_url);
      if (!response.ok) throw new Error("Failed to fetch file");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${thesis.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const openModal = (thesis: HandledThesis) => {
    setSelectedThesis(thesis);
    setIsOpen(true);
    document.body.classList.add("modal-open");
  };

  const closeModal = () => {
    setSelectedThesis(null);
    setIsOpen(false);
    document.body.classList.remove("modal-open");
  };

  return (
    <main className="flex-1">
      <div className="sticky top-0 z-40 px-8 py-4 border-b bg-white border-gray-200">
        <h1 className="text-lg font-bold text-gray-900">Handled Theses</h1>
      </div>

      {handledTheses.length === 0 ? (
        <div className="flex items-center justify-center p-8">
          <p className="text-gray-500 text-center">
            You currently have no handled theses.
          </p>
        </div>
      ) : (
        <div className="columns-1 md:columns-2 gap-6 p-8 space-y-6">
          {handledTheses.map((thesis) => (
            <div
              key={thesis.thesis_id}
              className="bg-white break-inside-avoid border  p-6 hover:shadow-sm transition-shadow rounded-lg cursor-pointer"
              onClick={() => openModal(thesis)}
              title="Click to preview"
            >
              <h1 className="font-medium text-gray-900 mb-4">{thesis.title}</h1>

              <div className="space-y-2 mb-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Panel Chair:</span>{" "}
                  {thesis.panel_chair_name || "-"}
                </div>
                <div>
                  <span className="font-medium">Panel Members:</span>{" "}
                  {thesis.panel_members?.join(", ") || "-"}
                </div>
                <div>
                  <span className="font-medium">Proponents:</span>{" "}
                  {thesis.proponents?.join(", ") || "N/A"}
                </div>
                <div>
                  <span className="font-medium">Defense Year:</span>{" "}
                  {thesis.defense_year || "N/A"}
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  {(thesis.category?.length
                    ? thesis.category
                    : ["Uncategorized"]
                  ).map((cat, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-700 text-white shadow-sm text-xs font-medium rounded-full"
                    >
                      {cat.trim()}
                    </span>
                  ))}
                </div>

                {thesis.abstract && (
                  <p className="mt-3 text-gray-700 text-sm line-clamp-3">
                    {thesis.abstract}
                  </p>
                )}
              </div>

              {thesis.file_url && (
                <div className="flex flex-col">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Thesis File
                  </h4>
                  <span className="text-blue-500 hover:underline cursor-pointer text-sm">
                    {thesis.title}.pdf
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <HandledThesisModal
        thesis={selectedThesis}
        isOpen={isOpen}
        onClose={closeModal}
        onDownload={handleDownload}
      />
    </main>
  );
}
