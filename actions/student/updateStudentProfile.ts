"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { getSession } from "../auth/getSession";

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
