import { getAllCategories } from "@/actions/categories";
import BrowseClient from "./BrowseClient";
import { getMoreTheses } from "@/actions/theses";
import { getUserBookmarksIds } from "@/actions/bookmark";

export default async function BrowsePage() {
  const [initialTheses, categoryOptions, { data: userBookmarks = [] }] =
    await Promise.all([
      getMoreTheses(0),
      getAllCategories(),
      getUserBookmarksIds(),
    ]);

  return (
    <BrowseClient
      initialTheses={initialTheses}
      categoryOptions={categoryOptions}
      userBookmarks={userBookmarks}
    />
  );
}
