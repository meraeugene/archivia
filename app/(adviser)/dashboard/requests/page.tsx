import { getAdviserRequests } from "@/actions/facultyRequests";
import { formatDate } from "@/utils/formatDate";
import { getInitials } from "@/utils/getInitials";
import { Calendar, Check, Mail, X } from "lucide-react";

export default async function Page() {
  const requests = await getAdviserRequests();

  return (
    <main className="flex-1">
      <div className=" px-8 py-4 border-b bg-white border-gray-200">
        <h1 className="text-lg font-bold text-gray-900">Advisory Requests</h1>
      </div>

      {requests.length === 0 && (
        <div className="px-8 py-4">
          <p className="text-gray-600">No advisory requests at the moment.</p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 p-8">
        {requests.map((request) => (
          <div
            key={request.id}
            className={`bg-white rounded-lg shadow-sm border border-gray-900 border-l-4 hover:shadow-md transition-shadow`}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
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

              <div className="mb-8">
                <h4 className="font-medium text-gray-900 mb-2">
                  {request.title}
                </h4>
                <p className="text-sm text-gray-600 text-justify">
                  {request.abstract}
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
}
