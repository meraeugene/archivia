"use server";

import { createClient } from "@/utils/supabase/server";
import { cache } from "react";

export const getAdviserRequestsPerMonth = cache(async () => {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("adviser_requests_per_month")
      .select("*");

    if (error) {
      console.error("Error fetching adviser requests per month:", error);
      return []; // always return an array
    }

    return data ?? []; // fallback to empty array if data is null/undefined
  } catch (err) {
    console.error("Unexpected error fetching adviser requests per month:", err);
    return []; // ensure we always return an array
  }
});
