"use server";

import { createClient } from "@/utils/supabase/server";
import { getSession } from "./auth";

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

  return data;
}

export async function getStudentSentRequests() {
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
    return { error: "Failed to fetch sent requests" };
  }

  return { data };
}

export async function getStudentAdviser() {
  const supabase = await createClient();

  const session = await getSession();

  if (!session) {
    return { success: false, message: "User not authenticated" };
  }

  const { data: adviser, error } = await supabase
    .from("student_adviser_view")
    .select("*")
    .eq("student_id", session.sub)
    .maybeSingle();

  if (error) {
    console.error("Error fetching adviser:", error.message);
    return { success: false, error: error.message };
  }

  if (!adviser) {
    return null;
  }

  return adviser;
}
