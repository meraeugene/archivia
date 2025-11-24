"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Request } from "@/types/request";
import { referRequest } from "@/actions/faculty/referRequest";
import { acceptRequest } from "@/actions/faculty/acceptRequest";
import { returnRequest } from "@/actions/faculty/returnRequest";
import { authorizeUpload } from "@/actions/faculty/authorizeUpload";
// import { markAsReserved } from "@/actions/faculty/markAsReserved";

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
    type: "accept" | "reserve" | "refer" | "returned" | "authorize";
    request: Request | null;
  }>({ open: false, type: "accept", request: null });

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const openModal = (
    request: Request,
    type: "accept" | "reserve" | "refer" | "returned" | "authorize"
  ) => {
    document.body.classList.add("modal-open");
    setModalState({ open: true, type, request });
  };

  const closeModal = () => {
    document.body.classList.remove("modal-open");
    setModalState({ open: false, type: "accept", request: null });
  };

  const handleAction = async (
    title: string,
    abstract: string,
    type: "accept" | "refer" | "reserve" | "returned" | "authorize",
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
          // result = await markAsReserved(
          //   requestId
          //   // studentEmail,
          //   // title,
          //   // abstract
          // );
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
        case "authorize":
          result = await authorizeUpload(requestId);
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

    if (modalState.type === "refer" && !selectedAdviser.id) {
      toast.error("Please select an adviser to refer to.");
      return;
    }

    handleAction(
      modalState.request.title,
      modalState.request.abstract,
      modalState.type,
      modalState.request.id,
      feedback ?? "",
      modalState.request.student_email,
      modalState.request.student_id,
      modalState.request.adviser_id,
      modalState.request.student_name
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
