import { getStudentSentRequests } from "@/actions/studentRequests";
import MyRequestsClient from "./MyRequestsClient";
import { getStudentAdviser } from "@/actions/getStudentAdviser";

export default async function SentRequestsPage() {
  const [{ data }, studentAdviser] = await Promise.all([
    getStudentSentRequests(),
    getStudentAdviser(),
  ]);

  return (
    <MyRequestsClient requests={data || []} studentAdviser={studentAdviser} />
  );
}
