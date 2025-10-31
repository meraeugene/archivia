import { getPendingThesisSubmissions } from "@/actions/faculty/getPendingThesisSubmissions";
import ThesisApprovalClient from "./ThesisApprovalClient";

const ThesisApprovalPage = async () => {
  const thesisSubmissions = await getPendingThesisSubmissions();

  return <ThesisApprovalClient thesisSubmissions={thesisSubmissions} />;
};

export default ThesisApprovalPage;
