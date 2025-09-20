import { getSession } from "@/actions/auth";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { navLinks } from "@/data/links";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <main>
      <Header session={session} navLinks={navLinks} />
      {children}
      <Footer />
    </main>
  );
}
