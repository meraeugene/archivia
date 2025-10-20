"use server";

import { createClient } from "@/utils/supabase/server";
import { getSession } from "./auth";
import { revalidatePath } from "next/cache";
import { cache } from "react";

export const getStudentSentRequests = cache(async () => {
  const supabase = await createClient();
  const user = await getSession();

  if (!user) {
    return { error: "User not authenticated" };
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
  abstract: string
) {
  const supabase = await createClient();
  const user = await getSession();

  if (!user) {
    return { error: "User not authenticated" };
  }

  if (user.role !== "student") {
    return { error: "Only students can send requests" };
  }

  // 1️. Check adviser capacity
  const { data: capacity, error: capError } = await supabase
    .from("adviser_capacity")
    .select("current_leaders, max_leaders")
    .eq("adviser_id", adviserId)
    .maybeSingle();

  if (capError) {
    console.error(capError);
    return { error: "Unable to check adviser capacity" };
  }

  if (capacity && capacity.current_leaders >= capacity.max_leaders) {
    return { error: "This adviser cannot take more students." };
  }

  // 2️. Check if student already sent a request to this adviser
  const { data: existing } = await supabase
    .from("student_requests")
    .select("id, status")
    .eq("student_id", user.sub)
    .eq("adviser_id", adviserId)
    .in("status", ["pending", "accepted"])
    .maybeSingle();

  if (existing && existing.status !== "rejected") {
    return {
      error:
        "You have already sent a request to this adviser. Please wait for a response.",
    };
  }

  // 3️. Insert request
  const { data, error } = await supabase
    .from("student_requests")
    .insert({
      student_id: user.sub,
      adviser_id: adviserId,
      title,
      abstract,
    })
    .select()
    .single();

  if (error) {
    console.error("nigga", error);
    return { error: error.message };
  }

  revalidatePath("/my-requests");

  return data;
}

export async function cancelRequest(requestId: string) {
  const supabase = await createClient();
  const user = await getSession();

  if (!user) {
    return { error: "User not authenticated" };
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
