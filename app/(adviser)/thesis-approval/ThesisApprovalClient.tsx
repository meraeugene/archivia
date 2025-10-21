"use client";

import { handleThesisApproval } from "@/actions/thesisApproval";
import { ThesisSubmission } from "@/types/thesisSubmissions";
import { useState } from "react";
import ThesisSubmissionCard from "./ThesisSubmissionCard";

interface ThesisApprovalClientProps {
  thesisSubmissions: ThesisSubmission[];
}

const ThesisApprovalClient = ({
  thesisSubmissions,
}: ThesisApprovalClientProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleAction = async (
    thesis: ThesisSubmission,
    type: "approve" | "return"
  ) => {
    setIsPending(true);

    const result = await handleThesisApproval(
      thesis.id,
      type,
      type === "return" ? "Returned by adviser" : undefined
    );

    if (result.error) {
      alert(`Error: ${result.error}`);
    }

    setIsPending(false);
  };

  return (
    <main className="flex-1">
      <div className="px-8 py-4 border-b bg-white border-gray-200">
        <h1 className="text-lg font-bold text-gray-900">Thesis Approval</h1>
      </div>

      {thesisSubmissions.length === 0 && (
        <div className="flex items-center justify-center p-8">
          <p className="text-gray-500 text-center">
            No thesis submissions at the moment.
          </p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 p-8">
        {thesisSubmissions.map((thesis) => (
          <ThesisSubmissionCard
            key={thesis.id}
            thesis={thesis}
            isExpanded={expandedId === thesis.id}
            toggleExpand={toggleExpand}
            isPending={isPending}
            handleAction={handleAction}
          />
        ))}
      </div>

      {/* <Modal
        isOpen={modalState.open}
        type={modalState.type}
        studentName={modalState.request?.studentName || ""}
        isPending={isPending}
        onClose={closeModal}
        onConfirm={handleConfirmModal}
      /> */}
    </main>
  );
};

export default ThesisApprovalClient;
