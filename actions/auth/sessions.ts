"use server";

import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { UAParser } from "ua-parser-js";
import { getSession } from "./getSession";

export async function trackSession(userId: string) {
  const supabase = await createClient();
  const h = await headers();

  const userAgent = h.get("user-agent") || "";
  const ip = h.get("x-forwarded-for")?.split(",")[0] || "unknown";

  const parser = new UAParser(userAgent);
  const info = parser.getResult();

  const deviceType = info.device.type ?? "desktop";

  // Device label
  const deviceLabel =
    deviceType === "desktop"
      ? "PC"
      : deviceType === "mobile"
      ? ""
      : deviceType === "tablet"
      ? "Tablet"
      : "Unknown";

  // Browser name fix
  const browserName = info.browser.name || "Unknown Browser";
  const osName = info.os.name || "Unknown OS";
  const deviceName = `${deviceLabel} ${browserName} - ${osName}`;

  // Optional location
  let location = null;
  try {
    const res = await fetch(`https://ipapi.co/${ip}/json/`);
    const geo = await res.json();
    location = `${geo.city || "Unknown City"}, ${
      geo.country_name || "Unknown Country"
    }`;
  } catch (err) {
    console.error("Error fetching location:", err);
  }

  const { data, error } = await supabase
    .from("user_sessions")
    .insert({
      user_id: userId,
      device: deviceName,
      device_type: deviceType,
      ip_address: ip,
      location,
      last_active: new Date(),
      user_agent: userAgent,
      logged_in: true,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Failed to track session:", error);
    return null;
  }

  return data?.id;
}

export async function getSessions() {
  const supabase = await createClient();

  const session = await getSession();

  if (!session) {
    return null;
  }

  const { data } = await supabase
    .from("user_sessions")
    .select("*")
    .eq("user_id", session.sub)
    .order("last_active", { ascending: false });

  return data;
}

// export async function removeSession(sessionId: string, current = false) {
//   const supabase = await createClient();

//   const session = await getSession();

//   if (!session) {
//     return false;
//   }

//   await supabase.from("user_sessions").delete().eq("id", sessionId);

//   if (current) {
//     await logout();
//   }

//   revalidatePath("/profile/[userId]/manage-access-devices");
//   return true;
// }

// export async function signOutAllDevices() {
//   const supabase = await createClient();

//   const session = await getSession();
//   if (!session) {
//     return false;
//   }

//   await supabase.from("user_sessions").delete().eq("user_id", session.sub);

//   revalidatePath("/profile/[userId]/manage-access-devices");
//   return true;
// }
