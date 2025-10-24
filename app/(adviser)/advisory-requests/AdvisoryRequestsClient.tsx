"use client";

import { Request } from "@/types/request";
import RequestCard from "../../../components/RequestCard";
import { useAdvisoryRequests } from "@/hooks/useAdvisoryRequests";
import ConfirmationModal from "../../../components/ConfirmationModal";

export default function AdvisoryRequestsClient({
  requests,
}: {
  requests: Request[];
}) {
  const {
    expandedId,
    isPending,
    modalState,
    toggleExpand,
    openModal,
    closeModal,
    handleConfirmModal,
  } = useAdvisoryRequests();

  return (
    <main className="flex-1">
      <div className="sticky top-0 z-40 px-8 py-4 border-b bg-white border-gray-200">
        <h1 className="text-lg font-bold text-gray-900">Advisory Requests</h1>
      </div>

      {requests.length === 0 && (
        <div className="flex items-center justify-center p-8">
          <p className="text-gray-500 text-center">
            No advisory requests at the moment.
          </p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 p-8">
        {requests.map((request) => (
          <RequestCard
            key={request.id}
            request={request}
            isExpanded={expandedId === request.id}
            toggleExpand={() => toggleExpand(request.id)}
            isPending={isPending}
            handleOpenModal={openModal}
            isRequestTab={true}
          />
        ))}
      </div>

      {/* Modal */}
      <ConfirmationModal
        isOpen={modalState.open}
        type={modalState.type}
        studentName={modalState.request?.studentName || ""}
        isPending={isPending}
        onClose={closeModal}
        onConfirm={handleConfirmModal}
      />
    </main>
  );
}
