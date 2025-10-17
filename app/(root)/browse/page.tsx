import BrowseClient from "./BrowseClient";
import { getMoreTheses } from "@/actions/theses";

export default async function BrowsePage() {
  const initialTheses = await getMoreTheses(0);

  return <BrowseClient initialTheses={initialTheses} />;
}
