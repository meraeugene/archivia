import { getCurrentUser } from "@/actions/auth/getCurrentUser";
import {
  getAdviserCurrentLeadersCount,
  getPendingAdviserRequestsCount,
  getThesisSubmissionCount,
} from "@/actions/faculty/count";
import FacultySidebar from "@/app/(adviser)/FacultySidebar";
import BackToTopButton from "@/components/BackToTopButton";
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
      <BackToTopButton />
      <div className="flex-1 ml-64">{children}</div>
    </main>
  );
}
