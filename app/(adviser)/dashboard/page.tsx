import { Clock, FileText, Settings, Users } from "lucide-react";
import {
  getAdviserCapacity,
  getAdviserRequests,
  getAdviserRequestsCount,
  getPendingAdviserRequestsCount,
} from "@/actions/facultyRequests";
import RequestsList from "@/components/RequestsList";
import StatsCard from "./StatsCard";
import QuickActionsCard from "./QuickActionsCard";

export default async function FacultyDashboard() {
  const [
    adviserRequests,
    pendingAdviserRequestCount,
    totalAdviserRequestCount,
    adviserCapacity,
  ] = await Promise.all([
    getAdviserRequests(),
    getPendingAdviserRequestsCount(),
    getAdviserRequestsCount(),
    getAdviserCapacity(),
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
            <StatsCard
              title="Total Requests"
              count={totalAdviserRequestCount}
              icon={<FileText className="h-6 w-6 text-gray-600" />}
              desc="All requests received"
              cardClass="bg-white border border-gray-900"
              iconClass="bg-gray-100"
              textColorClass="text-gray-600"
            />

            <StatsCard
              title="Pending"
              count={pendingAdviserRequestCount}
              icon={<Clock className="h-6 w-6 text-yellow-600" />}
              desc="Awaiting your review"
              cardClass="bg-white border border-yellow-600"
              iconClass="bg-yellow-100"
              textColorClass="text-yellow-600"
            />

            <StatsCard
              title="Advisees"
              count={adviserCapacity}
              icon={<Users className="h-6 w-6 text-green-600" />}
              desc="Accepted student leaders"
              cardClass="bg-white border border-green-600"
              iconClass="bg-green-100"
              textColorClass="text-green-600"
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
              title="Review Requests"
              desc="Review and manage pending student requests"
              icon={<FileText className="h-6 w-6" />}
              link="/requests"
            />
            <QuickActionsCard
              title="View Advisees"
              link="/advisees"
              desc="View the students you are currently advising."
              icon={<Users className="h-6 w-6" />}
            />

            <QuickActionsCard
              title="Account Settings"
              desc="Update your profile and preferences"
              icon={<Settings className="h-6 w-6" />}
              link="/settings"
            />
          </div>
        </section>

        {/* Recent Activity */}
        <section>
          <div className=" mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Requests Log
            </h2>

            {adviserRequests.length === 0 && (
              <p className="text-gray-600 mt-2">No past requests to display.</p>
            )}
          </div>

          <RequestsList adviserRequests={adviserRequests} />
        </section>
      </div>
    </main>
  );
}
