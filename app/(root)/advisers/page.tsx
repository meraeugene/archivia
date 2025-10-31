import React from "react";
import AdvisersClient from "./AdvisersClient";
import { getStudentAdviser } from "@/actions/student/getStudentAdviser";
import { getAllAdvisers } from "@/actions/faculty/getAllAdvisers";

const page = async () => {
  const [advisers, studentAdviser] = await Promise.all([
    getAllAdvisers(),
    getStudentAdviser(),
  ]);

  return <AdvisersClient advisers={advisers} studentAdviser={studentAdviser} />;
};

export default page;
