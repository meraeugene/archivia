"use server";

import { createClient } from "@/utils/supabase/server";
import { getSession } from "../auth/getSession";
import { revalidatePath } from "next/cache";

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
