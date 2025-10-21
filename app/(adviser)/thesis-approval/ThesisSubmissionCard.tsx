"use client";

import { ThesisSubmission } from "@/types/thesisSubmissions";

interface ThesisSubmissionCardProps {
  thesis: ThesisSubmission;
  isExpanded: boolean;
  toggleExpand: (id: string) => void;
  isPending?: boolean;
  handleAction?: (thesis: ThesisSubmission, type: "approve" | "return") => void;
}

const ThesisSubmissionCard = ({
  thesis,
  isExpanded,
  toggleExpand,
  isPending,
  handleAction,
}: ThesisSubmissionCardProps) => {
  const handleDownload = async (thesis: ThesisSubmission) => {
    if (!thesis.file_url) return;

    try {
      const response = await fetch(thesis.file_url);
      if (!response.ok) throw new Error("Failed to fetch file");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = (thesis.title || "thesis") + ".pdf";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  return (
    <div className="bg-white h-fit  border overflow-hidden border-gray-900 border-l-4 p-6 hover:shadow-md transition-shadow shadow-sm rounded-lg">
      {/* Header */}
      <h1 className="font-medium text-gray-900 mb-4">{thesis.title}</h1>

      {/* Details */}
      <div className="space-y-2 mb-4 text-sm text-gray-600">
        <div>
          <span className="font-medium">Adviser:</span>{" "}
          {thesis.adviser_name || "-"}
        </div>
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
          {thesis.proponents.join(", ")}
        </div>
        <div>
          <span className="font-medium">Defense Year:</span>{" "}
          {thesis.defense_year || "-"}
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {thesis.category.map((cat) => (
            <span
              key={cat}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
            >
              {cat}
            </span>
          ))}
        </div>
      </div>

      {/* Abstract */}
      <div className="mb-4">
        <h4 className="font-medium text-gray-900 mb-2">Abstract</h4>
        <p
          className={`text-sm text-gray-600 text-justify transition-all duration-300 ease-in-out overflow-hidden ${
            isExpanded ? "line-clamp-none max-h-96" : "line-clamp-3 max-h-20"
          }`}
        >
          {thesis.abstract}
        </p>
        <button
          onClick={() => toggleExpand(thesis.id)}
          className="mt-2 text-xs text-gray-600 cursor-pointer hover:underline"
        >
          {isExpanded ? "Show less" : "Read more"}
        </button>
      </div>

      {/* File Actions */}
      <div className="flex items-center mb-8">
        {thesis.file_url && (
          <span
            onClick={() => handleDownload(thesis)}
            className="text-blue-500 hover:underline cursor-pointer text-sm  block"
            title="Download PDF"
          >
            {thesis.title || "thesis"}.pdf
          </span>
        )}
      </div>

      {/* Approve / Return Buttons */}
      {thesis.status === "pending" && handleAction && (
        <div className="flex space-x-3">
          <button
            disabled={isPending}
            onClick={() => handleAction(thesis, "approve")}
            className="flex-1 cursor-pointer bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors "
          >
            Approve
          </button>
          <button
            disabled={isPending}
            onClick={() => handleAction(thesis, "return")}
            className="flex-1 cursor-pointer bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors "
          >
            Return
          </button>
        </div>
      )}
    </div>
  );
};

export default ThesisSubmissionCard;
