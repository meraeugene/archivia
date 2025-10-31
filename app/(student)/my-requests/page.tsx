import { getStudentSentRequests } from "@/actions/student/getStudentRequests";
import MyRequestsClient from "./MyRequestsClient";
import { getStudentAdviser } from "@/actions/student/getStudentAdviser";

export default async function SentRequestsPage() {
  const [{ data }, studentAdviser] = await Promise.all([
    getStudentSentRequests(),
    getStudentAdviser(),
  ]);

  return (
    <MyRequestsClient requests={data || []} studentAdviser={studentAdviser} />
  );
}
