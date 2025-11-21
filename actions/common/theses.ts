"use server";

import { createClient } from "@/utils/supabase/server";
import { cache } from "react";

const PAGE_SIZE = 6;

export const getMoreTheses = cache(
  async (offset = 0, sort = "recent", category = "all") => {
    const supabase = await createClient();

    console.log("category nigga", category);

    let query = supabase.from("theses").select("*");

    if (category !== "all") {
      query = query.overlaps("category", [category]);
    }

    switch (sort) {
      case "title":
        query = query
          .order("title", { ascending: true })
          .order("id", { ascending: true });
        break;
      case "adviser":
        query = query
          .order("adviser_name", { ascending: true })
          .order("id", { ascending: true });
        break;
      default:
        query = query
          .order("created_at", { ascending: false })
          .order("id", { ascending: false });
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

export const getThesesCount = cache(async (category = "all") => {
  const supabase = await createClient();

  let query = supabase
    .from("theses")
    .select("*", { count: "exact", head: true });

  if (category !== "all") {
    query = query.overlaps("category", [category]);
  }

  const { count, error } = await query;

  if (error) {
    console.error("Error counting theses:", error.message);
    return 0;
  }

  return count ?? 0;
});
