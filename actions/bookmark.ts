"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { getSession } from "./auth";
import { cache } from "react";

export const getUserBookmarks = cache(async () => {
  const supabase = await createClient();

  const session = await getSession();

  const { data, error } = await supabase
    .from("bookmarked_theses_view")
    .select("*")
    .eq("user_id", session?.sub)
    .order("bookmarked_at", { ascending: false });

  if (error) {
    console.error(error);
    return { data: [], error };
  }

  console.log(data);

  return { data, error: null };
});

export const getUserBookmarksIds = cache(async () => {
  const supabase = await createClient();
  const session = await getSession();

  const { data, error } = await supabase
    .from("bookmarked_theses_view")
    .select("id")
    .eq("user_id", session?.sub)
    .order("bookmarked_at", { ascending: false });

  if (error) {
    console.error("Error fetching bookmarks:", error);
    return { data: [], error };
  }

  const thesisIds = data.map((item) => item.id);

  return { data: thesisIds, error: null };
});

export async function toggleBookmark(thesisId: number) {
  const supabase = await createClient();

  const session = await getSession();

  // check if it already exists
  const { data: existing, error: checkError } = await supabase
    .from("bookmarks")
    .select("*")
    .eq("user_id", session?.sub)
    .eq("thesis_id", thesisId)
    .maybeSingle();

  if (checkError) {
    // not just "no rows found"
    console.error(checkError);
    return { error: "Failed to check bookmark status" };
  }

  if (existing) {
    // remove bookmark
    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("user_id", session?.sub)
      .eq("thesis_id", thesisId);

    if (error) {
      console.log(error);
      return { error: "Failed to remove bookmark" };
    }
  } else {
    // add bookmark
    const { error } = await supabase
      .from("bookmarks")
      .insert({ user_id: session?.sub, thesis_id: thesisId });

    if (error) {
      console.log(error);
      return { error: "Failed to add bookmark" };
    }
  }

  revalidatePath("/");
  revalidatePath("/browse");
}
