"use server";

import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { createClient } from "@/utils/supabase/server";

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return null;

  const payload = await verifyToken(token);
  if (!payload) return null;

  // Connect to Supabase
  const supabase = await createClient();

  // Check if session still exists
  const { data: session, error } = await supabase
    .from("user_sessions")
    .select("*")
    .eq("id", payload.session_id)
    .eq("user_id", payload.sub)
    .single();

  if (error || !session) {
    return null;
  }

  return payload; // valid session
}
