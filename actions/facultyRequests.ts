"use server";

import { createClient } from "@/utils/supabase/server";
import { getSession } from "./auth";
import { cache } from "react";
import { revalidatePath } from "next/cache";

export const getAdviserCapacity = cache(async (): Promise<string> => {
  const supabase = await createClient();
  const currentUser = await getSession();

  if (!currentUser) return "0/0";

  const { data, error } = await supabase
    .from("adviser_capacity")
    .select("current_leaders, max_leaders")
    .eq("adviser_id", currentUser.sub)
    .single();

  if (error || !data) {
    console.error("Error fetching adviser capacity:", error?.message);
    return "0/0";
  }

  return `${data.current_leaders}/${data.max_leaders}`;
});

export const getAdviserCurrentLeadersCount = cache(
  async (): Promise<string> => {
    const supabase = await createClient();
    const currentUser = await getSession();

    if (!currentUser) return "0/0";

    const { data, error } = await supabase
      .from("adviser_capacity")
      .select("current_leaders")
      .eq("adviser_id", currentUser.sub)
      .single();

    if (error || !data) {
      console.error("Error fetching adviser capacity:", error?.message);
      return "0/0";
    }

    return `${data.current_leaders}`;
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
    .order("submitted_at", { ascending: false });

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
  feedback?: string
): Promise<{ success: boolean; error?: string; message?: string }> {
  const supabase = await createClient();

  // 1️. Fetch the request being accepted
  const { data: reqData, error: reqError } = await supabase
    .from("student_requests")
    .select("*")
    .eq("id", requestId)
    .single();

  if (reqError) return { success: false, error: reqError.message };
  if (reqData.status !== "pending")
    return { success: false, error: "Request already processed" };

  // 2️. Fetch adviser capacity
  const { data: advData, error: advError } = await supabase
    .from("adviser_capacity")
    .select("*")
    .eq("adviser_id", reqData.adviser_id)
    .single();

  if (advError) return { success: false, error: advError.message };
  if (advData.current_leaders >= advData.max_leaders)
    return {
      success: false,
      error: "You have reached the maximum number of leaders.",
    };

  // 3️. Fetch adviser name (for feedback message in other requests)
  const { data: adviserProfile, error: adviserError } = await supabase
    .from("user_profiles")
    .select("full_name")
    .eq("user_id", reqData.adviser_id)
    .single();

  if (adviserError)
    return { success: false, error: "Error fetching adviser details" };

  const adviserName = adviserProfile.full_name;

  // 4️. Update this request to accepted
  const { error: updateReqError } = await supabase
    .from("student_requests")
    .update({ status: "accepted", feedback: feedback || null })
    .eq("id", requestId);

  if (updateReqError)
    return { success: false, error: "Error updating request" };

  // 5️. Mark all *other advisers’* requests by this student as already_handled
  const { error: updateOthersError } = await supabase
    .from("student_requests")
    .update({
      status: "already_handled",
      feedback: `This student is already handled by ${adviserName}.`,
    })
    .eq("student_id", reqData.student_id)
    .neq("id", requestId)
    .neq("adviser_id", reqData.adviser_id);

  if (updateOthersError)
    return { success: false, error: "Error updating other requests" };

  // 6️. Increment adviser current_leaders
  const { error: updateAdvError } = await supabase
    .from("adviser_capacity")
    .update({ current_leaders: advData.current_leaders + 1 })
    .eq("adviser_id", reqData.adviser_id);

  if (updateAdvError)
    return { success: false, error: "Error updating adviser capacity" };

  revalidatePath("/requests");
  revalidatePath("/dashboard");

  return { success: true, message: "Request accepted successfully." };
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
  revalidatePath("/dashboard");
  revalidatePath("/my-requests");
  return { success: true, message: "Request rejected successfully." };
}
