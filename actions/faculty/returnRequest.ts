"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { sendStudentReturnedEmail } from "@/utils/nodemailer/sendStudentReturnedEmail";
import { getCurrentUser } from "../auth/getCurrentUser";

export async function returnRequest(
  requestId: string,
  title: string,
  abstract: string,
  studentEmail: string,
  feedback: string
) {
  const supabase = await createClient();

  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return { success: false, error: "Unauthorized access." };
  }

  if (currentUser.role !== "faculty") {
    return { success: false, error: "Unauthorized access." };
  }

  // Make sure both values exist
  if (!requestId || !feedback) {
    return { success: false, error: "Missing required fields." };
  }

  // Update the request record
  const { error } = await supabase
    .from("student_requests")
    .update({
      status: "returned",
      feedback,
      updated_at: new Date().toISOString(),
    })
    .eq("id", requestId);

  if (error) {
    console.error("Error returning request:", error.message);
    return { success: false, error: error.message };
  }

  await sendStudentReturnedEmail({
    to: studentEmail,
    adviserName: currentUser.full_name,
    thesisTitle: title,
    thesisAbstract: abstract,
    feedback: feedback || "No additional feedback provided.",
  });

  revalidatePath("/requests");
  revalidatePath("/my-requests");

  return {
    success: true,
    message:
      "Request returned successfully! The student has been notified via email.",
  };
}
