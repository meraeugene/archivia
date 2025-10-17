"use client";

import InputPanel from "./InputPanel";
import ConfirmModal from "./ConfirmModal";
import RecommendationsList from "./RecommendationsList";
import { useFindAdviser } from "@/hooks/useFindAdviser";

const FindAdviser = () => {
  const {
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
    handleConnect,
    handleCancel,
  } = useFindAdviser();

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
            onConnect={handleConnect}
          />
        )}
      </div>

      {showModal && selectedAdviser && (
        <ConfirmModal
          adviser={selectedAdviser}
          onCancel={handleCancel}
          onConfirm={handleConfirmRequest}
          isPending={isPending}
        />
      )}
    </div>
  );
};

export default FindAdviser;
