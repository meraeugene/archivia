import { getAllTheses } from "@/actions/theses";
import ArchiviaClient from "./ArchiviaClient";

export default async function Page() {
  const theses = await getAllTheses();

  return <ArchiviaClient initialTheses={theses} />;
}
