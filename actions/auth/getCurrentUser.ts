"use server";

import { createClient } from "@/utils/supabase/server";
import { cache } from "react";
import { getSession } from "./getSession";

export const getCurrentUser = cache(async () => {
  // 1. Decode JWT
  const session = await getSession();
  if (!session) return null;

  const supabase = await createClient();

  // 2. Fetch user details from Supabase `user_details` view
  const { data, error } = await supabase
    .from("user_details_view")
    .select("*")
    .eq("id", session.sub)
    .single();

  if (error || !data) {
    console.error("Error fetching current user:", error?.message);
    return null;
  }

  return data;
});
