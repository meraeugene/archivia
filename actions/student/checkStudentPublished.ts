"use server";

import { createClient } from "@/utils/supabase/server";
import { getSession } from "../auth/getSession";

export const checkStudentPublished = async () => {
  const session = await getSession();

  if (!session) {
    throw new Error("Not authenticated");
  }

  if (session.role !== "student") {
    throw new Error("Only students can check published thesis.");
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("theses")
    .select("id")
    .eq("student_id", session.sub)
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  // If data is found, student has already published
  return !!data;
};
