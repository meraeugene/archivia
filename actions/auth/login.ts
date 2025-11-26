"use server";

import { comparePassword } from "@/lib/hash";
import { signToken } from "@/lib/jwt";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { trackSession } from "./sessions";

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

  // 5. TRACK SESSION HERE
  // mark this device as current login
  await trackSession(user.id);

  if (user.role === "faculty") {
    redirect("/faculty/dashboard");
  }

  if (user.role === "admin") {
    redirect("/admin/dashboard");
  }

  redirect("/");
}
