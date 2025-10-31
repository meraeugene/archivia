import { getAdviserAdvisees } from "@/actions/faculty/getAdviserAdvisees";
import AdviseesClient from "./AdviseesClient";

export default async function Page() {
  const requests = await getAdviserAdvisees();

  return <AdviseesClient requests={requests} />;
}
