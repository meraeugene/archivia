import { getMoreTheses } from "@/actions/common/theses";
import ArchiviaClient from "./ArchiviaClient";
import { getAllCategories } from "@/actions/common/getAllCategories";
import { getStudentAdviser } from "@/actions/student/getStudentAdviser";
import { getUserBookmarksIds } from "@/actions/common/getUserBookmarksIds";
import { getSession } from "@/actions/auth/getSession";
import { getAllThesisYears } from "@/actions/common/getAllThesisYear";

export default async function Page() {
  const [
    initialTheses,
    session,
    categoryOptions,
    { data: userBookmarks = [] },
    studentAdviser,
    thesisYears,
  ] = await Promise.all([
    getMoreTheses(0, 0, "all"),
    getSession(),
    getAllCategories(),
    getUserBookmarksIds(),
    getStudentAdviser(),
    getAllThesisYears(),
  ]);

  return (
    <ArchiviaClient
      initialTheses={initialTheses}
      session={session}
      categoryOptions={categoryOptions}
      userBookmarks={userBookmarks}
      studentAdviser={studentAdviser}
      thesisYears={thesisYears}
    />
  );
}
