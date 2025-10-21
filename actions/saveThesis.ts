"use server";

import { createClient } from "@/utils/supabase/server";
import { Thesis } from "@/types/thesis";

export async function saveThesisToDB(
  thesisData: Thesis & { file_url: string }
) {
  const requiredFields: (keyof (Thesis & { file_url: string }))[] = [
    "title",
    "abstract",
    "keywords",
    "proponents",
    "adviser_name",
    "panel_chair_name",
    "panel_members",
    "defense_year",
    "category",
    "file_url",
  ];

  const missingFields = requiredFields.filter((field) => {
    const value = thesisData[field];
    return (
      value === undefined ||
      value === null ||
      value === "" ||
      (Array.isArray(value) && value.length === 0)
    );
  });

  if (missingFields.length > 0) {
    return { error: `Missing required fields: ${missingFields.join(", ")}` };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("theses").insert([thesisData]);

    if (error) {
      console.error("Error saving thesis to DB:", error);
      return { error: error.message };
    }

    return { data };
  } catch (err) {
    console.error("Unexpected error:", err);
    return { error: "Unexpected error while saving thesis" };
  }
}
