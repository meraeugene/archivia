"use client";

import RequestCard from "./RequestCard";
import { Request } from "@/types/request";
import { useAdvisoryRequests } from "@/hooks/useAdvisoryRequests";
import ConfirmationModal from "./ConfirmationModal";
import { ReferredAdviser } from "@/types/referredAdvisers";

interface RequestsListProps {
  adviserRequests: Request[];
  referredAdvisers?: ReferredAdviser[];
}
const RequestsList = ({
  adviserRequests,
  referredAdvisers,
}: RequestsListProps) => {
  const {
    expandedId,
    isPending,
    toggleExpand,
    openModal,
    modalState,
    closeModal,
    handleConfirmModal,
  } = useAdvisoryRequests();

  return (
    <div>
      <div className="grid gap-6 md:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3">
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
        studentName={modalState.request?.student_name || ""}
        isPending={isPending}
        onClose={closeModal}
        onConfirm={handleConfirmModal}
        recommendedAdviserIds={
          modalState.request?.recommended_adviser_ids || []
        }
        referredAdvisers={referredAdvisers || []}
      />
    </div>
  );
};

export default RequestsList;
