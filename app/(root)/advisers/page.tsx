import React from "react";
import AdvisersClient from "./AdvisersClient";
import { getAllAdvisers } from "@/actions/advisers";

const page = async () => {
  const advisers = await getAllAdvisers();

  return <AdvisersClient advisers={advisers} />;
};

export default page;
