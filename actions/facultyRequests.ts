"use server";

import { createClient } from "@/utils/supabase/server";

export async function acceptRequest(requestId: string) {
  const supabase = await createClient();

  // Start transaction
  const { data: reqData, error: reqError } = await supabase
    .from("student_requests")
    .select("*")
    .eq("id", requestId)
    .single();

  if (reqError) {
    return { error: reqError.message };
  }

  if (reqData.status !== "pending")
    return { error: "Request already processed" };

  const { data: advData, error: advError } = await supabase
    .from("adviser_capacity")
    .select("*")
    .eq("adviser_id", reqData.adviser_id)
    .single();

  if (advError) {
    return { error: advError.message };
  }

  if (advData.current_leaders >= advData.max_leaders) {
    return { error: "Adviser is full" };
  }

  // Update request to accepted
  const { error: updateReqError } = await supabase
    .from("student_requests")
    .update({ status: "accepted" })
    .eq("id", requestId);

  if (updateReqError) {
    return { error: updateReqError.message };
  }

  // Increment adviser current_leaders
  const { error: updateAdvError } = await supabase
    .from("adviser_capacity")
    .update({ current_leaders: advData.current_leaders + 1 })
    .eq("adviser_id", reqData.adviser_id);

  if (updateAdvError) {
    return { error: updateAdvError.message };
  }

  return true;
}

export async function rejectRequest(requestId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("student_requests")
    .update({ status: "rejected" })
    .eq("id", requestId);

  if (error) {
    return { error: error.message };
  }

  return true;
}
