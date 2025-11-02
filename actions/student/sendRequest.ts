"use server";

import { createClient } from "@/utils/supabase/server";
import { getCurrentUser } from "../auth/getCurrentUser";
import { sendRequestAdviserEmail } from "@/utils/nodemailer/sendRequestAdvisorEmail";
import { revalidatePath } from "next/cache";

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

  // await sendRequestAdviserEmail({
  //   to: adviserEmail,
  //   studentName: currentUser?.full_name,
  //   thesisTitle: title,
  //   thesisAbstract: abstract,
  //   thesisLink: url,
  // });

  revalidatePath("/my-requests");

  return data;
}
