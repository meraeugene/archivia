"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { cancelRequest, sendRequest } from "@/actions/studentRequests";
import { StudentRequest } from "@/types/studentRequests";

export function useStudentRequests() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition(); // for resend action

  const [showResendModal, setShowResendModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<StudentRequest | null>(
    null
  );

  const toggleExpand = (id: string) => {
    setExpanded(expanded === id ? null : id);
  };

  const handleCancel = async (id: string) => {
    setCancelling(id);

    const result = await cancelRequest(id);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Request cancelled successfully");
    }

    setCancelling(null);
  };

  const handleOpenResendModal = (request: StudentRequest) => {
    setSelectedRequest(request);
    setShowResendModal(true);
    document.body.classList.add("modal-open");
  };

  const handleCloseResendModal = () => {
    setShowResendModal(false);
    document.body.classList.remove("modal-open");
  };

  const handleResendConfirm = (data: { title: string; abstract: string }) => {
    if (!selectedRequest) return;
    setShowResendModal(false);

    startTransition(async () => {
      const res = await sendRequest(
        selectedRequest.adviser_id,
        data.title,
        data.abstract
      );

      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Request resent successfully!");
        handleCloseResendModal();
      }
    });
  };

  return {
    cancelling,
    expanded,
    isPending,
    handleOpenResendModal,
    toggleExpand,
    showResendModal,
    handleCancel,
    handleResendConfirm,
    handleCloseResendModal,
    selectedRequest,
  };
}
