"use client";

import { ThesisSubmission } from "@/types/thesisSubmissions";
import ThesisSubmissionCard from "./ThesisSubmissionCard";
import { useThesisApprovals } from "@/hooks/useThesisApprovals";
import ConfirmationModal from "@/components/ConfirmationModal";

export default function ThesisApprovalClient({
  thesisSubmissions,
}: {
  thesisSubmissions: ThesisSubmission[];
}) {
  const {
    expandedId,
    isPending,
    modalState,
    toggleExpand,
    openModal,
    closeModal,
    handleConfirmModal,
  } = useThesisApprovals();

  return (
    <main className="flex-1">
      <div className="px-8 py-4 border-b bg-white border-gray-200">
        <h1 className="text-lg font-bold text-gray-900">Thesis Approval</h1>
      </div>

      {thesisSubmissions.length === 0 ? (
        <div className="flex items-center justify-center p-8">
          <p className="text-gray-500 text-center">
            No thesis submissions at the moment.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 p-8">
          {thesisSubmissions.map((thesis) => (
            <ThesisSubmissionCard
              key={thesis.id}
              thesis={thesis}
              isExpanded={expandedId === thesis.id}
              toggleExpand={() => toggleExpand(thesis.id)}
              isPending={isPending}
              handleOpenModal={openModal}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <ConfirmationModal
        isOpen={modalState.open}
        type={modalState.type}
        studentName={modalState.thesis?.student_name || ""}
        isPending={isPending}
        onClose={closeModal}
        onConfirm={handleConfirmModal}
      />
    </main>
  );
}
