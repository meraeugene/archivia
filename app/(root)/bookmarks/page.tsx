import { getUserBookmarks } from "@/actions/common/getUserBookmarks";
import BookmarksClient from "./BookmarksClient";

export default async function BookmarksPage() {
  const { data } = await getUserBookmarks();

  return <BookmarksClient bookmarks={data || []} />;
}
