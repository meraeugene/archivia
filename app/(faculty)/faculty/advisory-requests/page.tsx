import { getReferAdvisers } from "@/actions/faculty/getReferAdvisers";
import AdvisoryRequestsClient from "./AdvisoryRequestsClient";
import { getPendingAdviserRequests } from "@/actions/faculty/getPendingAdviserRequests";

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
