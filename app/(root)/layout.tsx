import { getCurrentUser } from "@/actions/auth";
import { getStudentAdviser } from "@/actions/getStudentAdviser";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { navLinks } from "@/data/links";
import React from "react";

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
      />
      {children}
      <Footer />
    </main>
  );
}
