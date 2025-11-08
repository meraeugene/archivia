import {
  FileText,
  Clock,
  Users,
  BookOpen,
  Database,
  BrainCircuit,
} from "lucide-react";
import StatsCard from "@/components/StatsCard";
import { getAdminDashboardStats } from "@/actions/admin/dashboardStats";
import { ChartBarMultiple } from "@/components/admin/ChartBarMultiple";
import { getAdviserRequestsPerMonth } from "@/actions/admin/getAdviserRequestsPerMonth";
import QuickActionsCard from "@/components/QuickActionsCard";
import TopBookmarksCard from "./TopBookmarksCard";

export default async function AdminDashboard() {
  const [
    {
      totalRequests,
      pendingRequests,
      totalUsers,
      totalAdvisers,
      totalStudents,
      topBookmarked,
    },
    adviserRequestsPerMonth,
  ] = await Promise.all([
    getAdminDashboardStats(),
    getAdviserRequestsPerMonth(),
  ]);

  return (
    <main className="flex-1">
      <div className="sticky top-0 z-40 px-8 py-4  bg-white shadow-xs">
        <h1 className="text-lg font-bold text-gray-900">Admin Dashboard</h1>
      </div>

      {/* Statistics Overview */}
      <section className="p-8 pb-0">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <StatsCard
            title="Total Advisory Requests"
            count={totalRequests}
            icon={<FileText className="h-6 w-6 " />}
            desc="All advisory requests received"
            iconClass="bg-gray-100"
          />
          <StatsCard
            title="Pending Requests"
            count={pendingRequests}
            icon={<Clock className="h-6 w-6 " />}
            desc="All adviser pending requests"
            iconClass="bg-gray-100"
          />
          <StatsCard
            title="Total Users"
            count={totalUsers}
            icon={<Users className="h-6 w-6 " />}
            desc="All registered users"
            iconClass="bg-gray-100"
          />
          <StatsCard
            title="Advisers"
            count={totalAdvisers}
            icon={<Users className="h-6 w-6 " />}
            desc="Registered advisers"
            iconClass="bg-gray-100"
          />
          <StatsCard
            title="Students"
            count={totalStudents}
            icon={<Users className="h-6 w-6 " />}
            desc="Registered students"
            iconClass="bg-gray-100"
          />
        </div>

        <section className="pt-8">
          <TopBookmarksCard bookmarks={topBookmarked} />
        </section>

        <div className="space-y-8 py-8">
          <ChartBarMultiple adviserRequest={adviserRequestsPerMonth} />
        </div>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
            <QuickActionsCard
              title="Manage users"
              desc="View and manage all users in the system."
              icon={<Users className="h-6 w-6" />}
              link="/admin/manage-users"
            />
            <QuickActionsCard
              title="Manage Theses"
              link="/admin/manage-theses"
              desc="View and manage all theses submissions"
              icon={<BookOpen className="h-6 w-6" />}
            />

            <QuickActionsCard
              title="Backup & Recovery"
              link="/admin/backup"
              desc="Backup and restore system data"
              icon={<Database className="h-6 w-6" />}
            />

            <QuickActionsCard
              title="Retrain Model"
              link="/admin/retrain-model"
              desc="Retrain the AI model with new data"
              icon={<BrainCircuit className="h-6 w-6" />}
            />
          </div>
        </section>
      </section>
    </main>
  );
}
