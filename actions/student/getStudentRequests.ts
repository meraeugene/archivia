"use server";

import { createClient } from "@/utils/supabase/server";
import { cache } from "react";
import { getSession } from "../auth/getSession";

export const getStudentSentRequests = cache(async () => {
  const supabase = await createClient();
  const user = await getSession();

  if (!user) {
    return { error: "User not authenticated" };
  }

  if (user.role !== "student") {
    return { error: "Only students can view sent requests" };
  }

  const { data, error } = await supabase
    .from("student_sent_requests_view")
    .select("*")
    .eq("student_id", user.sub)
    .order("submitted_at", { ascending: false });

  if (error) {
    console.error("Error fetching sent requests:", error);
  }

  return { data };
});
