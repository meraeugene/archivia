"use server";

import { createClient } from "@/utils/supabase/server";
import { cache } from "react";
import { getSession } from "./auth";

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

  console.log(data);

  if (error) {
    console.error("Error fetching handled theses:", error.message);
    return [];
  }

  return data;
});

export const getHandledThesisCount = cache(async () => {
  const supabase = await createClient();
  const session = await getSession();

  if (session?.role !== "faculty") {
    return 0;
  }

  const { count, error } = await supabase
    .from("adviser_handled_theses_view")
    .select("*", { count: "exact", head: true })
    .eq("adviser_id", session.sub);

  if (error) {
    console.error("Error fetching handled thesis count:", error.message);
    return 0;
  }

  return count || 0;
});
