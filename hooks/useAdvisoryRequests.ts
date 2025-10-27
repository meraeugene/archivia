"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  acceptRequest,
  markAsReserved,
  returnRequest,
} from "@/actions/facultyRequests";
import { Request } from "@/types/request";
import { referRequest } from "@/actions/referAdviser";

export function useAdvisoryRequests() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [selectedAdviser, setSelectedAdviser] = useState<{
    id: string;
    email: string;
    full_name: string;
  }>({ id: "", email: "", full_name: "" });

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
    requestId: string,
    feedback: string,
    studentEmail: string,
    studentId: string,
    adviserId: string,
    studentName: string
  ) => {
    startTransition(async () => {
      let result;

      switch (type) {
        case "accept":
          result = await acceptRequest(
            requestId,
            studentEmail,
            studentId,
            adviserId,
            title,
            abstract,
            feedback
          );
          break;
        case "refer":
          result = await referRequest(
            requestId,
            studentEmail,
            selectedAdviser.id,
            selectedAdviser.email,
            selectedAdviser.full_name,
            adviserId,
            studentName,
            title,
            abstract,
            feedback
          );
          break;
        case "returned":
          result = await returnRequest(
            requestId,
            title,
            abstract,
            studentEmail,
            feedback
          );
          break;
        case "reserve":
          result = await markAsReserved(
            requestId,
            studentEmail,
            title,
            abstract
          );
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

    if (modalState.type === "returned" && !feedback?.trim()) {
      toast.error("Return note is required.");
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
      modalState.request.adviserId,
      modalState.request.studentName
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

    // selected adviser
    selectedAdviser,
    setSelectedAdviser,
  };
}
