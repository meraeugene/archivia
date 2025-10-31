import { getAllTheses } from "@/actions/common/theses";
import ArchiviaClient from "./ArchiviaClient";
import { getAllCategories } from "@/actions/common/getAllCategories";
import { getStudentAdviser } from "@/actions/student/getStudentAdviser";
import { getUserBookmarksIds } from "@/actions/common/getUserBookmarksIds";
import { getSession } from "@/actions/auth/getSession";

export default async function Page() {
  const [
    theses,
    session,
    categoryOptions,
    { data: userBookmarks = [] },
    studentAdviser,
  ] = await Promise.all([
    getAllTheses(),
    getSession(),
    getAllCategories(),
    getUserBookmarksIds(),
    getStudentAdviser(),
  ]);

  return (
    <ArchiviaClient
      initialTheses={theses}
      session={session}
      categoryOptions={categoryOptions}
      userBookmarks={userBookmarks}
      studentAdviser={studentAdviser}
    />
  );
}
