import {
  BookCopy,
  BookOpen,
  Clock,
  FileCheck,
  FileText,
  Users,
} from "lucide-react";
import { getAdviserRequests } from "@/actions/facultyRequests";
import RequestsList from "@/components/RequestsList";
import StatsCard from "./StatsCard";
import QuickActionsCard from "./QuickActionsCard";
import { getHandledThesisCount } from "@/actions/handledThesis";
import Link from "next/link";
import {
  getAdviserCurrentLeadersCount,
  getAdviserRequestsCount,
  getPendingAdviserRequestsCount,
  getThesisSubmissionCount,
} from "@/actions/count";

export default async function FacultyDashboard() {
  const [
    adviserRequests,
    pendingAdviserRequestCount,
    totalAdviserRequestCount,
    thesisApprovedCount,
    handleThesisCount,
    adviserCurrentLeadersCount,
  ] = await Promise.all([
    getAdviserRequests(),
    getPendingAdviserRequestsCount(),
    getAdviserRequestsCount(),
    getThesisSubmissionCount(),
    getHandledThesisCount(),
    getAdviserCurrentLeadersCount(),
  ]);

  return (
    <main className="flex-1 ">
      <div className="sticky top-0 z-40 px-8 py-4 border-b bg-white border-gray-200">
        <h1 className="text-lg font-bold text-gray-900">Dashboard</h1>
      </div>

      <div className="p-8">
        {/* Statistics Overview */}
        <section className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <StatsCard
              title="Total Advisory Requests"
              count={totalAdviserRequestCount}
              icon={<FileText className="h-6 w-6 text-gray-600" />}
              desc="All advisory requests received"
              cardClass="bg-white border border-gray-900"
              iconClass="bg-gray-100"
              textColorClass="text-gray-600"
            />

            <StatsCard
              title="Pending Advisory Requests"
              count={pendingAdviserRequestCount}
              icon={<Clock className="h-6 w-6 text-yellow-600" />}
              desc="Awaiting your review"
              cardClass="bg-white border border-yellow-600"
              iconClass="bg-yellow-100"
              textColorClass="text-yellow-600"
            />

            <StatsCard
              title="Advisees"
              count={adviserCurrentLeadersCount}
              icon={<Users className="h-6 w-6 text-green-600" />}
              desc="Accepted student leaders"
              cardClass="bg-white border border-green-600"
              iconClass="bg-green-100"
              textColorClass="text-green-600"
            />

            <StatsCard
              title="Approval Requests"
              count={thesisApprovedCount}
              icon={<FileCheck className="h-6 w-6 text-purple-600" />}
              desc="Thesis awaiting your approval"
              cardClass="bg-white border border-purple-600"
              iconClass="bg-purple-100"
              textColorClass="text-purple-600"
            />

            <StatsCard
              title="Handled Thesis"
              count={handleThesisCount}
              icon={<BookCopy className="h-6 w-6 text-blue-600" />}
              desc="Thesis you have advised"
              cardClass="bg-white border border-blue-600"
              iconClass="bg-blue-100"
              textColorClass="text-blue-600"
            />
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
            <QuickActionsCard
              title="Review Advisory Requests"
              desc="Review and manage pending student requests"
              icon={<FileText className="h-6 w-6" />}
              link="/advisory-requests"
            />
            <QuickActionsCard
              title="View Advisees"
              link="/advisees"
              desc="View the students you are currently advising."
              icon={<Users className="h-6 w-6" />}
            />

            <QuickActionsCard
              title="Thesis Approval"
              link="/thesis-approval"
              desc="Approve or return student thesis submissions"
              icon={<FileCheck className="h-6 w-6" />}
            />

            <QuickActionsCard
              title="Handled Thesis"
              link="/handled-thesis"
              desc="View all thesis you have handled"
              icon={<BookOpen className="h-6 w-6" />}
            />
          </div>
        </section>

        {/* Recent Activity */}
        <section>
          <div className=" mb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Advisory Requests Log
              </h2>

              <Link
                href="/advisory-requests"
                className="text-sm font-medium text-gray-800 hover:underline"
              >
                View All
              </Link>
            </div>

            {adviserRequests.length === 0 && (
              <p className="text-gray-600 mt-2">
                No past advisory requests to display.
              </p>
            )}
          </div>

          <RequestsList adviserRequests={adviserRequests} />
        </section>
      </div>
    </main>
  );
}
