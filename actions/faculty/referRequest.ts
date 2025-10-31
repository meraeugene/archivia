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

  if (!currentUser) {
    return { success: false, error: "Unauthorized access." };
  }

  if (currentUser.role !== "faculty") {
    return { success: false, error: "Unauthorized access." };
  }

  if (!requestId || !studentEmail) {
    return { success: false, error: "Missing required fields." };
  }

  const { error } = await supabase
    .from("student_requests")
    .update({
      status: "referred",
      feedback,
      referred_by: currentAdviserId, // current adviser id
      referred_to: newAdviserId, // new adviser id
      adviser_id: newAdviserId, // new adviser id
    })
    .eq("id", requestId);

  if (error) {
    console.log("error", error);
    return { success: false, error: "Error referring request." };
  }

  await sendReferralEmail({
    toAdviser: newAdviserEmail, // new adviser email
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
      "Request successfully referred! Email sent to student, and to referred adviser.",
  };
}
