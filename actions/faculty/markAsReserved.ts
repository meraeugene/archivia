"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "../auth/getCurrentUser";
// import { sendStudentReservedEmail } from "@/utils/nodemailer/sendStudentReservedEmail";

export async function markAsReserved(
  requestId: string
  // studentEmail: string,
  // thesisTitle: string,
  // thesisAbstract: string
) {
  const supabase = await createClient();

  if (!requestId) {
    return { success: false, error: "Request ID is required." };
  }

  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return { success: false, error: "Unauthorized access." };
  }

  if (currentUser.role !== "faculty") {
    return { success: false, error: "Unauthorized access." };
  }

  const { error } = await supabase
    .from("student_requests")
    .update({
      status: "reserved",
      feedback: "This request has been marked as reserved.",
    })
    .eq("id", requestId);

  if (error) {
    return { success: false, error: error.message };
  }

  // await sendStudentReservedEmail({
  //   to: studentEmail,
  //   adviserName: currentUser.full_name,
  //   thesisTitle,
  //   thesisAbstract,
  // });

  revalidatePath("/requests");
  revalidatePath("/my-requests");

  return {
    success: true,
    message:
      "Request successfully marked as reserved. The student has been notified via email.",
  };
}
