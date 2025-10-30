"use server";

import { createClient } from "@/utils/supabase/server";
import { Thesis } from "@/types/thesis";
import { getSession } from "./auth";
import { cache } from "react";
import { revalidatePath } from "next/cache";
import { sendThesisApprovalEmail } from "@/utils/nodemailer/sendThesisApprovalEmail";

// For adviser to get pending thesis submissions
export const getPendingThesisSubmissions = cache(async () => {
  const supabase = await createClient();

  const session = await getSession();

  if (!session?.sub) {
    return [];
  }

  if (session.role !== "faculty") {
    return [];
  }

  const { data, error } = await supabase
    .from("thesis_submissions_with_student_view")
    .select("*")
    .eq("adviser_id", session.sub)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching submissions:", error);
    return [];
  }

  return data;
});

// Only student can submit thesis for approval
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
        status: "pending",
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

export async function returnThesis(
  submissionId: string,
  studentEmail: string,
  feedback: string
) {
  const supabase = await createClient();

  const session = await getSession();
  if (!session?.sub) {
    return { success: false, error: "Unauthorized access." };
  }

  if (session.role !== "faculty") {
    return { success: false, error: "Only faculty can return theses." };
  }

  if (!submissionId || !studentEmail || !feedback) {
    return { success: false, error: "Missing required fields." };
  }

  const { data, error } = await supabase
    .from("thesis_submissions")
    .update({
      status: "returned",
      feedback,
      updated_at: new Date().toISOString(),
    })
    .eq("id", submissionId)
    .select("title, adviser_name")
    .single();

  if (error) {
    console.error("Error returning thesis:", error);
    return { success: false, error: error.message };
  }

  await sendThesisApprovalEmail({
    to: studentEmail,
    type: "return",
    thesisTitle: data.title,
    adviserName: data.adviser_name,
    feedback,
  });

  revalidatePath("/thesis-approval");

  return { success: true, message: "Thesis returned and email sent." };
}
