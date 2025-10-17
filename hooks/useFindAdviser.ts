"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useAdviserStore } from "@/store/adviserStore";
import { sendRequest } from "@/actions/studentRequests";
import { getRecommendedAdvisers } from "@/actions/getRecommendedAdvisers";
import { isValidText } from "@/utils/isValidText";
import { Adviser } from "@/types/advisers";

export function useFindAdviser() {
  const { studentData, setStudentData } = useAdviserStore();

  const [recommendations, setRecommendations] = useState<Adviser[]>([]);
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedAdviser, setSelectedAdviser] = useState<Adviser | null>(null);

  const hasRecommendations = recommendations.length > 0;

  const handleInputChange = (
    field: keyof typeof studentData,
    value: string
  ) => {
    setStudentData({ ...studentData, [field]: value });
  };

  const handleGetRecommendations = async () => {
    if (!isValidText(studentData.title) || !isValidText(studentData.abstract)) {
      toast.error("Please enter a meaningful title and abstract.");
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
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch recommendations.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmRequest = async () => {
    if (!selectedAdviser) return;

    startTransition(async () => {
      const res = await sendRequest(
        selectedAdviser.id,
        studentData.title,
        studentData.abstract
      );

      if (res.error) {
        toast.error(res.error);
        return;
      }

      toast.success("Adviser request sent successfully!");
      setShowModal(false);

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
    });
  };

  return {
    studentData,
    recommendations,
    isPending,
    isLoading,
    showModal,
    selectedAdviser,
    hasRecommendations,
    handleInputChange,
    handleGetRecommendations,
    handleConfirmRequest,
    setShowModal,
    setSelectedAdviser,
  };
}
