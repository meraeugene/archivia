"use server";

import { createClient } from "@/utils/supabase/server";
import { getSession } from "../auth/getSession";
import { sendThesisApprovalEmail } from "@/utils/nodemailer/sendThesisApprovalEmail";
import { revalidatePath } from "next/cache";

export async function approveThesis(
  submissionId: string,
  studentEmail: string,
  feedback?: string
) {
  const supabase = await createClient();

  if (!submissionId || !studentEmail) {
    return { success: false, error: "Missing required fields." };
  }

  const session = await getSession();
  if (!session?.sub) {
    return { success: false, error: "Unauthorized access." };
  }

  if (session.role !== "faculty") {
    return { success: false, error: "Only faculty can approve theses." };
  }

  // 1. Update submission status
  const { data: thesis, error } = await supabase
    .from("thesis_submissions")
    .update({
      status: "approved",
      feedback: feedback || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", submissionId)
    .select()
    .single();

  if (error) {
    console.error("Error approving thesis:", error);
    return { success: false, error: error.message };
  }

  // 2. Insert into main `theses` table
  const { error: insertError } = await supabase.from("theses").insert([
    {
      title: thesis.title,
      abstract: thesis.abstract,
      keywords: thesis.keywords,
      proponents: thesis.proponents,
      adviser_id: thesis.adviser_id,
      adviser_name: thesis.adviser_name,
      panel_member1: thesis.panel_member1,
      panel_member2: thesis.panel_member2,
      panel_member3: thesis.panel_member3,
      defense_year: thesis.defense_year,
      category: thesis.category,
      file_url: thesis.file_url,
    },
  ]);

  if (insertError) {
    console.error("Error inserting approved thesis:", insertError);
    return { success: false, error: insertError.message };
  }

  // 3️ Delete the student–adviser relationship
  const { error: deleteError } = await supabase
    .from("student_requests")
    .delete()
    .eq("student_id", thesis.student_id)
    .eq("adviser_id", thesis.adviser_id);

  if (deleteError) {
    console.error("Error deleting student–adviser relationship:", deleteError);
    return { success: false, error: deleteError.message };
  }

  // 3 Fetch adviser current leaders count
  const { data: advData, error: advError } = await supabase
    .from("adviser_current_leaders")
    .select("current_leaders")
    .eq("adviser_id", session?.sub)
    .single();

  if (advError) return { success: false, error: advError.message };

  // 4. Decrement adviser current_leaders
  const { error: updateAdvError } = await supabase
    .from("adviser_current_leaders")
    .update({ current_leaders: advData.current_leaders - 1 })
    .eq("adviser_id", session?.sub);

  if (updateAdvError)
    return { success: false, error: "Error updating adviser current leaders" };

  await sendThesisApprovalEmail({
    to: studentEmail,
    type: "approve",
    thesisTitle: thesis.title,
    adviserName: thesis.adviser_name,
  });

  revalidatePath("/thesis-approval");

  return {
    success: true,
    message: "Thesis approved successfully and email sent.",
  };
}
