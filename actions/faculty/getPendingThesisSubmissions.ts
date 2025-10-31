"use server";

import { createClient } from "@/utils/supabase/server";
import { cache } from "react";
import { getSession } from "../auth/getSession";

export const getPendingThesisSubmissions = cache(async () => {
  const supabase = await createClient();

  const session = await getSession();

  if (!session?.sub) {
    return [];
  }

  if (session.role !== "faculty") {
    return [];
  }

  const { data, error } = await supabase
    .from("thesis_submissions_with_student_view")
    .select("*")
    .eq("adviser_id", session.sub)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching submissions:", error);
    return [];
  }

  return data;
});
