import { getCurrentUser } from "@/actions/auth";
import { getAdviserRequestsCount } from "@/actions/facultyRequests";
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

  const adviserRequestCount = await getAdviserRequestsCount();

  return (
    <main className="min-h-screen bg-gray-50 flex ">
      <Sidebar
        currentUser={currentUser}
        adviserRequestCount={adviserRequestCount}
      />
      {children}
    </main>
  );
}
