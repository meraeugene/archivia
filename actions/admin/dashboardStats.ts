"use server";

import { createClient } from "@/utils/supabase/server";

export async function getAdminDashboardStats() {
  const supabase = await createClient();

  // --- BASIC COUNTS ---
  const [
    { count: totalRequests },
    { count: pendingRequests },
    { count: totalUsers },
    { count: totalAdvisers },
    { count: totalStudents },
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
  ]);

  // --- DASHBOARD CHART DATA ---
  const [thesisUploads, userDistribution, topBookmarked, newUsers] =
    await Promise.all([
      supabase.from("thesis_uploads_per_month").select("*"),
      supabase.from("user_distribution").select("*"),
      supabase.from("top_bookmarked_theses").select("*"),
      supabase.from("new_users_per_month").select("*"),
    ]);

  return {
    // Summary Cards
    totalRequests: totalRequests ?? 0,
    pendingRequests: pendingRequests ?? 0,
    totalUsers: totalUsers ?? 0,
    totalAdvisers: totalAdvisers ?? 0,
    totalStudents: totalStudents ?? 0,

    // Chart Data
    thesisUploads: thesisUploads.data ?? [],
    userDistribution: userDistribution.data ?? [],
    topBookmarked: topBookmarked.data ?? [],
    newUsers: newUsers.data ?? [],
  };
}
