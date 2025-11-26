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
  const deviceName = `${deviceType === "desktop" ? "PC" : deviceType} ${
    info.browser.name
  } - ${info.os.name}`;

  // Optional location
  let location = null;
  try {
    const res = await fetch(`https://ipapi.co/${ip}/json/`);
    const geo = await res.json();
    location = `${geo.city}, ${geo.country_name}`;
  } catch {}

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

export async function removeSession(sessionId: string) {
  const supabase = await createClient();

  const session = await getSession();

  if (!session) {
    return false;
  }

  await supabase.from("user_sessions").delete().eq("id", sessionId);

  return true;
}

export async function signOutAllDevices(userId: string) {
  const supabase = await createClient();

  const session = await getSession();
  if (!session) {
    return false;
  }

  await supabase.from("user_sessions").delete().eq("user_id", userId);

  return true;
}
