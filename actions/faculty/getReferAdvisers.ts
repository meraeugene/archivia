"use server";

import { createClient } from "@/utils/supabase/server";
import { cache } from "react";
import { getSession } from "../auth/getSession";

export const getReferAdvisers = cache(async () => {
  const supabase = await createClient();
  const session = await getSession();

  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  if (session.role !== "faculty") {
    return { success: false, error: "Unauthorized" };
  }

  const { data, error } = await supabase
    .from("all_advisers_view")
    .select("id, full_name, email")
    .neq("id", session.sub)
    .order("full_name");

  if (error) {
    console.error("Error fetching advisers:", error.message);
    return { success: false, error: error.message };
  }

  return { success: true, advisers: data };
});
