import { getAllCategories } from "@/actions/common/getAllCategories";
import UploadThesisClient from "./UploadThesisClient";
import { getStudentAdviser } from "@/actions/student/getStudentAdviser";
import { getAllPanels } from "@/actions/common/getAllPanels";

const UploadThesisPage = async () => {
  const [categories, studentAdviser, allPanels] = await Promise.all([
    getAllCategories(),
    getStudentAdviser(),
    getAllPanels(),
  ]);

  return (
    <UploadThesisClient
      categories={categories}
      studentAdviser={studentAdviser}
      allPanels={allPanels}
    />
  );
};

export default UploadThesisPage;
