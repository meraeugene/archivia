"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Adviser, StudentData, StudentDataField } from "@/types/advisers";
import InputPanel from "@/components/InputPanel";
import ConfirmModal from "@/components/ConfirmModal";
import RecommendationsList from "@/components/RecommendationsList";

const StudentAdviserMatcher = () => {
  const [studentData, setStudentData] = useState<StudentData>({
    title: "",
    abstract: "",
  });
  const [recommendations, setRecommendations] = useState<Adviser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedAdviser, setSelectedAdviser] = useState<Adviser | null>(null);

  const hasRecommendations = recommendations.length > 0;

  const handleInputChange = (field: StudentDataField, value: string) =>
    setStudentData((prev) => ({ ...prev, [field]: value }));

  const handleGetRecommendations = async () => {
    if (!studentData.title.trim() || !studentData.abstract.trim()) {
      toast.error("Please fill in both the thesis title and abstract.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:8000/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studentData),
      });
      const data = await res.json();
      console.log(data);
      setRecommendations(data.recommendations);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    } finally {
      setIsLoading(false);
    }
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
          onConfirm={() => {
            console.log("Send request to:", selectedAdviser);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
};

export default StudentAdviserMatcher;
