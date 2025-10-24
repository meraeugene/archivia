"use server";

import { createClient } from "@/utils/supabase/server";
import { getCurrentUser, getSession } from "./auth";
import { cache } from "react";
import { revalidatePath } from "next/cache";
import { sendStudentAcceptedEmail } from "@/utils/nodemailer/sendStudentAcceptedEmail";

export const getAdviserCurrentLeadersCount = cache(
  async (): Promise<number> => {
    const supabase = await createClient();
    const currentUser = await getSession();

    if (!currentUser) return 0;

    const { data, error } = await supabase
      .from("adviser_current_leaders")
      .select("current_leaders")
      .eq("adviser_id", currentUser.sub)
      .single();

    if (error || !data) {
      console.error("Error fetching adviser current leaders:", error?.message);
      return 0;
    }

    return data.current_leaders;
  }
);

export const getAdviserRequestsCount = cache(async () => {
  const supabase = await createClient();
  const currentUser = await getSession();

  if (!currentUser) return 0;

  const { count, error } = await supabase
    .from("adviser_requests_view")
    .select("*", { count: "exact", head: true })
    .eq("adviser_id", currentUser.sub);

  if (error) {
    console.error("Error fetching adviser requests count:", error.message);
    return 0;
  }

  return count ?? 0;
});

export const getPendingAdviserRequestsCount = cache(async () => {
  const supabase = await createClient();
  const currentUser = await getSession();

  if (!currentUser) return 0;

  const { count, error } = await supabase
    .from("adviser_requests_view")
    .select("*", { count: "exact", head: true })
    .eq("adviser_id", currentUser.sub)
    .eq("status", "pending");

  if (error) {
    console.error("Error fetching adviser requests count:", error.message);
    return 0;
  }

  return count ?? 0;
});

export const getAdviserRequests = cache(async () => {
  const supabase = await createClient();

  const currentUser = await getSession();

  const { data, error } = await supabase
    .from("adviser_requests_view")
    .select("*")
    .eq("adviser_id", currentUser?.sub)
    .order("submitted_at", { ascending: false })
    .limit(3);

  if (error) throw new Error(error.message);

  return data.map((req) => ({
    id: req.id,
    status: req.status,
    studentProfilePicture: req.student_profile_picture,
    submittedAt: req.submitted_at,
    studentId: req.student_id,
    studentName: req.student_name,
    studentEmail: req.student_email,
    title: req.title,
    abstract: req.abstract,
    adviserId: req.adviser_id,
    feedback: req.feedback,
    studentUserId: req.student_user_id,
  }));
});

export const getPendingAdviserRequests = cache(async () => {
  const supabase = await createClient();

  const currentUser = await getSession();

  const { data, error } = await supabase
    .from("adviser_requests_view")
    .select("*")
    .eq("adviser_id", currentUser?.sub)
    .in("status", ["pending", "already_handled"])
    .order("submitted_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data.map((req) => ({
    id: req.id,
    status: req.status,
    studentProfilePicture: req.student_profile_picture,
    submittedAt: req.submitted_at,
    studentId: req.student_id,
    studentUserId: req.student_user_id,
    studentName: req.student_name,
    studentEmail: req.student_email,
    title: req.title,
    abstract: req.abstract,
    adviserId: req.adviser_id,
    feedback: req.feedback,
  }));
});

export const getAdviserAdvisees = cache(async () => {
  const supabase = await createClient();

  const currentUser = await getSession();

  const { data, error } = await supabase
    .from("adviser_requests_view")
    .select("*")
    .eq("adviser_id", currentUser?.sub)
    .eq("status", "accepted")
    .order("submitted_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data.map((req) => ({
    id: req.id,
    status: req.status,
    studentProfilePicture: req.student_profile_picture,
    submittedAt: req.submitted_at,
    studentId: req.student_id,
    studentUserId: req.student_user_id,
    studentName: req.student_name,
    studentEmail: req.student_email,
    title: req.title,
    abstract: req.abstract,
    adviserId: req.adviser_id,
    feedback: req.feedback,
  }));
});

export async function acceptRequest(
  requestId: string,
  studentEmail: string,
  feedback?: string
): Promise<{ success: boolean; error?: string; message?: string }> {
  const supabase = await createClient();

  // Only adviser can login and use this function
  const currentUser = await getCurrentUser();

  // 1️. Fetch the request being accepted
  const { data: reqData, error: reqError } = await supabase
    .from("student_requests")
    .select("*")
    .eq("id", requestId)
    .single();

  if (reqError) return { success: false, error: reqError.message };
  if (reqData.status !== "pending")
    return { success: false, error: "Request already processed" };

  // 2️. Fetch adviser current leaders count
  const { data: advData, error: advError } = await supabase
    .from("adviser_current_leaders")
    .select("current_leaders")
    .eq("adviser_id", reqData.adviser_id)
    .single();

  if (advError) return { success: false, error: advError.message };

  // 3. Update this request to accepted
  const { error: updateReqError } = await supabase
    .from("student_requests")
    .update({ status: "accepted", feedback: feedback || null })
    .eq("id", requestId);

  if (updateReqError)
    return { success: false, error: "Error updating request" };

  // 4. Mark all *other advisers’* requests by this student as already_handled
  const { error: updateOthersError } = await supabase
    .from("student_requests")
    .update({
      status: "already_handled",
      feedback: `This student is already handled by ${currentUser?.full_name}.`,
    })
    .eq("student_id", reqData.student_id)
    .neq("id", requestId)
    .neq("adviser_id", reqData.adviser_id);

  if (updateOthersError)
    return { success: false, error: "Error updating other requests" };

  // 5. Increment adviser current_leaders
  const { error: updateAdvError } = await supabase
    .from("adviser_current_leaders")
    .update({ current_leaders: advData.current_leaders + 1 })
    .eq("adviser_id", reqData.adviser_id);

  if (updateAdvError)
    return { success: false, error: "Error updating adviser current leaders" };

  await sendStudentAcceptedEmail({
    to: studentEmail,
    adviserName: currentUser?.full_name,
    thesisTitle: reqData.title,
    thesisAbstract: reqData.abstract,
    feedback: feedback || "No additional feedback provided.",
  });

  revalidatePath("/requests");

  return {
    success: true,
    message:
      "Request accepted successfully! The student has been notified via email.",
  };
}

export async function rejectRequest(
  requestId: string,
  feedback: string
): Promise<{ success: boolean; error?: string; message?: string }> {
  const supabase = await createClient();

  if (!feedback.trim()) {
    return { success: false, error: "Feedback is required for rejection." };
  }

  if (feedback.length > 300) {
    return {
      success: false,
      error: "Feedback must be less than 300 characters.",
    };
  }

  const { error } = await supabase
    .from("student_requests")
    .update({ status: "rejected", feedback })
    .eq("id", requestId)
    .select();

  if (error) return { success: false, error: "Error rejecting request" };

  revalidatePath("/requests");
  revalidatePath("/my-requests");
  return { success: true, message: "Request rejected successfully." };
}
