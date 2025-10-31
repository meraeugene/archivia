import { getCurrentUser } from "@/actions/auth/getCurrentUser";
import { getStudentAdviser } from "@/actions/student/getStudentAdviser";
import BackToTopButton from "@/components/BackToTopButton";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { navLinks } from "@/data/links";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentUser, studentAdviser] = await Promise.all([
    getCurrentUser(),
    getStudentAdviser(),
  ]);

  return (
    <main>
      <Header
        currentUser={currentUser}
        navLinks={navLinks}
        studentAdviser={studentAdviser}
      />{" "}
      <BackToTopButton />
      {children}
      <Footer />
    </main>
  );
}
