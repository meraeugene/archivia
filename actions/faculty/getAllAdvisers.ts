"use server";

import { createClient } from "@/utils/supabase/server";
import { cache } from "react";

export const getAllAdvisers = cache(async () => {
  const supabase = await createClient();

  const { data, error } = await supabase.from("all_advisers_view").select("*");

  if (error) {
    throw new Error(error.message);
  }

  return data;
});
