import { getStudentSentRequests } from "@/actions/studentRequests";
import MyRequestsClient from "./MyRequestsClient";

export default async function SentRequestsPage() {
  const { data } = await getStudentSentRequests();

  return <MyRequestsClient requests={data || []} />;
}
