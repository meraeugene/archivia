import {
  CheckCircle,
  Clock,
  FileText,
  Settings,
  User,
  Users,
} from "lucide-react";
import { requests } from "@/data/requests";
import { formatDate } from "@/utils/formatDate";
import Link from "next/link";

export default function FacultyDashboard() {
  const pendingRequests = requests.filter((req) => req.status === "pending");

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
                    {requests.length}
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
                    {pendingRequests.length}
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
                  <p className="text-sm font-medium text-gray-600">Accepted</p>
                  <p className="text-3xl font-bold text-green-600">
                    {requests.filter((r) => r.status === "accepted").length}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-500 font-medium">
                  {Math.round(
                    (requests.filter((r) => r.status === "accepted").length /
                      requests.length) *
                      100
                  )}
                  %
                </span>
                <span className="text-gray-500 ml-1">approval rate</span>
              </div>
            </div>

            <div className="bg-white   border border-blue-600 border-l-4  p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Students</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {new Set(requests.map((r) => r.studentId)).size}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-gray-500">Active students</span>
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
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Activity
            </h2>
            <Link
              href="/dashboard/requests"
              className="text-sm font-medium text-gray-900 hover:underline"
            >
              View all requests
            </Link>
          </div>

          <div className="bg-white hover:shadow-md transition-shadow shadow-sm rounded-lg border overflow-hidden border-gray-900 border-l-4 ">
            <div className="divide-y divide-gray-300">
              {requests.slice(0, 5).map((request) => (
                <div
                  key={request.id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-gray-100 rounded-full p-3">
                        <User className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {request.studentName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {request.requestType} • {request.studentId}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500">
                        {formatDate(request.submittedAt)}
                      </span>
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
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
