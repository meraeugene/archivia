"use server";

import { createClient } from "@/utils/supabase/server";
import { cache } from "react";

export const getAdviserAdvisees = cache(async () => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("adviser_with_advisees_view")
    .select("*")
    .order("adviser_name", { ascending: true });

  if (error) {
    console.error("Error fetching adviser advisees:", error);
    throw new Error("Failed to fetch adviser advisees.");
  }

  return data || [];
});
