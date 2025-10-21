import { getAllCategories } from "@/actions/categories";
import UploadThesisClient from "./UploadThesisClient";
import { getStudentAdviser } from "@/actions/getStudentAdviser";

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
