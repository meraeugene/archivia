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
    studentId: req.student_user_id,
    studentName: req.student_name,
    studentEmail: req.student_email,
    title: req.title,
    abstract: req.abstract,
    adviserId: req.adviser_id,
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
    .eq("status", "pending")
    .order("submitted_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data.map((req) => ({
    id: req.id,
    status: req.status,
    studentProfilePicture: req.student_profile_picture,
    submittedAt: req.submitted_at,
    studentId: req.student_user_id,
    studentName: req.student_name,
    studentEmail: req.student_email,
    title: req.title,
    abstract: req.abstract,
    adviserId: req.adviser_id,
    studentUserId: req.student_user_id,
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
    studentId: req.student_user_id,
    studentName: req.student_name,
    studentEmail: req.student_email,
    title: req.title,
    abstract: req.abstract,
    adviserId: req.adviser_id,
    studentUserId: req.student_user_id,
  }));
});

export async function acceptRequest(
  requestId: string
): Promise<{ success: boolean; error?: string; message?: string }> {
  const supabase = await createClient();

  // Start transaction
  const { data: reqData, error: reqError } = await supabase
    .from("student_requests")
    .select("*")
    .eq("id", requestId)
    .single();

  if (reqError) return { success: false, error: reqError.message };
  if (reqData.status !== "pending")
    return { success: false, error: "Request already processed" };

  const { data: advData, error: advError } = await supabase
    .from("adviser_capacity")
    .select("*")
    .eq("adviser_id", reqData.adviser_id)
    .single();

  if (advError) return { success: false, error: advError.message };
  if (advData.current_leaders >= advData.max_leaders)
    return { success: false, error: "Adviser is full" };

  // Update request to accepted
  const { error: updateReqError } = await supabase
    .from("student_requests")
    .update({ status: "accepted" })
    .eq("id", requestId);

  if (updateReqError) return { success: false, error: updateReqError.message };

  // Increment adviser current_leaders
  const { error: updateAdvError } = await supabase
    .from("adviser_capacity")
    .update({ current_leaders: advData.current_leaders + 1 })
    .eq("adviser_id", reqData.adviser_id);

  if (updateAdvError) return { success: false, error: updateAdvError.message };

  revalidatePath("/requests");
  revalidatePath("/dashboard");
  return { success: true, message: "Request accepted successfully." };
}

export async function rejectRequest(
  requestId: string
): Promise<{ success: boolean; error?: string; message?: string }> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("student_requests")
    .update({ status: "rejected" })
    .eq("id", requestId);

  if (error) return { success: false, error: error.message };

  revalidatePath("/requests");
  revalidatePath("/dashboard");
  return { success: true, message: "Request rejected successfully." };
}
