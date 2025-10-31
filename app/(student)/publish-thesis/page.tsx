import { getAllCategories } from "@/actions/common/getAllCategories";
import UploadThesisClient from "./UploadThesisClient";
import { getStudentAdviser } from "@/actions/student/getStudentAdviser";

const UploadThesisPage = async () => {
  const [categories, studentAdviser] = await Promise.all([
    getAllCategories(),
    getStudentAdviser(),
  ]);

  return (
    <UploadThesisClient
      categories={categories}
      studentAdviser={studentAdviser}
    />
  );
};

export default UploadThesisPage;
