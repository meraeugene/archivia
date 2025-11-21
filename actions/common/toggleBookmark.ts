"use server";

import { createClient } from "@/utils/supabase/server";
import { getSession } from "../auth/getSession";
import { revalidatePath } from "next/cache";

export async function toggleBookmark(thesisId: number) {
  const supabase = await createClient();

  if (!thesisId) {
    return { error: "Thesis ID is required" };
  }

  const session = await getSession();

  if (!session) {
    return { error: "User not authenticated" };
  }

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

  // revalidatePath("/browse");
  revalidatePath("/bookmarks");
}
