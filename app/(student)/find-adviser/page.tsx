"use client";
import React, { useState, useTransition } from "react";
import { useAdviserStore } from "@/store/adviserStore";
import { toast } from "sonner";
import InputPanel from "./InputPanel";
import ConfirmModal from "./ConfirmModal";
import RecommendationsList from "./RecommendationsList";
import { sendRequest } from "@/actions/studentRequests";
import { isValidText } from "@/utils/isValidText";
import { Adviser } from "@/types/advisers";
import { getRecommendedAdvisers } from "@/actions/getRecommendedAdvisers";

const StudentAdviserMatcher = () => {
  const { studentData, setStudentData, recommendations, setRecommendations } =
    useAdviserStore();

  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedAdviser, setSelectedAdviser] = useState<Adviser | null>(null);

  const hasRecommendations = recommendations.length > 0;

  const handleInputChange = (field: keyof typeof studentData, value: string) =>
    setStudentData({ ...studentData, [field]: value });

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

  return (
    <div className="bg-gray-50">
      <div
        className={`transition-all duration-700 ease-in-out ${
          hasRecommendations ? "max-w-6xl mx-auto flex" : ""
        }`}
      >
        <InputPanel
          studentData={studentData}
          onChange={handleInputChange}
          onSubmit={handleGetRecommendations}
          isLoading={isLoading}
          hasRecommendations={hasRecommendations}
        />
        {hasRecommendations && (
          <RecommendationsList
            recommendations={recommendations}
            onConnect={(adviser) => {
              setSelectedAdviser(adviser);
              setShowModal(true);
            }}
          />
        )}
      </div>

      {showModal && selectedAdviser && (
        <ConfirmModal
          adviser={selectedAdviser}
          onCancel={() => setShowModal(false)}
          onConfirm={handleConfirmRequest}
          isPending={isPending}
        />
      )}
    </div>
  );
};

export default StudentAdviserMatcher;
