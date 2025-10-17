"use server";

import { createClient } from "@/utils/supabase/server";
import { cache } from "react";

const PAGE_SIZE = 6;

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
  offset = 0,
  sort = "recent",
  category = "all"
) {
  console.log("sort:", sort);
  console.log("category:", category);

  const supabase = await createClient();

  let query = supabase.from("theses").select("*");

  if (category !== "all") {
    query = query.eq("category", category);
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

//  3. Search with sorting (title, adviser, keywords, proponents)
export async function searchTheses(
  query: string,
  sort: string,
  category = "all"
) {
  const supabase = await createClient();
  let base = supabase.from("theses").select("*");

  if (category !== "all") {
    base = base.eq("category", category);
  }

  if (query.trim()) {
    base = base.or(
      `title.ilike.%${query}%,adviser_name.ilike.%${query}%,keywords.cs.{${query}},proponents.cs.{${query}}`
    );
  }

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
