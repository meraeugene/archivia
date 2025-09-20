"use server";

import { comparePassword } from "@/lib/hash";
import { signToken, verifyToken } from "@/lib/jwt";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Login function
 * - Validates user credentials
 * - Issues a JWT
 * - Stores session in a secure HTTP-only cookie
 */
export async function login(userId: string, password: string) {
  // Check if both username and password are provided
  if (!userId || !password) {
    return { error: "Username and password are required" };
  }

  const supabase = await createClient();

  // 1. Fetch user record from Supabase `users` table
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error || !user) {
    return { error: "Invalid credentials" }; // user not found
  }

  // 2. Verify the password by comparing hash
  const valid = await comparePassword(password, user.password);
  if (!valid) {
    return { error: "Invalid credentials" }; // incorrect password
  }

  // 3. Sign a JWT containing user ID and role
  const token = await signToken({ sub: user.user_id, role: user.role });

  // 4. Save JWT in a secure HTTP-only cookie
  const cookieStore = await cookies();
  cookieStore.set("session", token, {
    httpOnly: true, // not accessible via JS
    secure: process.env.NODE_ENV === "production", // only over HTTPS in prod
    path: "/", // valid for all routes
    maxAge: 60 * 60, // 1 hour
    sameSite: "strict", // CSRF protection
  });

  // Redirect user to homepage after successful login
  redirect("/");
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
 * Logout function
 * - Deletes the session cookie
 */
export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("session");

  redirect("/auth/login");
}
