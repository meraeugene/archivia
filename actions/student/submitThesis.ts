"use server";

import { Thesis } from "@/types/thesis";
import { createClient } from "@/utils/supabase/server";
import { getSession } from "../auth/getSession";

export async function submitThesisForApproval(
  thesisData: Thesis & {
    file_url: string;
    adviser_id: string;
  }
) {
  const requiredFields: (keyof (Thesis & { file_url: string }))[] = [
    "title",
    "abstract",
    "keywords",
    "proponents",
    "adviser_id",
    "panel_member1",
    "panel_member2",
    "panel_member3",
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

  const supabase = await createClient();
  const session = await getSession();

  if (!session?.sub) return { error: "Not authenticated" };

  if (session.role !== "student") {
    return { error: "Only students can submit thesis for approval." };
  }

  try {
    const { data, error } = await supabase.from("thesis_submissions").insert([
      {
        student_id: session?.sub,
        adviser_id: thesisData.adviser_id,
        adviser_name: thesisData.adviser_name,
        title: thesisData.title,
        abstract: thesisData.abstract,
        keywords: thesisData.keywords,
        proponents: thesisData.proponents,
        panel_member1: thesisData.panel_member1,
        panel_member2: thesisData.panel_member2,
        panel_member3: thesisData.panel_member3,
        defense_year: thesisData.defense_year,
        category: thesisData.category,
        file_url: thesisData.file_url,
        status: "accepted",
      },
    ]);

    if (error) {
      console.error("Error submitting thesis for approval:", error);
      return { error: error.message };
    }

    return { data };
  } catch (err) {
    console.error("Unexpected error:", err);
    return { error: "Unexpected error while submitting thesis" };
  }
}
