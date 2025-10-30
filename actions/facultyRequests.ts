"use server";

import { createClient } from "@/utils/supabase/server";
import { getCurrentUser, getSession } from "./auth";
import { cache } from "react";
import { revalidatePath } from "next/cache";
import { sendStudentAcceptedEmail } from "@/utils/nodemailer/sendStudentAcceptedEmail";
import { sendStudentReturnedEmail } from "@/utils/nodemailer/sendStudentReturnedEmail";
// import { sendStudentReservedEmail } from "@/utils/nodemailer/sendStudentReservedEmail";

export const getAdviserRequests = cache(async () => {
  const supabase = await createClient();

  const session = await getSession();

  if (!session) return [];

  if (session.role !== "faculty") {
    return [];
  }

  const { data, error } = await supabase
    .from("adviser_requests_view")
    .select("*")
    .eq("adviser_id", session?.sub)
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
    referred_to: req.referred_to,
    referred_by: req.referred_by,
    thesisUrl: req.thesis_url,
    recommendedAdviserIds: req.recommended_adviser_ids,
  }));
});

export const getPendingAdviserRequests = cache(async () => {
  const supabase = await createClient();

  const session = await getSession();

  if (!session) {
    return [];
  }

  if (session.role !== "faculty") {
    return [];
  }

  const { data, error } = await supabase
    .from("adviser_requests_view")
    .select("*")
    .eq("adviser_id", session?.sub)
    .in("status", ["pending", "already_handled", "reserved", "referred"])
    .order("submitted_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

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
    referred_to: req.referred_to,
    referred_by: req.referred_by,
    thesisUrl: req.thesis_url,
    recommendedAdviserIds: req.recommended_adviser_ids,
  }));
});

export const getAdviserAdvisees = cache(async () => {
  const supabase = await createClient();

  const session = await getSession();

  if (!session) return [];

  if (session.role !== "faculty") {
    return [];
  }

  const { data, error } = await supabase
    .from("adviser_requests_view")
    .select("*")
    .eq("adviser_id", session?.sub)
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
    referred_to: req.referred_to,
    referred_by: req.referred_by,
    thesisUrl: req.thesis_url,
    recommendedAdviserIds: req.recommended_adviser_ids,
  }));
});

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
