"use server";

import { isStrongPassword } from "@/utils/isStrongPassword";
import { createClient } from "@/utils/supabase/server";
import { hashPassword, comparePassword } from "@/lib/hash";

export async function resetPassword(email: string, newPassword: string) {
  if (!email || !newPassword) {
    return { success: false, error: "Please fill in all fields." };
  }

  if (!isStrongPassword(newPassword)) {
    return {
      success: false,
      error:
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.",
    };
  }

  const supabase = await createClient();

  // Fetch user by email
  const { data: user, error: fetchError } = await supabase
    .from("user_profiles")
    .select("user_id")
    .eq("email", email)
    .single();

  if (fetchError || !user) {
    return { success: false, error: "User not found." };
  }

  // Fetch current password from users table
  const { data: currentUser, error: passFetchError } = await supabase
    .from("users")
    .select("password")
    .eq("id", user.user_id)
    .single();

  if (passFetchError || !currentUser) {
    return { success: false, error: "Failed to fetch current password." };
  }

  // Check if new password is same as current
  const isSame = await comparePassword(newPassword, currentUser.password);
  if (isSame) {
    return {
      success: false,
      error: "New password cannot be the same as the current password.",
    };
  }

  // Hash new password
  const hashed = await hashPassword(newPassword);

  // Update password in the database
  const { error: updateError } = await supabase
    .from("users")
    .update({ password: hashed })
    .eq("id", user.user_id);

  if (updateError) {
    return { success: false, error: "Failed to update password." };
  }

  return { success: true, message: "Password reset successfully." };
}
