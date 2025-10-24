import { getAdviserAdvisees } from "@/actions/facultyRequests";
import AdviseesClient from "./AdviseesClient";

export default async function Page() {
  const requests = await getAdviserAdvisees();

  return <AdviseesClient requests={requests} />;
}
