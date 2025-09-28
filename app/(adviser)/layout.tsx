import { getCurrentUser } from "@/actions/auth";
import {
  getAdviserCurrentLeadersCount,
  getPendingAdviserRequestsCount,
} from "@/actions/facultyRequests";
import Sidebar from "@/components/Sidebar";
import { redirect } from "next/navigation";

export default async function FacultyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();

  if (currentUser?.role !== "faculty") {
    redirect("/");
  }

  const [pendingAdviserRequestCount, currentAdviserLeadersCount] =
    await Promise.all([
      getPendingAdviserRequestsCount(),
      getAdviserCurrentLeadersCount(),
    ]);

  return (
    <main className="min-h-screen bg-gray-50 flex ">
      <Sidebar
        currentUser={currentUser}
        pendingAdviserRequestCount={pendingAdviserRequestCount}
        currentAdviserLeadersCount={currentAdviserLeadersCount}
      />
      {children}
    </main>
  );
}
