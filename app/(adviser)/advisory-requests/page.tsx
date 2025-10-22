import { getPendingAdviserRequests } from "@/actions/facultyRequests";
import AdvisoryRequestsClient from "./AdvisoryRequestsClient";

export default async function Page() {
  const requests = await getPendingAdviserRequests();

  return <AdvisoryRequestsClient requests={requests} />;
}
