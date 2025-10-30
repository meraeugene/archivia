"use server";

import { comparePassword, hashPassword } from "@/lib/hash";
import { signToken, verifyToken } from "@/lib/jwt";
import { isStrongPassword } from "@/utils/isStrongPassword";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

/**
 * Login function
 * - Validates user credentials
 * - Issues a JWT
 * - Stores session in a secure HTTP-only cookie
 */
export async function login(userId: string, password: string) {
  const sanitizedUserId = userId.trim();
  const sanitizedPassword = password.trim();

  if (!sanitizedUserId || !sanitizedPassword) {
    return { error: "Username and password are required" };
  }

  const supabase = await createClient();

  // 1. Fetch user record from Supabase `users` table
  const { data: user, error } = await supabase
    .from("users")
    .select("id,role,password")
    .eq("user_id", sanitizedUserId)
    .single();

  if (error || !user) {
    console.log(error);
    return { error: "Invalid credentials" }; // user not found
  }

  // 2. Verify the password by comparing hash
  const valid = await comparePassword(sanitizedPassword, user.password);
  if (!valid) {
    return { error: "Invalid credentials" }; // incorrect password
  }

  // 3. Sign a JWT containing user ID and role
  const token = await signToken({ sub: user.id, role: user.role });

  // 4. Save JWT in a secure HTTP-only cookie
  const cookieStore = await cookies();
  cookieStore.set("session", token, {
    httpOnly: true, // not accessible via JS
    secure: process.env.NODE_ENV === "production", // only over HTTPS in prod
    path: "/", // valid for all routes
    // maxAge: 60 * 60, // 1 hour
    sameSite: "strict", // CSRF protection
  });

  redirect(
    user.role === "faculty"
      ? "/dashboard"
      : user.role === "admin"
      ? "/admin/dashboard"
      : "/"
  );
}

/**
 * Get session from cookies
 * - Reads JWT from "session" cookie
 * - Verifies and decodes it
 */
export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return null;

  return await verifyToken(token);
}

/**
 * Get current logged-in user details
 * @returns Current logged-in user details from Supabase
 */
export const getCurrentUser = cache(async () => {
  // 1. Decode JWT
  const session = await getSession();
  if (!session) return null;

  const supabase = await createClient();

  // 2. Fetch user details from Supabase `user_details` view
  const { data, error } = await supabase
    .from("user_details_view")
    .select("*")
    .eq("id", session.sub)
    .single();

  if (error || !data) {
    console.error("Error fetching current user:", error?.message);
    return null;
  }

  return {
    id: data.id,
    user_id: data.user_id,
    role: data.role as "student" | "faculty" | "admin",
    status: data.status as "active" | "inactive",
    email: data.email,
    full_name: data.full_name,
    prefix: data.prefix,
    suffix: data.suffix,
    profile_picture: data.profile_picture,

    // Adviser-only fields
    position: data.position,
    bio: data.bio,
    highest_educational_attainment: data.highest_educational_attainment,
    research_interest: data.research_interest,
    orcid: data.orcid,
    handled_subjects: data.handled_subjects,

    // Student-only fields
    course: data.course,
    year_level: data.year_level,
    section: data.section,
  };
});

/** Change password function
 * - Validates old password
 * - Checks for strong password
 * - Prevents reusing the same password
 * - Hashes and updates to new password
 */
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

/**
 * Logout function
 * - Deletes the session cookie
 */
export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("session");

  redirect("/auth/login");
}
