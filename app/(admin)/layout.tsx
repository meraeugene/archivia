import { getCurrentUser } from "@/actions/auth";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { navLinks } from "@/data/links";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();

  // Redirect if not admin user
  if (currentUser?.role !== "admin") {
    redirect("/");
  }

  return (
    <main>
      <Header currentUser={currentUser} navLinks={navLinks} />
      {children}
      <Footer />
    </main>
  );
}
