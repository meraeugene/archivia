"use client";

import RequestCard from "./RequestCard";
import { Request } from "@/types/request";
import { useAdvisoryRequests } from "@/hooks/useAdvisoryRequests";
import ConfirmationModal from "./ConfirmationModal";

interface RequestsListProps {
  adviserRequests: Request[];
}
const RequestsList = ({ adviserRequests }: RequestsListProps) => {
  const {
    expandedId,
    isPending,
    toggleExpand,
    openModal,
    modalState,
    closeModal,
    handleConfirmModal,
  } = useAdvisoryRequests();

  console.log(adviserRequests);
  return (
    <div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        {adviserRequests.map((request) => (
          <RequestCard
            key={request.id}
            request={request}
            isExpanded={expandedId === request.id}
            toggleExpand={() => toggleExpand(request.id)}
            isPending={isPending}
            handleOpenModal={openModal}
          />
        ))}
      </div>

      <ConfirmationModal
        isOpen={modalState.open}
        type={modalState.type}
        studentName={modalState.request?.studentName || ""}
        isPending={isPending}
        onClose={closeModal}
        onConfirm={handleConfirmModal}
      />
    </div>
  );
};

export default RequestsList;
