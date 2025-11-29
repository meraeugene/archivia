"use server";
import { createClient } from "@/utils/supabase/server";
import { cache } from "react";

export const getAllThesisYears = cache(async () => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("theses")
    .select("defense_year")
    .not("defense_year", "is", null) // exclude nulls
    .order("defense_year", { ascending: false });

  if (error) {
    console.error("Error fetching years:", error);
    return [];
  }

  // Get unique years only
  const uniqueYears = Array.from(new Set(data.map((t) => t.defense_year)));
  return uniqueYears;
});
