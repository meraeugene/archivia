"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useAdviserStore } from "@/store/adviserStore";
import { getRecommendedAdvisers } from "@/actions/student/getRecommendedAdvisers";
import { isValidText } from "@/utils/isValidText";
import { Adviser } from "@/types/advisers";
import { sendRequest } from "@/actions/student/sendRequest";

export function useFindAdviser() {
  const { studentData, setStudentData } = useAdviserStore();
  const [recommendations, setRecommendations] = useState<Adviser[]>([]);

  const [wildcardAdvisers, setWildcardAdvisers] = useState<Adviser[]>([]);
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedAdviser, setSelectedAdviser] = useState<Adviser | null>(null);
  const [recommendedIds, setRecommendedIds] = useState<string[]>([]);

  const hasRecommendations = recommendations.length > 0;

  const handleInputChange = (
    field: keyof typeof studentData,
    value: string
  ) => {
    setStudentData({ ...studentData, [field]: value });
  };

  const handleConnect = (adviser: Adviser) => {
    setSelectedAdviser(adviser);
    setShowModal(true);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const handleGetRecommendations = async () => {
    if (!isValidText(studentData.title)) {
      toast.error("Please enter a meaningful research topics.");
      return;
    }

    if (!isValidText(studentData.abstract)) {
      toast.error("Please enter a meaningful research overview.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await getRecommendedAdvisers(
        studentData.title,
        studentData.abstract
      );
      if (result.error) {
        toast.error(result.error);
        return;
      }

      setRecommendations(result.recommendations);
      setRecommendedIds(result.recommended_adviser_ids || []);
      setWildcardAdvisers(result.wildcard_advisers || []);

      toast.success(
        `We've found ${result.recommendations.length} adviser${
          result.recommendations.length !== 1 ? "s" : ""
        } that best match your thesis proposal.`
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch recommendations.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmRequest = async (url: string) => {
    if (!selectedAdviser) return;

    startTransition(async () => {
      const res = await sendRequest(
        selectedAdviser.id,
        studentData.title,
        studentData.abstract,
        selectedAdviser.email ?? "",
        url,
        recommendedIds
      );

      if (res.error) {
        toast.error(res.error);
        return;
      }

      toast.success(
        "Adviser request sent successfully! We already notified them via email. Please check your my requests page for updates."
      );
      setShowModal(false);
      document.body.classList.remove("modal-open");

      // Re-fetch recommendations to refresh availability or request status
      const result = await getRecommendedAdvisers(
        studentData.title,
        studentData.abstract
      );

      if (result.error) {
        console.error(result.error);
        return;
      }

      setRecommendations(result.recommendations || []);
      setWildcardAdvisers(result.wildcard_advisers || []);
    });
  };

  const handleReset = () => {
    setRecommendations([]);
    setWildcardAdvisers([]);
    setSelectedAdviser(null);
    setShowModal(false);
    setRecommendedIds([]);
    document.body.classList.remove("modal-open");
  };

  return {
    studentData,
    recommendations,
    wildcardAdvisers,
    isPending,
    isLoading,
    showModal,
    selectedAdviser,
    hasRecommendations,
    handleInputChange,
    handleGetRecommendations,
    handleConfirmRequest,
    handleConnect,
    handleCancel,
    handleReset,
  };
}
