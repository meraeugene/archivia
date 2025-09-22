import { requests } from "@/data/requests";
import { formatDate } from "@/utils/formatDate";
import { Calendar, Check, Mail, User, X } from "lucide-react";

const page = () => {
  return (
    <main className="flex-1 ">
      <div className="flex items-center gap-3 px-8 py-4 border-b bg-white border-gray-200">
        <h1 className="text-lg font-bold text-gray-900">
          All Pending Requests
        </h1>

        <span className=" bg-gray-900 text-white text-xs font-medium px-2 py-1 rounded-full">
          4
        </span>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 p-8">
        {requests.map((request) => (
          <div
            key={request.id}
            className={`bg-white rounded-lg shadow-sm border border-gray-900 border-l-4 hover:shadow-md transition-shadow`}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-gray-100 rounded-full p-2">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {request.studentName}
                    </h3>
                    <p className="text-sm text-gray-500">{request.studentId}</p>
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

              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">
                  {request.subject}
                </h4>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {request.message}
                </p>
              </div>

              {request.status === "pending" && (
                <div className="flex space-x-3">
                  <button className="flex-1 cursor-pointer bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors flex items-center justify-center">
                    <Check className="h-4 w-4 mr-2" />
                    Accept
                  </button>
                  <button className="flex-1 cursor-pointer bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center">
                    <X className="h-4 w-4 mr-2" />
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default page;
