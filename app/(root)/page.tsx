import { getAllTheses } from "@/actions/theses";
import ArchiviaClient from "./ArchiviaClient";
import { getSession } from "@/actions/auth";
import { getAllCategories } from "@/actions/categories";
import { getUserBookmarksIds } from "@/actions/bookmark";

export default async function Page() {
  const [theses, session, categoryOptions, { data: userBookmarks = [] }] =
    await Promise.all([
      getAllTheses(),
      getSession(),
      getAllCategories(),
      getUserBookmarksIds(),
    ]);

  return (
    <ArchiviaClient
      initialTheses={theses}
      session={session}
      categoryOptions={categoryOptions}
      userBookmarks={userBookmarks}
    />
  );
}
