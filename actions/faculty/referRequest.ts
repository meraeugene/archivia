"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { sendReferralEmail } from "@/utils/nodemailer/sendReferralEmail";
import { getCurrentUser } from "../auth/getCurrentUser";

export async function referRequest(
  requestId: string,
  studentEmail: string,
  newAdviserId: string,
  newAdviserEmail: string,
  newAdviserFullName: string,
  currentAdviserId: string,
  studentName: string,
  thesisTitle: string,
  thesisAbstract: string,
  feedback?: string
) {
  const supabase = await createClient();
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "faculty") {
    return { success: false, error: "Unauthorized access." };
  }

  if (!requestId || !studentEmail || !newAdviserId) {
    return { success: false, error: "Missing required fields." };
  }

  //  1. CHECK IF NEW ADVISER IS FULL
  const { data: adviserLimit, error: limitError } = await supabase
    .from("adviser_current_leaders")
    .select("current_leaders, max_limit")
    .eq("adviser_id", newAdviserId)
    .single();

  if (limitError || !adviserLimit) {
    return { success: false, error: "Adviser limit data not found." };
  }

  if (adviserLimit.current_leaders >= adviserLimit.max_limit) {
    return {
      success: false,
      error: "This adviser is already at full capacity.",
    };
  }

  //  2. UPDATE REQUEST AS REFERRED
  const { error } = await supabase
    .from("student_requests")
    .update({
      status: "referred",
      feedback,
      referred_by: currentAdviserId,
      referred_to: newAdviserId,
      adviser_id: newAdviserId,
    })
    .eq("id", requestId);

  if (error) {
    console.log("error", error);
    return { success: false, error: "Error referring request." };
  }

  //  3. SEND EMAILS
  await sendReferralEmail({
    toAdviser: newAdviserEmail,
    toStudent: studentEmail,
    studentName,
    thesisTitle,
    thesisAbstract,
    referredBy: currentUser.full_name,
    refferedTo: newAdviserFullName,
  });

  revalidatePath("/requests");
  revalidatePath("/my-requests");

  return {
    success: true,
    message:
      "Request successfully referred! Email sent to student and referred adviser.",
  };
}
