import { Calendar, Clock, FileText, Mail, Settings, Users } from "lucide-react";
import { formatDate } from "@/utils/formatDate";
import Link from "next/link";
import {
  getAdviserRequests,
  getAdviserRequestsCount,
} from "@/actions/facultyRequests";
import { getInitials } from "@/utils/getInitials";

export default async function FacultyDashboard() {
  const [requests, adviserRequestCount] = await Promise.all([
    getAdviserRequests(),
    getAdviserRequestsCount(),
  ]);

  return (
    <main className="flex-1 ">
      <div className="flex items-center justify-between px-8 py-4 border-b bg-white border-gray-200">
        <h1 className="text-lg font-bold text-gray-900">Dashboard</h1>
      </div>

      <div className="p-8">
        {/* Statistics Overview */}
        <section className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white border border-gray-900 border-l-4 p-6 rounded-lg ">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Requests
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {adviserRequestCount}
                  </p>
                </div>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <FileText className="h-6 w-6 text-gray-600" />
                </div>
              </div>

              <div className="mt-4 flex items-center text-sm">
                <span className="text-gray-500"> All request received</span>
              </div>
            </div>

            <div className="bg-white   border border-yellow-600 border-l-4  p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {adviserRequestCount}
                  </p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-gray-500">Awaiting your review</span>
              </div>
            </div>

            <div className="bg-white   border border-green-600 border-l-4  p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Students</p>
                  <p className="text-3xl font-bold text-green-600">0</p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-gray-500">Accepted student leaders</span>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              prefetch
              href="/dashboard/requests"
              className="bg-white p-6  text-left group rounded-lg shadow-sm border border-gray-900 border-l-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center  mb-4">
                <div className="bg-gray-100 p-3 rounded-lg group-hover:bg-gray-900 group-hover:text-white transition-colors">
                  <FileText className="h-6 w-6" />
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Review Requests
              </h3>
              <p className="text-sm text-gray-600">
                Review and manage pending student requests
              </p>
            </Link>

            <Link
              prefetch
              href="/dashboard/settings"
              className="bg-white p-6  text-left group rounded-lg shadow-sm border border-gray-900 border-l-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center  mb-4">
                <div className="bg-gray-100 p-3 rounded-lg group-hover:bg-gray-900 group-hover:text-white transition-colors">
                  <Settings className="h-6 w-6" />
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Account Settings
              </h3>
              <p className="text-sm text-gray-600">
                Update your profile and preferences
              </p>
            </Link>
          </div>
        </section>

        {/* Recent Activity */}
        <section>
          <div className=" mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Requests
            </h2>

            {requests.length === 0 && (
              <p className="text-gray-600 mt-2">
                No advisory requests at the moment.
              </p>
            )}
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {requests.slice(0, 5).map((request) => (
              <div
                key={request.id}
                className=" bg-white cursor-pointer border overflow-hidden border-gray-900 border-l-4 p-6 hover:shadow-md transition-shadow shadow-sm rounded-lg hover:bg-gray-50 "
              >
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
                      <h3 className="font-medium text-gray-900">
                        {request.studentName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {request.studentId}
                      </p>
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
                    {request.status.charAt(0).toUpperCase() +
                      request.status.slice(1)}
                  </span>
                </div>

                <div className="space-y-3 ">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    <span>{request.studentEmail}</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{formatDate(request.submittedAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
