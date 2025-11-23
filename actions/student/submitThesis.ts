"use server";

import { Thesis } from "@/types/thesis";
import { createClient } from "@/utils/supabase/server";
import { sendThesisApprovalEmail } from "@/utils/nodemailer/sendThesisApprovalEmail";
import { getCurrentUser } from "../auth/getCurrentUser";

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
  const currentUser = await getCurrentUser();

  if (!currentUser) return { error: "Not authenticated" };

  if (currentUser.role !== "student") {
    return { error: "Only students can publish thesis." };
  }

  try {
    const { error } = await supabase.from("theses").insert([
      {
        title: thesisData.title,
        abstract: thesisData.abstract,
        keywords: thesisData.keywords,
        proponents: thesisData.proponents,
        adviser_id: thesisData.adviser_id,
        adviser_name: thesisData.adviser_name,
        panel_member1: thesisData.panel_member1,
        panel_member2: thesisData.panel_member2,
        panel_member3: thesisData.panel_member3,
        defense_year: thesisData.defense_year,
        category: thesisData.category,
        file_url: thesisData.file_url,
      },
    ]);

    if (error) {
      console.error("Error submitting thesis:", error);
      return { error: error.message };
    }

    const { error: deleteError } = await supabase
      .from("student_requests")
      .delete()
      .eq("student_id", currentUser.id)
      .eq("adviser_id", thesisData.adviser_id);

    if (deleteError) {
      console.error(
        "Error deleting student–adviser relationship:",
        deleteError
      );
      return { success: false, error: deleteError.message };
    }

    const { data: advData, error: advError } = await supabase
      .from("adviser_current_leaders")
      .select("current_leaders")
      .eq("adviser_id", thesisData.adviser_id)
      .single();

    if (advError) return { success: false, error: advError.message };

    // 5. Decrement adviser current_leaders
    const { error: updateAdvError } = await supabase
      .from("adviser_current_leaders")
      .update({ current_leaders: advData.current_leaders - 1 })
      .eq("adviser_id", thesisData.adviser_id);

    if (updateAdvError)
      return {
        success: false,
        error: "Error updating adviser current leaders",
      };

    await sendThesisApprovalEmail({
      to: currentUser.email,
      type: "approve",
      thesisTitle: thesisData.title,
      adviserName: thesisData.adviser_name,
    });

    return { success: true, message: "Thesis published successfully." };
  } catch (err) {
    console.error("Unexpected error:", err);
    return { error: "Unexpected error while submitting thesis" };
  }
}
