"use server";

import { createClient } from "@/utils/supabase/server";
import { cache } from "react";

const PAGE_SIZE = 6;

export const getMoreTheses = cache(
  async (offset = 0, year = 0, category = "all") => {
    const supabase = await createClient();

    let query = supabase.from("theses").select("*");

    if (category !== "all") {
      query = query.contains("category", [category]);
    }

    if (year) {
      query = query.eq("defense_year", year); // filter by year
    }

    query = query.range(offset, offset + PAGE_SIZE - 1);

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching theses:", error.message);
      return [];
    }

    return data;
  }
);

export async function searchTheses(query: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("search_theses", {
    query,
  });

  if (error) {
    console.error("Search error:", error);
  }

  return { data, error };
}

export const getThesesCount = cache(async (category = "all", year: number) => {
  const supabase = await createClient();

  let query = supabase
    .from("theses")
    .select("*", { count: "exact", head: true });

  if (category !== "all") {
    query = query.overlaps("category", [category]);
  }

  if (year) {
    query = query.eq("defense_year", year); // filter by year
  }

  const { count, error } = await query;

  if (error) {
    console.error("Error counting theses:", error.message);
    return 0;
  }

  return count ?? 0;
});
