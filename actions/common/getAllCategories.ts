"use server";

import { createClient } from "@/utils/supabase/server";
import { cache } from "react";

export const getAllCategories = cache(async () => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("unique_thesis_categories_view")
    .select("category")
    .order("category", { ascending: true });

  if (error) throw error;

  return [
    { key: "all", label: "All" },
    ...data.map((row) => ({
      key: row.category,
      label: row.category,
    })),
  ];
});
