import { getCurrentUser } from "@/actions/auth/getCurrentUser";
import {
  getAdviserCurrentLeadersCount,
  getHandledThesesCount,
  getPendingAdviserRequestsCount,
} from "@/actions/faculty/count";
import BackToTopButton from "@/components/BackToTopButton";
import { redirect } from "next/navigation";
import FacultySidebar from "./FacultySidebar";

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
    handledThesesCount,
  ] = await Promise.all([
    getPendingAdviserRequestsCount(),
    getAdviserCurrentLeadersCount(),
    getHandledThesesCount(),
  ]);

  return (
    <main className="min-h-screen lg:flex bg-gray-50">
      <FacultySidebar
        currentUser={currentUser}
        pendingAdviserRequestCount={pendingAdviserRequestCount}
        currentAdviserLeadersCount={currentAdviserLeadersCount}
        handledThesesCount={handledThesesCount}
      />
      <BackToTopButton />
      <div className="flex-1 lg:ml-64">{children}</div>
    </main>
  );
}
