import {
  BookCopy,
  BookOpen,
  Clock,
  FileCheck,
  FileText,
  Settings,
  Users,
} from "lucide-react";
import RequestsList from "@/components/RequestsList";
import StatsCard from "../../../../components/StatsCard";
import QuickActionsCard from "../../../../components/QuickActionsCard";
import Link from "next/link";
import {
  getAdviserCurrentLeadersCount,
  getAdviserRequestsCount,
  getHandledThesisCount,
  getPendingAdviserRequestsCount,
  getThesisSubmissionCount,
} from "@/actions/faculty/count";
import { getAdviserRequests } from "@/actions/faculty/getAdviserRequests";
import { getReferAdvisers } from "@/actions/faculty/getReferAdvisers";
import DashboardMobileHeader from "@/components/DashboardMobileHeader";

export default async function FacultyDashboard() {
  const [
    adviserRequests,
    pendingAdviserRequestCount,
    totalAdviserRequestCount,
    thesisApprovedCount,
    handledThesisCount,
    adviserCurrentLeadersCount,
    { advisers: referredAdvisers = [] },
  ] = await Promise.all([
    getAdviserRequests(),
    getPendingAdviserRequestsCount(),
    getAdviserRequestsCount(),
    getThesisSubmissionCount(),
    getHandledThesisCount(),
    getAdviserCurrentLeadersCount(),
    getReferAdvisers(),
  ]);

  return (
    <main className="flex-1 ">
      <DashboardMobileHeader headerTitle="Faculty Dashboard" />

      <div className="sticky hidden lg:block top-0 z-40 md:px-8 p-4 shadow-xs bg-white ">
        <h1 className="text-lg font-bold text-gray-900">Faculty Dashboard</h1>
      </div>

      <div className="px-4 py-6 md:p-8 ">
        {/* Statistics Overview */}
        <section className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3  2xl:grid-cols-5 gap-6 mb-8">
            <StatsCard
              title="Total Advisory Requests"
              count={totalAdviserRequestCount}
              icon={<FileText className="h-6 w-6 " />}
              desc="All advisory requests received"
              iconClass="bg-gray-100"
            />

            <StatsCard
              title="Pending Advisory Requests"
              count={pendingAdviserRequestCount}
              icon={<Clock className="h-6 w-6 " />}
              desc="Awaiting your review"
              iconClass="bg-gray-100"
            />

            <StatsCard
              title="Advisees"
              count={adviserCurrentLeadersCount}
              icon={<Users className="h-6 w-6 " />}
              desc="Accepted student leaders"
              iconClass="bg-gray-100"
            />

            <StatsCard
              title="Approval Requests"
              count={thesisApprovedCount}
              icon={<FileCheck className="h-6 w-6 " />}
              desc="Thesis awaiting your approval"
              iconClass="bg-gray-100"
            />

            <StatsCard
              title="Handled Thesis"
              count={handledThesisCount}
              icon={<BookCopy className="h-6 w-6 " />}
              desc="Thesis you have advised"
              iconClass="bg-gray-100"
            />
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <QuickActionsCard
              title="Review Advisory Requests"
              desc="Review and manage pending student requests"
              icon={<FileText className="h-6 w-6" />}
              link="/faculty/advisory-requests"
            />
            <QuickActionsCard
              title="View Advisees"
              link="/faculty/advisees"
              desc="View the students you are currently advising."
              icon={<Users className="h-6 w-6" />}
            />

            {/* <QuickActionsCard
              title="Thesis Approval"
              link="/thesis-approval"
              desc="Approve or return student thesis submissions"
              icon={<FileCheck className="h-6 w-6" />}
            /> */}

            <QuickActionsCard
              title="Handled Thesis"
              link="/faculty/handled-thesis"
              desc="View all thesis you have handled"
              icon={<BookOpen className="h-6 w-6" />}
            />

            <QuickActionsCard
              title="Settings"
              link="/faculty/settings"
              desc="Manage your faculty account settings"
              icon={<Settings className="h-6 w-6" />}
            />
          </div>
        </section>

        {/* Recent Activity */}
        <section>
          <div className=" mb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900">
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

          <RequestsList
            adviserRequests={adviserRequests}
            referredAdvisers={referredAdvisers}
          />
        </section>
      </div>
    </main>
  );
}
