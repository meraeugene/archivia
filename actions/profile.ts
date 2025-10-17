"use server";

import { createClient } from "@/utils/supabase/server";
import { getSession } from "./auth";
import { revalidatePath } from "next/cache";

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

export async function updateStudentProfile(formData: {
  email: string;
  course: string;
  year_level: number;
  section: string;
  bio: string;
  profile_picture: string;
}) {
  const session = await getSession();
  if (!session?.sub) {
    return { error: "No active session found." };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("user_profiles")
    .update({
      email: formData.email,
      course: formData.course,
      year_level: formData.year_level,
      section: formData.section,
      bio: formData.bio,
      profile_picture: formData.profile_picture,
    })
    .eq("user_id", session.sub);

  if (error) {
    console.error("Error updating student profile:", error.message);
    return { error: "Failed to update student profile." };
  }

  revalidatePath("/profile/" + session.sub);
  return { success: true };
}
