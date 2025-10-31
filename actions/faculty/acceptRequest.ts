"use server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { sendStudentAcceptedEmail } from "@/utils/nodemailer/sendStudentAcceptedEmail";
import { getCurrentUser } from "../auth/getCurrentUser";

export async function acceptRequest(
  requestId: string,
  studentEmail: string,
  studentId: string,
  adviserId: string,
  title: string,
  abstract: string,
  feedback?: string
): Promise<{ success: boolean; error?: string; message?: string }> {
  const supabase = await createClient();

  if (!requestId || !studentEmail) {
    return { success: false, error: "Missing required fields." };
  }

  // Only adviser can login and use this function
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return { success: false, error: "Unauthorized access." };
  }

  if (currentUser.role !== "faculty") {
    return { success: false, error: "Unauthorized access." };
  }

  // 1. Fetch adviser current leaders count
  const { data: advData, error: advError } = await supabase
    .from("adviser_current_leaders")
    .select("current_leaders")
    .eq("adviser_id", adviserId)
    .single();

  if (advError) return { success: false, error: advError.message };

  // 2. Update this request to accepted
  const { error: updateReqError } = await supabase
    .from("student_requests")
    .update({ status: "accepted", feedback: feedback || null })
    .eq("id", requestId);

  if (updateReqError)
    return { success: false, error: "Error updating request" };

  // 3. Mark all *other advisers’* requests by this student as already_handled
  const { error: updateOthersError } = await supabase
    .from("student_requests")
    .update({
      status: "already_handled",
      feedback: `This student is already handled by ${currentUser?.full_name}.`,
    })
    .eq("student_id", studentId)
    .neq("id", requestId)
    .neq("adviser_id", adviserId);

  if (updateOthersError)
    return { success: false, error: "Error updating other adviser requests" };

  // 4. Increment adviser current_leaders
  const { error: updateAdvError } = await supabase
    .from("adviser_current_leaders")
    .update({ current_leaders: advData.current_leaders + 1 })
    .eq("adviser_id", adviserId);

  if (updateAdvError)
    return { success: false, error: "Error updating adviser current leaders" };

  await sendStudentAcceptedEmail({
    to: studentEmail,
    adviserName: currentUser?.full_name,
    thesisTitle: title,
    thesisAbstract: abstract,
    feedback: feedback || "No additional feedback provided.",
  });

  revalidatePath("/requests");
  revalidatePath("/my-requests");

  return {
    success: true,
    message:
      "Request accepted successfully! The student has been notified via email.",
  };
}
