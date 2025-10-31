"use server";

import { isStrongPassword } from "@/utils/isStrongPassword";
import { getSession } from "./getSession";
import { createClient } from "@/utils/supabase/server";
import { comparePassword, hashPassword } from "@/lib/hash";
import { logout } from "./logout";

export async function changePassword(oldPassword: string, newPassword: string) {
  if (!oldPassword || !newPassword) {
    return { error: "Please fill in all fields." };
  }

  if (!isStrongPassword(newPassword)) {
    return {
      error:
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.",
    };
  }

  const session = await getSession();
  if (!session) {
    return { error: "Unauthorized. Please log in again." };
  }

  const supabase = await createClient();

  // Fetch current hashed password
  const { data: user, error: fetchError } = await supabase
    .from("users")
    .select("password")
    .eq("id", session.sub)
    .single();

  if (fetchError || !user) {
    return { error: "User not found." };
  }

  // Compare old password
  const isOldPasswordValid = await comparePassword(oldPassword, user.password);
  if (!isOldPasswordValid) {
    return { error: "Incorrect old password." };
  }

  // Check if new password is the same as current
  const isSamePassword = await comparePassword(newPassword, user.password);
  if (isSamePassword) {
    return {
      error: "New password cannot be the same as the current password.",
    };
  }

  // Hash and update new password
  const hashed = await hashPassword(newPassword);
  const { error: updateError } = await supabase
    .from("users")
    .update({ password: hashed })
    .eq("id", session.sub);

  if (updateError) {
    console.error("Error updating password:", updateError);
    return { error: "Failed to update password." };
  }

  await logout();

  return { success: true };
}
