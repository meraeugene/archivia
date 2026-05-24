"use server";

import { createClient } from "@/utils/supabase/server";
import { cache } from "react";

export const getAdminDashboardStats = cache(async () => {
  const supabase = await createClient();

  // Fetch all counts and top bookmarks in parallel
  const [
    totalRequestsRes,
    pendingRequestsRes,
    totalUsersRes,
    totalAdvisersRes,
    totalStudentsRes,
    topBookmarkedRes,
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

  // Extract counts safely
  const totalRequests = totalRequestsRes?.count ?? 0;
  const pendingRequests = pendingRequestsRes?.count ?? 0;
  const totalUsers = totalUsersRes?.count ?? 0;
  const totalAdvisers = totalAdvisersRes?.count ?? 0;
  const totalStudents = totalStudentsRes?.count ?? 0;
  const topBookmarked = topBookmarkedRes?.data ?? [];

  return {
    totalRequests,
    pendingRequests,
    totalUsers,
    totalAdvisers,
    totalStudents,
    topBookmarked,
  };
});
