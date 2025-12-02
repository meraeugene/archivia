"use server";

import { createClient } from "@/utils/supabase/server";
import { cache } from "react";

export const getAllPanels = cache(async () => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("faculty_advisers_view")
    .select("adviser_id, full_name");

  if (error) {
    throw new Error(error.message);
  }

  return data;
});
