"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSession } from "./getSession";

export async function logout() {
  const supabase = await createClient();
  const session = await getSession();

  if (session) {
    await supabase
      .from("user_sessions")
      .update({ logged_in: false })
      .eq("id", session.session_id); // only current device
  }

  const cookieStore = await cookies();
  cookieStore.delete("session");

  redirect("/auth/login");
}
