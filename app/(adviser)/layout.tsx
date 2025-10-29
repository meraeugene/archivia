import { getCurrentUser } from "@/actions/auth";
import {
  getAdviserCurrentLeadersCount,
  getPendingAdviserRequestsCount,
  getThesisSubmissionCount,
} from "@/actions/count";
import FacultySidebar from "@/app/(adviser)/FacultySidebar";
import { redirect } from "next/navigation";

export default async function FacultyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();

  // Redirect if not faculty user
  if (currentUser?.role !== "faculty") {
    redirect("/");
  }

  const [
    pendingAdviserRequestCount,
    currentAdviserLeadersCount,
    thesisSubmissionsCount,
  ] = await Promise.all([
    getPendingAdviserRequestsCount(),
    getAdviserCurrentLeadersCount(),
    getThesisSubmissionCount("pending"),
  ]);

  return (
    <main className="min-h-screen flex ">
      <FacultySidebar
        currentUser={currentUser}
        pendingAdviserRequestCount={pendingAdviserRequestCount}
        currentAdviserLeadersCount={currentAdviserLeadersCount}
        thesisSubmissionsCount={thesisSubmissionsCount}
      />
      <div className="flex-1 ml-64">{children}</div>
    </main>
  );
}
