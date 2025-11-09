"use server";

import { createClient } from "@/utils/supabase/server";
import { cache } from "react";

export const getAdviserRequestsPerMonth = cache(async () => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("adviser_requests_per_month")
    .select("*");

  if (error) {
    console.error("Error fetching adviser requests per month:", error);
    return [];
  }

  return data;
});
