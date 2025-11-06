import { FileText, Clock, Users } from "lucide-react";
import StatsCard from "@/components/StatsCard";
import { getAdminDashboardStats } from "@/actions/admin/dashboardStats";

export default async function AdminDashboard() {
  const {
    totalRequests,
    pendingRequests,
    totalUsers,
    totalAdvisers,
    totalStudents,
  } = await getAdminDashboardStats();

  return (
    <main className="flex-1">
      <div className="sticky top-0 z-40 px-8 py-4 border-b bg-white border-gray-200">
        <h1 className="text-lg font-bold text-gray-900">Admin Dashboard</h1>
      </div>

      {/* Statistics Overview */}
      <section className="p-8 pb-0">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <StatsCard
            title="Total Advisory Requests"
            count={totalRequests}
            icon={<FileText className="h-6 w-6 text-blue-600" />}
            desc="All advisory requests received"
            iconClass="bg-blue-100"
            textColorClass="text-blue-600"
          />
          <StatsCard
            title="Pending Requests"
            count={pendingRequests}
            icon={<Clock className="h-6 w-6 text-yellow-600" />}
            desc="Awaiting your review"
            iconClass="bg-yellow-100"
            textColorClass="text-yellow-600"
          />
          <StatsCard
            title="Total Users"
            count={totalUsers}
            icon={<Users className="h-6 w-6 text-purple-600" />}
            desc="All registered users"
            iconClass="bg-purple-100"
            textColorClass="text-purple-600"
          />
          <StatsCard
            title="Advisers"
            count={totalAdvisers}
            icon={<Users className="h-6 w-6 text-green-600" />}
            desc="Registered advisers"
            iconClass="bg-green-100"
            textColorClass="text-green-600"
          />
          <StatsCard
            title="Students"
            count={totalStudents}
            icon={<Users className="h-6 w-6 text-pink-600" />}
            desc="Registered students"
            iconClass="bg-pink-100"
            textColorClass="text-pink-600"
          />
        </div>
      </section>
    </main>
  );
}
