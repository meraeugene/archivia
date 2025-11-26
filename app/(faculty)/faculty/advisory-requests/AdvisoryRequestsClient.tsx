"use client";

import { Request } from "@/types/request";
import RequestCard from "../../../../components/RequestCard";
import { useAdvisoryRequests } from "@/hooks/useAdvisoryRequests";
import ConfirmationModal from "../../../../components/ConfirmationModal";
import { ReferredAdviser } from "@/types/referredAdvisers";
import DashboardMobileHeader from "@/components/DashboardMobileHeader";
import Masonry from "react-masonry-css";

const breakpointColumnsObj = {
  default: 3,
  768: 1,
  1024: 1,
  1440: 2,
};

export default function AdvisoryRequestsClient({
  requests,
  referredAdvisers,
}: {
  requests: Request[];
  referredAdvisers: ReferredAdviser[];
}) {
  const {
    expandedId,
    isPending,
    modalState,
    toggleExpand,
    openModal,
    closeModal,
    handleConfirmModal,
    selectedAdviser,
    setSelectedAdviser,
  } = useAdvisoryRequests();

  return (
    <main className="flex-1">
      <DashboardMobileHeader headerTitle="Advisory Requests" />

      <div className="sticky hidden lg:block shadow-xs top-0 z-40 px-8 py-4 bg-white ">
        <h1 className="text-lg font-bold text-gray-900">Advisory Requests</h1>
      </div>

      {requests.length === 0 && (
        <div className="flex items-center justify-center px-4 py-6 md:p-8">
          <p className="text-gray-500 text-center">
            No advisory requests at the moment.
          </p>
        </div>
      )}

      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex gap-8 px-4 py-6 md:p-8"
        columnClassName="space-y-8"
      >
        {requests.map((request) => (
          <RequestCard
            key={request.id}
            request={request}
            isExpanded={expandedId === request.id}
            toggleExpand={() => toggleExpand(request.id)}
            isPending={isPending}
            handleOpenModal={openModal}
          />
        ))}
      </Masonry>

      {/* Modal */}
      <ConfirmationModal
        isOpen={modalState.open}
        type={modalState.type}
        studentName={modalState.request?.student_name || ""}
        isPending={isPending}
        onClose={closeModal}
        onConfirm={handleConfirmModal}
        selectedAdviser={selectedAdviser}
        setSelectedAdviser={setSelectedAdviser}
        referredAdvisers={referredAdvisers}
        recommendedAdviserIds={
          modalState.request?.recommended_adviser_ids || []
        }
      />
    </main>
  );
}
