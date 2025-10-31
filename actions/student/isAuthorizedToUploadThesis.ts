"use server";

import { createClient } from "@/utils/supabase/server";
import { getSession } from "../auth/getSession";

export async function isStudentAuthorizedToUploadThesis() {
  const supabase = await createClient();

  const session = await getSession();

  const { data, error } = await supabase
    .from("student_requests")
    .select("id, adviser_id, status, is_authorized")
    .eq("student_id", session?.sub)
    .eq("status", "accepted")
    .eq("is_authorized", true)
    .limit(1)
    .single();

  if (error) {
    console.log(error);
  }

  // If data exists, the student is authorized
  return !!data;
}
