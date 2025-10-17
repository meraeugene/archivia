"use client";

import { useState } from "react";
import { Mail, X, User } from "lucide-react";
import { formatDate } from "@/utils/formatDate";
import { cancelRequest } from "@/actions/studentRequests";
import { toast } from "sonner";

interface StudentRequest {
  id: string;
  status: string;
  submitted_at: string;
  updated_at: string;
  title: string;
  abstract: string;
  feedback: string | null;
  adviser_user_id: string;
  adviser_name: string;
  adviser_email: string;
  adviser_profile_picture: string | null;
  student_id: string;
}

interface MyRequestsClientProps {
  requests: StudentRequest[];
}

export default function MyRequestsClient({ requests }: MyRequestsClientProps) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState<string | null>(null);

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

  if (requests.length === 0) {
    return (
      <div className="relative overflow-hidden min-h-[60vh] flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-900 to-black"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-20 text-center">
          <h1 className="text-5xl text-white font-extrabold mb-5 tracking-tight">
            You have no sent requests.
          </h1>

          <div className="w-32 h-1 bg-white mx-auto mb-8"></div>
          <p className="text-lg text-gray-300 max-w-xl mx-auto ">
            Navigate to{" "}
            <a href="/find-adviser" className="text-blue-300 hover:underline">
              Find Adviser
            </a>{" "}
            to send a advisory request.
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className=" mx-auto ">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-900 to-black"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-20 text-center">
          <h1 className="text-5xl text-white font-extrabold mb-5 tracking-tight">
            My Requests
          </h1>

          <div className="w-32 h-1 bg-white mx-auto mb-8"></div>
          <p className="text-lg text-gray-300 max-w-xl mx-auto ">
            Track the status of your advisory requests below. You can cancel any
            pending requests at any time.
          </p>
        </div>
      </div>

      <div
        className="max-w-6xl mx-auto  py-14 
                 grid grid-cols-2  
                 gap-6 auto-rows-max px-5"
      >
        {requests.map((request) => (
          <div
            key={request.id}
            className="relative bg-white h-fit border overflow-hidden 
                     border-gray-900 border-l-4 p-6 hover:shadow-md 
                     transition-shadow shadow-sm rounded-lg "
          >
            {/* Adviser Info + Status + Cancel */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center bg-gray-200 text-gray-600 font-bold">
                  {request.adviser_profile_picture ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={request.adviser_profile_picture}
                      alt={request.adviser_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    {request.adviser_name}
                  </h3>
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    <a
                      href={`mailto:${request.adviser_email}`}
                      className="text-blue-600 hover:underline"
                    >
                      {request.adviser_email}
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {request.status !== "already_handled" && (
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
                )}

                {request.status === "pending" && (
                  <button
                    onClick={() => handleCancel(request.id)}
                    disabled={cancelling === request.id}
                    className="flex cursor-pointer items-center space-x-1 px-3 py-1.5 
                             text-red-600 border border-red-300 rounded-lg text-xs font-medium
                             hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {cancelling === request.id ? (
                      <div className="w-3.5 h-3.5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <X className="w-3.5 h-3.5" />
                    )}
                    <span>
                      {cancelling === request.id ? "Cancelling..." : "Cancel"}
                    </span>
                  </button>
                )}
              </div>
            </div>

            {/* Adviser  Date */}
            <h4 className="mb-4 text-sm text-gray-600">
              {formatDate(request.submitted_at)}
            </h4>

            {/* Title + Abstract */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                {request.title}
              </h4>
              <p
                className={`text-sm text-gray-600 text-justify transition-all duration-300 ease-in-out overflow-hidden ${
                  expanded === request.id
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
                {expanded === request.id ? "Show less" : "Read more"}
              </button>
            </div>

            {request.status === "accepted" ? (
              <div className="mt-6 border border-green-100 bg-green-50 rounded-md p-4">
                <h3 className="text-sm  font-medium text-green-800 mb-1 flex items-center gap-2">
                  Feedback
                </h3>
                <p className="text-base flex items-center gap-2 text-green-700 leading-relaxed">
                  <span className="inline-block w-1 h-1 bg-green-600 rounded-full"></span>
                  {request.feedback || "No feedback provided."}
                </p>
              </div>
            ) : request.status === "rejected" ? (
              <div className="mt-6 border border-red-100 bg-red-50 rounded-md p-4">
                <h3 className="text-sm  font-medium text-red-800 mb-1 flex items-center gap-2">
                  Feedback
                </h3>
                <p className="text-base flex items-center gap-2 text-red-700 leading-relaxed">
                  <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                  {request.feedback || "No feedback provided."}
                </p>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </main>
  );
}
