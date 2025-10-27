import { getPendingAdviserRequests } from "@/actions/facultyRequests";
import AdvisoryRequestsClient from "./AdvisoryRequestsClient";
import { getReferAdvisers } from "@/actions/referAdviser";

export default async function Page() {
  const [requests, { advisers: referredAdvisers = [] }] = await Promise.all([
    getPendingAdviserRequests(),
    getReferAdvisers(),
  ]);

  return (
    <AdvisoryRequestsClient
      requests={requests}
      referredAdvisers={referredAdvisers}
    />
  );
}
