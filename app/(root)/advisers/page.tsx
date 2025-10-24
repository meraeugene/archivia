import React from "react";
import AdvisersClient from "./AdvisersClient";
import { getAllAdvisers } from "@/actions/advisers";
import { getStudentAdviser } from "@/actions/getStudentAdviser";

const page = async () => {
  const [advisers, studentAdviser] = await Promise.all([
    getAllAdvisers(),
    getStudentAdviser(),
  ]);

  return <AdvisersClient advisers={advisers} studentAdviser={studentAdviser} />;
};

export default page;
