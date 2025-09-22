import { getCurrentUser } from "@/actions/auth";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { navLinks } from "@/data/links";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();
  return (
    <main>
      <Header currentUser={currentUser} navLinks={navLinks} />
      {children}
      <Footer />
    </main>
  );
}
