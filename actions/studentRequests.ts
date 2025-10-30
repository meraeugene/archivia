"use server";

import { createClient } from "@/utils/supabase/server";
import { getCurrentUser, getSession } from "./auth";
import { revalidatePath } from "next/cache";
import { cache } from "react";
import { sendRequestAdviserEmail } from "@/utils/nodemailer/sendRequestAdvisorEmail";

export const getStudentSentRequests = cache(async () => {
  const supabase = await createClient();
  const user = await getSession();

  if (!user) {
    return { error: "User not authenticated" };
  }

  if (user.role !== "student") {
    return { error: "Only students can view sent requests" };
  }

  const { data, error } = await supabase
    .from("student_sent_requests_view")
    .select("*")
    .eq("student_id", user.sub)
    .order("submitted_at", { ascending: false });

  if (error) {
    console.error("Error fetching sent requests:", error);
  }

  return { data };
});

export async function sendRequest(
  adviserId: string,
  title: string,
  abstract: string,
  adviserEmail: string,
  url: string,
  recommendedIds?: string[]
) {
  const supabase = await createClient();
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return { error: "User not authenticated" };
  }

  if (currentUser.role !== "student") {
    return { error: "Only students can send requests" };
  }

  if (!adviserId || !title || !abstract || !adviserEmail) {
    return { error: "All fields are required" };
  }

  // 1. Check if student already sent a request to this adviser
  const { data: existing } = await supabase
    .from("student_requests")
    .select("id, status")
    .eq("student_id", currentUser.id)
    .eq("adviser_id", adviserId)
    .in("status", ["pending", "accepted"])
    .maybeSingle();

  if (existing && existing.status !== "rejected") {
    return {
      error:
        "You have already sent a request to this adviser. Please wait for a response.",
    };
  }

  // 2. Insert request
  const { data, error } = await supabase
    .from("student_requests")
    .insert({
      student_id: currentUser.id,
      adviser_id: adviserId,
      title,
      abstract,
      thesis_url: url,
      recommended_adviser_ids: recommendedIds,
    })
    .select()
    .single();

  if (error) {
    console.error("error", error);
    return { error: error.message };
  }

  await sendRequestAdviserEmail({
    to: adviserEmail,
    studentName: currentUser?.full_name,
    thesisTitle: title,
    thesisAbstract: abstract,
    thesisLink: url,
  });

  revalidatePath("/my-requests");

  return data;
}

export async function cancelRequest(requestId: string) {
  const supabase = await createClient();
  const user = await getSession();

  if (!user) {
    return { error: "User not authenticated" };
  }

  if (user.role !== "student") {
    return { error: "Only students can cancel requests" };
  }

  // Ensure the request belongs to the student
  const { data: request, error: fetchError } = await supabase
    .from("student_requests")
    .select("id, student_id, status")
    .eq("id", requestId)
    .maybeSingle();

  if (fetchError || !request) {
    return { error: "Request not found" };
  }

  if (request.student_id !== user.sub) {
    return { error: "Unauthorized" };
  }

  if (request.status !== "pending") {
    return { error: "Only pending requests can be cancelled" };
  }

  const { error } = await supabase
    .from("student_requests")
    .delete()
    .eq("id", requestId);

  if (error) {
    console.error("Error cancelling request:", error);
    return { error: "Failed to cancel request" };
  }

  revalidatePath("/my-requests");
  return { success: true };
}
