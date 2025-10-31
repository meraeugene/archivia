import { getCurrentUser } from "@/actions/auth/getCurrentUser";
import { getStudentAdviser } from "@/actions/student/getStudentAdviser";
import { isStudentAuthorizedToUploadThesis } from "@/actions/student/isAuthorizedToUploadThesis";
import BackToTopButton from "@/components/BackToTopButton";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { navLinks } from "@/data/links";
import React from "react";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentUser, studentAdviser, isAuthorized] = await Promise.all([
    getCurrentUser(),
    getStudentAdviser(),
    isStudentAuthorizedToUploadThesis(),
  ]);

  return (
    <main>
      <Header
        currentUser={currentUser}
        navLinks={navLinks}
        studentAdviser={studentAdviser}
        isAuthorizedToUploadThesis={isAuthorized}
      />
      <BackToTopButton />
      {children}
      <Footer />
    </main>
  );
}
