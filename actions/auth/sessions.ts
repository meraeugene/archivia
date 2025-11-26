"use server";

import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { UAParser } from "ua-parser-js";
import { getSession } from "./getSession";
import { logout } from "./logout";

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
    location = `${geo.city || "Unknown"}, ${geo.country_name || "Unknown"}`;
  } catch (err) {
    console.error("Error fetching location:", err);
  }

  // 1. Mark all existing sessions as not current
  await supabase
    .from("user_sessions")
    .update({ is_current: false })
    .eq("user_id", userId);

  // 2. Check if a session with the same device + IP exists
  const { data: existing } = await supabase
    .from("user_sessions")
    .select("*")
    .eq("user_id", userId)
    .eq("device_type", deviceType)
    .eq("ip_address", ip)
    .single();

  if (existing) {
    // Update existing session
    await supabase
      .from("user_sessions")
      .update({
        last_active: new Date(),
        is_current: true,
        device: deviceName,
        user_agent: userAgent,
        location,
      })
      .eq("id", existing.id);
  } else {
    // Insert new session
    await supabase.from("user_sessions").insert({
      user_id: userId,
      device: deviceName,
      device_type: deviceType,
      ip_address: ip,
      location,
      last_active: new Date(),
      user_agent: userAgent,
      is_current: true,
    });
  }

  return true;
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

export async function removeSession(sessionId: string, current = false) {
  const supabase = await createClient();

  const session = await getSession();

  if (!session) {
    return false;
  }

  await supabase.from("user_sessions").delete().eq("id", sessionId);

  if (current) {
    await logout();
  }

  return true;
}

export async function signOutAllDevices() {
  const supabase = await createClient();

  const session = await getSession();
  if (!session) {
    return false;
  }

  await supabase.from("user_sessions").delete().eq("user_id", session.sub);

  return true;
}
