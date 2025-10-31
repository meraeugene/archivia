import { getAllCategories } from "@/actions/common/getAllCategories";
import BrowseClient from "./BrowseClient";
import { getMoreTheses } from "@/actions/common/theses";
import { getUserBookmarksIds } from "@/actions/common/getUserBookmarksIds";

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
