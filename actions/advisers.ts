"use server";

import { createClient } from "@/utils/supabase/server";
import { cache } from "react";

export const getAllAdvisers = cache(async () => {
  const supabase = await createClient();

  const { data, error } = await supabase.from("all_advisers_view").select("*");

  if (error) {
    console.error("Error fetching all advisers:", error.message);
    return { error: "Failed to fetch all advisers." };
  }

  return data;
});
