"use server";

import { createClient } from "@/utils/supabase/server";
import { getSession } from "./auth";

export async function updateProfile(formData: {
  prefix: string;
  full_name: string;
  suffix: string;
  email: string;
  bio: string;
  position: string;
  highest_educational_attainment: string;
  research_interest: string;
  handled_subjects: string;
}) {
  const session = await getSession();

  const supabase = await createClient();

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
    })
    .eq("user_id", session?.sub);

  if (error) {
    console.error("Error updating profile:", error.message);
    return { error: "Failed to update profile." };
  }
}
