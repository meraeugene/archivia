"use server";

import { createClient } from "@/utils/supabase/server";
import { cache } from "react";
import { getSession } from "../auth/getSession";

export const getAdviserRequests = cache(async () => {
  const supabase = await createClient();

  const session = await getSession();

  if (!session) return [];

  if (session.role !== "faculty") {
    return [];
  }

  const { data, error } = await supabase
    .from("adviser_requests_view")
    .select("*")
    .eq("adviser_id", session?.sub)
    .order("submitted_at", { ascending: false })
    .limit(2);

  if (error) {
    console.log(error);
  }

  return data ?? [];
});
