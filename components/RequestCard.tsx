"use client";

import { Request } from "@/types/request";
import { formatDate } from "@/utils/formatDate";
import { getInitials } from "@/utils/getInitials";
import {
  Calendar,
  CalendarClock,
  CornerUpRight,
  Link,
  LockOpen,
  Mail,
} from "lucide-react";

interface RequestCardProps {
  request: Request;
  isExpanded: boolean;
  toggleExpand: (text: string) => void;
  isPending?: boolean;
  handleOpenModal?: (
    request: Request,
    type: "accept" | "refer" | "reserve" | "returned" | "authorize"
  ) => void;
}

const RequestCard = ({
  request,
  isExpanded,
  toggleExpand,
  isPending,
  handleOpenModal,
}: RequestCardProps) => {
  return (
    <div className="bg-white h-fit border border-gray-100 overflow-hidden  p-6 transition-shadow  rounded-lg shadow-lg hover:shadow-xl tra">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 cursor-pointer rounded-full overflow-hidden flex items-center justify-center bg-black text-white font-bold">
            {request?.student_profile_picture ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={request.student_profile_picture}
                alt={request.student_name}
                className="w-full h-full object-cover border"
              />
            ) : (
              getInitials(request?.student_name)
            )}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">
              {request.student_name}
            </h3>
            <p className="text-sm text-gray-500">{request.student_user_id}</p>
          </div>
        </div>

        {/* Mark as Reserved Button */}
        {/* {request.status === "pending" && (
          <button
            disabled={isPending}
            onClick={() => handleOpenModal?.(request, "reserve")}
            className="flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-black bg-gray-50 hover:bg-gray-100 px-2 py-1 rounded-sm transition-colors border border-gray-200 cursor-pointer"
            title="Mark as Reserved"
          >
            <CalendarClock className="h-3.5 w-3.5" />
            Mark As Reserved
          </button>
        )} */}

        {request.status === "reserved" && (
          <button
            className="flex items-center gap-1 text-xs font-medium text-white bg-black  px-2 py-1 rounded-md transition-colors border border-gray-200"
            title="Mark as Reserved"
          >
            <CalendarClock className="h-3.5 w-3.5" />
            Reserved
          </button>
        )}
      </div>

      {/* Info Section */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Mail className="h-4 w-4 mr-2" />
          <a
            href={`mailto:${request.student_email}`}
            className="text-blue-600 hover:underline"
          >
            {request.student_email}
          </a>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="h-4 w-4 mr-2" />
          <span>{formatDate(request.submitted_at)}</span>
        </div>
      </div>

      {/* Title + Abstract */}
      <div className="mb-2">
        <h4 className="font-extrabold md:text-lg leading-tight  uppercase text-gray-900 mb-2">
          {request.title}
        </h4>
        <p
          className={` text-gray-600 text-sm md:text-base text-justify transition-all duration-300 ease-in-out overflow-hidden ${
            isExpanded ? "line-clamp-none max-h-96" : "line-clamp-3 max-h-20"
          }`}
        >
          {request.abstract}
        </p>
        <button
          onClick={() => toggleExpand(request.id)}
          className="mt-2 text-xs text-gray-900 font-semibold cursor-pointer hover:underline"
        >
          {isExpanded ? "Show less" : "Read more"}
        </button>
      </div>

      {/* Thesis URL */}
      {request.thesis_url && (
        <div className="mb-5 flex items-center gap-2">
          <Link className="h-4 w-4 text-gray-600 " />
          <a
            href={request.thesis_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline break-all line-clamp-1"
            title={request.thesis_url}
          >
            {request.thesis_url}
          </a>
        </div>
      )}

      {request.status === "already_handled" && (
        <div className="mt-6 border border-blue-100 bg-blue-50 rounded-md p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-1 flex items-center gap-2">
            Feedback
          </h3>
          <p className="text-base flex items-center gap-2 text-blue-700 leading-relaxed">
            <span className="md:inline-block w-1 h-1 bg-blue-600 rounded-full hidden "></span>
            {request.feedback || "No feedback provided."}
          </p>
        </div>
      )}

      {/* Actions */}

      {request.status === "accepted" && (
        <button
          disabled={isPending || request.is_authorized}
          onClick={() => handleOpenModal?.(request, "authorize")}
          className={`flex  w-full justify-center items-center gap-2 py-3 rounded-md text-sm font-medium transition-colors border
      ${
        request.is_authorized
          ? "bg-black text-white border  "
          : "bg-white text-gray-700 cursor-pointer border-gray-300 hover:bg-gray-50"
      }`}
        >
          {request.is_authorized ? (
            <>
              <LockOpen className="h-4 w-4" /> Authorized
            </>
          ) : (
            <>
              <LockOpen className="h-4 w-4" />
              Authorize Upload
            </>
          )}{" "}
        </button>
      )}

      {request.status === "pending" ||
      request.status === "reserved" ||
      request.status === "referred" ? (
        <div className="flex space-x-3 flex-col md:flex-row gap-4">
          {/* Accept */}
          <button
            disabled={isPending}
            onClick={() => handleOpenModal?.(request, "reserve")}
            className="flex-1 cursor-pointer bg-gray-900 text-white px-4 py-3 lg:py-2  rounded-md text-sm font-medium hover:bg-gray-800 transition-colors flex items-center justify-center"
          >
            <CalendarClock className="h-4 w-4 mr-2" />
            Reserve
          </button>

          <button
            disabled={isPending}
            onClick={() => handleOpenModal?.(request, "refer")}
            className="flex-1 shadow-md hover:shadow-lg  cursor-pointer bg-white text-gray-700 border border-gray-100 px-4 py-3 lg:py-2  rounded-md text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
          >
            <CornerUpRight className="h-4 w-4 mr-2" />
            Refer Adviser
          </button>

          {/* {request.status === "reserved" ? (
            <button
              disabled={isPending}
              onClick={() => handleOpenModal?.(request, "refer")}
              className="flex-1 cursor-pointer bg-white text-black border border-gray-300 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors flex items-center justify-center"
            >
              <CornerUpRight className="h-4 w-4 mr-2" />
              Refer Adviser
            </button>
          ) : (
            <button
              disabled={isPending}
              onClick={() => handleOpenModal?.(request, "returned")}
              className="flex-1 cursor-pointer bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
            >
              <X className="h-4 w-4 mr-2" />
              Return
            </button>
          )} */}
        </div>
      ) : null}
    </div>
  );
};

export default RequestCard;
