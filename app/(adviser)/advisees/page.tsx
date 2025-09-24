import {
  getAdviserAdvisees,
  getAdviserCapacity,
} from "@/actions/facultyRequests";
import AdviseesClient from "./AdviseesClient";

export default async function Page() {
  const [requests, adviserCapacity] = await Promise.all([
    getAdviserAdvisees(),
    getAdviserCapacity(),
  ]);

  return (
    <AdviseesClient requests={requests} adviserCapacity={adviserCapacity} />
  );
}
