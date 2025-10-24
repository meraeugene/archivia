import { getHandledTheses } from "@/actions/handledThesis";
import HandledThesisClient from "./HandledThesisClient";

const HandledThesisPage = async () => {
  const handledThesis = await getHandledTheses();

  return <HandledThesisClient handledTheses={handledThesis} />;
};

export default HandledThesisPage;
