import { getAllTheses } from "@/actions/theses";
import ArchiviaClient from "./ArchiviaClient";
import { getSession } from "@/actions/auth";
import { getAllCategories } from "@/actions/categories";
import { getUserBookmarksIds } from "@/actions/bookmark";
import { getStudentAdviser } from "@/actions/getStudentAdviser";

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
