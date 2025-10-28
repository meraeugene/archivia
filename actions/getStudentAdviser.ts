"use server";

import { createClient } from "@/utils/supabase/server";
import { getSession } from "./auth";
import { cache } from "react";

export const getStudentAdviser = cache(async () => {
  const supabase = await createClient();

  const session = await getSession();

  if (!session) {
    return { success: false, message: "User not authenticated" };
  }

  if (session.role !== "student") {
    return null;
  }

  const { data: adviser, error } = await supabase
    .from("student_adviser_view")
    .select("*")
    .eq("student_id", session.sub)
    .maybeSingle();

  if (error) {
    console.error("Error fetching adviser:", error.message);
    return { success: false, error: error.message };
  }

  if (!adviser) {
    return null;
  }

  return adviser;
});
