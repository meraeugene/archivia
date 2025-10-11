"use client";

import { useState, useTransition } from "react";
import { acceptRequest, rejectRequest } from "@/actions/facultyRequests";
import { toast } from "sonner";
import Modal from "./Modal";
import { Request } from "@/types/request";
import RequestCard from "../../../components/RequestCard";

export default function AdvisoryRequestsClient({
  requests,
}: {
  requests: Request[];
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [modalState, setModalState] = useState<{
    open: boolean;
    type: "accept" | "reject";
    request: Request | null;
  }>({ open: false, type: "accept", request: null });

  const openModal = (request: Request, type: "accept" | "reject") =>
    setModalState({ open: true, type, request });

  const closeModal = () =>
    setModalState({ open: false, type: "accept", request: null });

  const handleAction = (
    type: "accept" | "reject",
    id: string,
    feedback: string
  ) => {
    startTransition(async () => {
      const action = type === "accept" ? acceptRequest : rejectRequest;
      const result = await action(id, feedback);

      if (!result.success) {
        toast.error(result.error);
      } else {
        toast.success(result.message);
        closeModal();
      }
    });
  };

  const handleConfirmModal = (feedback?: string) => {
    if (!modalState.request) return;
    if (modalState.type === "reject" && !feedback?.trim()) {
      toast.error("Feedback is required when rejecting a request.");
      return;
    }
    handleAction(modalState.type, modalState.request.id, feedback ?? "");
  };

  return (
    <main className="flex-1">
      <div className="px-8 py-4 border-b bg-white border-gray-200">
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
            toggleExpand={() =>
              setExpandedId(expandedId === request.id ? null : request.id)
            }
            isPending={isPending}
            handleOpenModal={openModal}
            isRequestTab={true}
          />
        ))}
      </div>

      {/* Modal */}
      <Modal
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
