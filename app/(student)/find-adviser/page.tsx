"use client";

import InputPanel from "./InputPanel";
import ConfirmModal from "./ConfirmModal";
import { useFindAdviser } from "@/hooks/useFindAdviser";
import { RecommendationsList } from "./RecommendationsList";

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
    wildcardAdvisers,
    handleReset,
  } = useFindAdviser();

  return (
    <div className="bg-gray-50  relative">
      <div>
        {!hasRecommendations && (
          <InputPanel
            studentData={studentData}
            onChange={handleInputChange}
            onSubmit={handleGetRecommendations}
            isLoading={isLoading}
            hasRecommendations={hasRecommendations}
          />
        )}

        {hasRecommendations && wildcardAdvisers && (
          <RecommendationsList
            recommendations={recommendations}
            onConnect={handleConnect}
            wildcardAdvisers={wildcardAdvisers}
            handleReset={handleReset}
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
