"use server";

import { createClient } from "@/utils/supabase/server";
import { getSession } from "../auth/getSession";
import { sendThesisApprovalEmail } from "@/utils/nodemailer/sendThesisApprovalEmail";
import { revalidatePath } from "next/cache";

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
