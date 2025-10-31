"use server";

import { createClient } from "@/utils/supabase/server";
import { cache } from "react";
import { getSession } from "../auth/getSession";

export const getHandledTheses = cache(async () => {
  const supabase = await createClient();

  const session = await getSession();

  if (session?.role !== "faculty") {
    return [];
  }

  const { data, error } = await supabase
    .from("adviser_handled_theses_view")
    .select("*")
    .eq("adviser_id", session.sub)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching handled theses:", error.message);
    return [];
  }

  return data;
});
