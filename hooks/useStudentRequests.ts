"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { StudentRequest } from "@/types/studentRequests";
import isValidUrl from "@/utils/isValidUrl";
import { cancelRequest } from "@/actions/student/cancelRequest";
import { sendRequest } from "@/actions/student/sendRequest";

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

  const handleResendConfirm = (data: {
    title: string;
    abstract: string;
    url: string;
  }) => {
    if (!selectedRequest) return;

    if (!data.title.trim()) {
      toast.error("Thesis title cannot be empty.");
      return;
    }

    if (!data.abstract.trim()) {
      toast.error("Thesis abstract cannot be empty.");
      return;
    }

    if (!data.url.trim()) {
      toast.error("Thesis URL cannot be empty.");
      return;
    }

    if (!isValidUrl(data.url.trim())) {
      toast.error("Please enter a valid link.");
      return;
    }

    startTransition(async () => {
      const res = await sendRequest(
        selectedRequest.adviser_id,
        data.title,
        data.abstract,
        selectedRequest.adviser_email,
        data.url
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
