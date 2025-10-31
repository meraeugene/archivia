"use server";

import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return null;

  return await verifyToken(token);
}
