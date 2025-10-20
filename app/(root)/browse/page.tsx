import { getAllCategories } from "@/actions/categories";
import BrowseClient from "./BrowseClient";
import { getMoreTheses } from "@/actions/theses";

export default async function BrowsePage() {
  const [initialTheses, categoryOptions] = await Promise.all([
    getMoreTheses(0),
    getAllCategories(),
  ]);

  return (
    <BrowseClient
      initialTheses={initialTheses}
      categoryOptions={categoryOptions}
    />
  );
}
