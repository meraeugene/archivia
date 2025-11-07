"use server";

import { createClient } from "@/utils/supabase/server";

export async function getAdminDashboardStats() {
  const supabase = await createClient();

  const [
    { count: totalRequests },
    { count: pendingRequests },
    { count: totalUsers },
    { count: totalAdvisers },
    { count: totalStudents },
    { data: topBookmarked },
  ] = await Promise.all([
    supabase
      .from("student_requests")
      .select("*", { count: "exact", head: true }),
    supabase
      .from("student_requests")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase.from("users").select("*", { count: "exact", head: true }),
    supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("role", "faculty"),
    supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("role", "student"),
    supabase.from("top_bookmarked_theses").select("*").limit(10),
  ]);

  return {
    totalRequests: totalRequests ?? 0,
    pendingRequests: pendingRequests ?? 0,
    totalUsers: totalUsers ?? 0,
    totalAdvisers: totalAdvisers ?? 0,
    totalStudents: totalStudents ?? 0,
    topBookmarked: topBookmarked ?? [],
  };
}
