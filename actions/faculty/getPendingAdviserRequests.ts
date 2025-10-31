"use server";

import { createClient } from "@/utils/supabase/server";
import { cache } from "react";
import { getSession } from "../auth/getSession";

export const getPendingAdviserRequests = cache(async () => {
  const supabase = await createClient();

  const session = await getSession();

  if (!session) {
    return [];
  }

  if (session.role !== "faculty") {
    return [];
  }

  const { data, error } = await supabase
    .from("adviser_requests_view")
    .select("*")
    .eq("adviser_id", session?.sub)
    .in("status", ["pending", "already_handled", "reserved", "referred"])
    .order("submitted_at", { ascending: false });

  if (error) {
    console.log(error);
  }

  return data ?? [];
});
