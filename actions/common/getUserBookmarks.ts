"use server";

import { createClient } from "@/utils/supabase/server";
import { getSession } from "../auth/getSession";

export const getUserBookmarks = async () => {
  const supabase = await createClient();

  const session = await getSession();

  if (!session) {
    return { data: [], error: "User is not authenticated." };
  }

  const { data, error } = await supabase
    .from("bookmarked_theses_view")
    .select("*")
    .eq("user_id", session?.sub)
    .order("bookmarked_at", { ascending: false });

  if (error) {
    console.error(error);
    return { data: [], error };
  }

  return { data, error: null };
};
