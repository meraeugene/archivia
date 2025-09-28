import { getStudentSentRequests } from "@/actions/studentRequests";
import MyRequestsClient from "./MyRequestsClient";

export default async function SentRequestsPage() {
  const { data, error } = await getStudentSentRequests();

  if (error) {
    console.error("Error fetching student requests:", error);
    return <div>Error loading requests</div>;
  }

  return <MyRequestsClient requests={data || []} />;
}
