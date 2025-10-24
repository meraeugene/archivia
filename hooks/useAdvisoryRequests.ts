"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { acceptRequest, rejectRequest } from "@/actions/facultyRequests";
import { Request } from "@/types/request";

export function useAdvisoryRequests() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [modalState, setModalState] = useState<{
    open: boolean;
    type: "accept" | "reject";
    request: Request | null;
  }>({ open: false, type: "accept", request: null });

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const openModal = (request: Request, type: "accept" | "reject") =>
    setModalState({ open: true, type, request });

  const closeModal = () =>
    setModalState({ open: false, type: "accept", request: null });

  const handleAction = (
    type: "accept" | "reject",
    id: string,
    feedback: string,
    studentEmail: string
  ) => {
    startTransition(async () => {
      const action = type === "accept" ? acceptRequest : rejectRequest;
      const result = await action(id, studentEmail, feedback);

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
    handleAction(
      modalState.type,
      modalState.request.id,
      feedback ?? "",
      modalState.request.studentEmail
    );
  };

  return {
    // state
    expandedId,
    isPending,
    modalState,

    // handlers
    toggleExpand,
    openModal,
    closeModal,
    handleConfirmModal,
  };
}
