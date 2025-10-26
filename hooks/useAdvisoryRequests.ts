"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  acceptRequest,
  markAsReserved,
  referRequest,
  returnRequest,
} from "@/actions/facultyRequests";
import { Request } from "@/types/request";

export function useAdvisoryRequests() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [modalState, setModalState] = useState<{
    open: boolean;
    type: "accept" | "reserve" | "refer" | "returned";
    request: Request | null;
  }>({ open: false, type: "accept", request: null });

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const openModal = (
    request: Request,
    type: "accept" | "reserve" | "refer" | "returned"
  ) => setModalState({ open: true, type, request });

  const closeModal = () =>
    setModalState({ open: false, type: "accept", request: null });

  const handleAction = async (
    title: string,
    abstract: string,
    type: "accept" | "refer" | "reserve" | "returned",
    id: string,
    feedback: string,
    studentEmail: string,
    studentId: string,
    adviserId: string
  ) => {
    startTransition(async () => {
      let result;

      switch (type) {
        case "accept":
          result = await acceptRequest(
            id,
            studentEmail,
            studentId,
            adviserId,
            title,
            abstract,
            feedback
          );
          break;
        case "refer":
          result = await referRequest(id, studentEmail, feedback);
          break;
        case "returned":
          result = await returnRequest(
            id,
            title,
            abstract,
            studentEmail,
            feedback
          );
          break;
        case "reserve":
          result = await markAsReserved(id, studentEmail, title, abstract);
          break;
        default:
          toast.error("Invalid action type.");
          return;
      }

      if (!result?.success) {
        toast.error(result?.error || "Action failed.");
      } else {
        toast.success(result?.message);
        closeModal();
      }
    });
  };

  const handleConfirmModal = (feedback?: string) => {
    if (!modalState.request) return;

    if (modalState.type === "refer" && !feedback?.trim()) {
      toast.error("Referral note is required when referring a request.");
      return;
    }

    if (modalState.type === "returned" && !feedback?.trim()) {
      toast.error("Return note is required when returning a request.");
      return;
    }

    handleAction(
      modalState.request.title,
      modalState.request.abstract,
      modalState.type,
      modalState.request.id,
      feedback ?? "",
      modalState.request.studentEmail,
      modalState.request.studentId,
      modalState.request.adviserId
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
