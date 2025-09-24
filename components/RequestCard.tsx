"use client";

import { Request } from "@/types/request";
import { formatDate } from "@/utils/formatDate";
import { getInitials } from "@/utils/getInitials";
import { Calendar, Mail } from "lucide-react";

interface RequestCardProps {
  request: Request;
  isExpanded: boolean;
  toggleExpand: (text: string) => void;
}
const RequestCard = ({
  request,
  isExpanded,
  toggleExpand,
}: RequestCardProps) => {
  return (
    <div className=" bg-white cursor-pointer border overflow-hidden border-gray-900 border-l-4 p-6 hover:shadow-md transition-shadow shadow-sm rounded-lg hover:bg-gray-50 ">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 cursor-pointer rounded-full overflow-hidden flex items-center justify-center bg-black text-white font-bold">
            {request?.studentProfilePicture ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={request.studentProfilePicture}
                alt={request.studentName}
                className="w-full h-full object-cover"
              />
            ) : (
              getInitials(request?.studentName)
            )}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{request.studentName}</h3>
            <p className="text-sm text-gray-500">{request.studentId}</p>
          </div>
        </div>

        <span
          className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
            request.status === "pending"
              ? "bg-yellow-100 text-yellow-800"
              : request.status === "accepted"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
        </span>
      </div>

      <div className="space-y-3 mb-4 ">
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
      <div>
        <h4 className="font-medium text-gray-900 mb-2">{request.title}</h4>
        <p
          className={`text-sm text-gray-600 text-justify transition-all duration-300 ease-in-out overflow-hidden ${
            isExpanded ? "line-clamp-none max-h-96" : "line-clamp-3 max-h-20"
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
    </div>
  );
};

export default RequestCard;
