"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { getSession } from "../auth/getSession";

export async function updateAdviserProfile(formData: {
  prefix: string;
  full_name: string;
  suffix: string;
  email: string;
  bio: string;
  position: string;
  highest_educational_attainment: string;
  research_interest: string;
  handled_subjects: string;
  profile_picture: string;
}) {
  const session = await getSession();
  if (!session?.sub) {
    return { error: "No active session found." };
  }

  const supabase = await createClient();

  // Check if email is already used by another user
  const { data: existingUser } = await supabase
    .from("user_profiles")
    .select("user_id")
    .eq("email", formData.email)
    .neq("user_id", session.sub)
    .single();

  if (existingUser) {
    return { error: "Email is already registered to another user." };
  }

  // Proceed to update profile
  const { error } = await supabase
    .from("user_profiles")
    .update({
      prefix: formData.prefix,
      full_name: formData.full_name,
      suffix: formData.suffix,
      email: formData.email,
      bio: formData.bio,
      handled_subjects: formData.handled_subjects,
      highest_educational_attainment: formData.highest_educational_attainment,
      position: formData.position,
      research_interest: formData.research_interest,
      profile_picture: formData.profile_picture,
    })
    .eq("user_id", session.sub);

  if (error) {
    console.error("Error updating profile:", error.message);
    return { error: "Failed to update profile." };
  }

  revalidatePath("/settings");
  return { success: true };
}
