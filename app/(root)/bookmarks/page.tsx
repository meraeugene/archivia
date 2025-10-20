import { getUserBookmarks } from "@/actions/bookmark";
import BookmarksClient from "./BookmarksClient";

export default async function BookmarksPage() {
  const { data } = await getUserBookmarks();

  return <BookmarksClient bookmarks={data || []} />;
}
