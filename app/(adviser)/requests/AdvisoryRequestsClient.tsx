"use client";

import { useState, useTransition } from "react";
import { formatDate } from "@/utils/formatDate";
import { getInitials } from "@/utils/getInitials";
import { Calendar, Check, Mail, X } from "lucide-react";
import { acceptRequest, rejectRequest } from "@/actions/facultyRequests";
import { toast } from "sonner";
import Modal from "./Modal";
import { Request } from "@/types/request";

interface AdvisoryRequestsClientProps {
  requests: Request[];
}

export default function AdvisoryRequestsClient({
  requests,
}: AdvisoryRequestsClientProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"accept" | "reject">("accept");
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleAccept = (id: string) => {
    startTransition(async () => {
      const result = await acceptRequest(id);
      if (!result.success) {
        toast.error(result.error);
      }

      toast.success(result.message);
    });
  };

  const handleReject = (id: string) => {
    startTransition(async () => {
      const result = await rejectRequest(id);
      if (!result.success) {
        toast.error(result.error);
      }

      toast.success(result.message);
    });
  };

  return (
    <main className="flex-1">
      <div className="px-8 py-4 border-b bg-white border-gray-200">
        <h1 className="text-lg font-bold text-gray-900">Advisory Requests</h1>
      </div>

      {requests.length === 0 && (
        <div className="flex items-center justify-center p-8">
          <p className="text-gray-500  text-center">
            No advisory requests at the moment.
          </p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 p-8">
        {requests.map((request) => {
          const isExpanded = expandedId === request.id;

          return (
            <div
              key={request.id}
              className="bg-white rounded-lg shadow-sm border border-gray-900 border-l-4 hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center bg-black text-white font-bold">
                      {request.studentProfilePicture ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={request.studentProfilePicture}
                          alt={request.studentName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        getInitials(request.studentName)
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {request.studentName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {request.studentId}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      request.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : request.status === "accepted"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {request.status.toUpperCase()}
                  </span>
                </div>

                {/* Student Info */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    <span>{request.studentEmail}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{formatDate(request.submittedAt)}</span>
                  </div>
                </div>

                {/* Title and Abstract with ellipsis */}
                <div className="mb-8">
                  <h4 className="font-medium text-gray-900 mb-2">
                    {request.title}
                  </h4>
                  <p
                    className={`text-sm text-gray-600 text-justify transition-all duration-300 ease-in-out overflow-hidden ${
                      isExpanded
                        ? "line-clamp-none max-h-96"
                        : "line-clamp-3 max-h-20"
                    }`}
                  >
                    {request.abstract}
                  </p>
                  <button
                    onClick={() => toggleExpand(request.id)}
                    className="mt-2 text-xs text-gray-600 cursor-pointer hover:underline"
                  >
                    {isExpanded ? "Show less" : "Read more"}
                  </button>
                </div>

                {/* Actions */}
                {request.status === "pending" && (
                  <div className="flex space-x-3">
                    <button
                      disabled={isPending}
                      onClick={() => {
                        setSelectedRequest(request);
                        setModalType("accept");
                        setModalOpen(true);
                      }}
                      className="flex-1 cursor-pointer bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors flex items-center justify-center"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Accept
                    </button>
                    <button
                      disabled={isPending}
                      onClick={() => {
                        setSelectedRequest(request);
                        setModalType("reject");
                        setModalOpen(true);
                      }}
                      className="flex-1 cursor-pointer bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Modal
        isOpen={modalOpen}
        type={modalType}
        studentName={selectedRequest?.studentName || ""}
        onClose={() => setModalOpen(false)}
        onConfirm={() => {
          if (!selectedRequest) return;
          if (modalType === "accept") {
            handleAccept(selectedRequest.id);
          } else {
            handleReject(selectedRequest.id);
          }
          setModalOpen(false);
        }}
      />
    </main>
  );
}
