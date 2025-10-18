import { getAllTheses } from "@/actions/theses";
import ArchiviaClient from "./ArchiviaClient";
import { getCurrentUser } from "@/actions/auth";

export default async function Page() {
  const [theses, currentUser] = await Promise.all([
    getAllTheses(),
    getCurrentUser(),
  ]);

  return <ArchiviaClient initialTheses={theses} currentUser={currentUser} />;
}
