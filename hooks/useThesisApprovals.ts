"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { approveThesis, returnThesis } from "@/actions/thesisApproval";
import { ThesisSubmission } from "@/types/thesisSubmissions";

export function useThesisApprovals() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [modalState, setModalState] = useState<{
    open: boolean;
    type: "approve" | "return";
    thesis: ThesisSubmission | null;
  }>({ open: false, type: "approve", thesis: null });

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const openModal = (thesis: ThesisSubmission, type: "approve" | "return") =>
    setModalState({ open: true, type, thesis });

  const closeModal = () =>
    setModalState({ open: false, type: "approve", thesis: null });

  const handleAction = (
    type: "approve" | "return",
    id: string,
    feedback: string,
    studentEmail: string
  ) => {
    startTransition(async () => {
      const action = type === "approve" ? approveThesis : returnThesis;
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
    if (!modalState.thesis) return;
    if (modalState.type === "return" && !feedback?.trim()) {
      toast.error("Feedback is required when returning a thesis.");
      return;
    }
    handleAction(
      modalState.type,
      modalState.thesis.id,
      feedback ?? "",
      modalState.thesis.student_email ?? ""
    );
  };

  return {
    expandedId,
    isPending,
    modalState,
    toggleExpand,
    openModal,
    closeModal,
    handleConfirmModal,
  };
}
