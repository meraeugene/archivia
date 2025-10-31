import { redirect } from "next/navigation";
import AdminSidebar from "./AdminSidebar";
import { getCurrentUser } from "@/actions/auth/getCurrentUser";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();

  // Redirect if not faculty user
  if (currentUser?.role !== "admin") {
    redirect("/");
  }

  return (
    <main className="min-h-screen bg-gray-50 flex ">
      <AdminSidebar currentUser={currentUser} />
      <div className="flex-1 ml-64">{children}</div>
    </main>
  );
}
