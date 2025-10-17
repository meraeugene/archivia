"use server";

import { createClient } from "@/utils/supabase/server";
import { cache } from "react";

const PAGE_SIZE = 6;

// Utility: to map sorting options to DB column names
function getSortColumn(sortBy: string) {
  switch (sortBy) {
    case "title":
      return "title";
    case "adviser":
      return "adviser_name";
    case "year":
      return "defense_year";
    default:
      return "created_at";
  }
}

//  1. Homepage - latest theses
export const getAllTheses = cache(async () => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("theses")
    .select("*")
    .order("title", { ascending: true }) // sort alphabetically
    .limit(PAGE_SIZE);

  if (error) {
    console.error(" Error fetching theses:", error.message);
    return [];
  }

  return data;
});

//  2. Infinite scroll - with optional sorting
export async function getMoreTheses(
  offset: number,
  sortBy = "date",
  order: "asc" | "desc" = "desc"
) {
  const supabase = await createClient();
  const sortColumn = getSortColumn(sortBy);

  const { data, error } = await supabase
    .from("theses")
    .select("*")
    .order(sortColumn, { ascending: order === "asc" })
    .range(offset, offset + PAGE_SIZE - 1);

  if (error) {
    console.error("Error fetching more theses:", error.message);
    return [];
  }

  return data;
}

//  3. Search with sorting (title, adviser, keywords, proponents)
export async function searchTheses(query: string, sort: string) {
  const supabase = await createClient();

  let base = supabase.from("theses").select("*");

  if (query.trim()) {
    base = base.or(
      `title.ilike.%${query}%,adviser_name.ilike.%${query}%,keywords.cs.{${query}},proponents.cs.{${query}}`
    );
  }

  base = base.order("title", { ascending: true });

  switch (sort) {
    case "title":
      base = base.order("title", { ascending: true });
      break;
    case "adviser":
      base = base.order("adviser_name", { ascending: true });
      break;
    default:
      base = base.order("created_at", { ascending: false });
  }

  const { data, error } = await base;
  return { data, error };
}

//  4. Count (for pagination)
export async function getThesesCount() {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from("theses")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error(" Error counting theses:", error.message);
    return 0;
  }

  return count ?? 0;
}
