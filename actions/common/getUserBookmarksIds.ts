"use server";

import { createClient } from "@/utils/supabase/server";
import { getSession } from "../auth/getSession";
import { cache } from "react";

export const getUserBookmarksIds = cache(async () => {
  const supabase = await createClient();
  const session = await getSession();

  if (!session) throw new Error("User is not authenticated");

  const { data, error } = await supabase
    .from("bookmarked_theses_view")
    .select("id")
    .eq("user_id", session?.sub)
    .order("bookmarked_at", { ascending: false });

  if (error) throw error;

  const thesisIds = data.map((item) => item.id);

  return { data: thesisIds, error: null };
});
