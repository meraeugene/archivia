"use client";

import { HandledThesis } from "@/types/handledThesis";
import { useState } from "react";
import HandledThesisModal from "./HandledThesisModal";
import DashboardMobileHeader from "@/components/DashboardMobileHeader";

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
      <DashboardMobileHeader headerTitle="Handled Theses" />

      <div className="sticky shadow-xs top-0 z-40 px-8 py-4  bg-white hidden lg:block ">
        <h1 className="text-lg font-bold text-gray-900">Handled Theses</h1>
      </div>

      {handledTheses.length === 0 ? (
        <div className="flex items-center justify-center md:p-8 px-4 py-6">
          <p className="text-gray-500 text-center">
            You currently have no handled theses.
          </p>
        </div>
      ) : (
        <div className="columns-1 xl:columns-2 gap-6 md:p-8 px-4 py-6  space-y-6">
          {handledTheses.map((thesis) => (
            <div
              key={thesis.thesis_id}
              className="bg-white break-inside-avoid border shadow-lg hover:shadow-xl  p-6  transition-shadow rounded-lg cursor-pointer"
              onClick={() => openModal(thesis)}
              title="Click to preview"
            >
              <h1 className="md:text-lg font-extrabold leading-tight  uppercase text-gray-900 mb-4">
                {thesis.title}
              </h1>

              <div className="space-y-2 mb-4  text-gray-600">
                <div>
                  <span className="font-medium">Panel Chair:</span>{" "}
                  {thesis.panel_member1 || "-"}
                </div>
                <div>
                  <span className="font-medium">Panel Members:</span>{" "}
                  {[thesis.panel_member2, thesis.panel_member3]
                    .filter(Boolean)
                    .join(", ") || "-"}
                </div>
                <div>
                  <span className="font-medium">Proponents:</span>{" "}
                  {thesis.proponents?.join(", ") || "N/A"}
                </div>
                <div>
                  <span className="font-medium">Defense Year:</span>{" "}
                  {thesis.defense_year || "N/A"}
                </div>

                {thesis.category?.length ? (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {thesis.category.map((cat, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-700 text-white shadow-sm text-xs font-medium rounded-full"
                      >
                        {cat.trim()}
                      </span>
                    ))}
                  </div>
                ) : null}

                {thesis.abstract && (
                  <p className="mt-3 text-gray-700 text-sm md:text-base  line-clamp-5">
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
