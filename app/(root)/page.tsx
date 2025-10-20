import { getAllTheses } from "@/actions/theses";
import ArchiviaClient from "./ArchiviaClient";
import { getSession } from "@/actions/auth";
import { getAllCategories } from "@/actions/categories";

export default async function Page() {
  const [theses, session, categoryOptions] = await Promise.all([
    getAllTheses(),
    getSession(),
    getAllCategories(),
  ]);

  return (
    <ArchiviaClient
      initialTheses={theses}
      session={session}
      categoryOptions={categoryOptions}
    />
  );
}
