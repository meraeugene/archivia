"use server";

import { createClient } from "@/utils/supabase/server";
import { getSession } from "../auth/getSession";

export const getAdviserCurrentLeadersCount = async (): Promise<number> => {
  const supabase = await createClient();
  const session = await getSession();

  if (!session) return 0;

  if (session.role !== "faculty") {
    return 0;
  }

  const { data, error } = await supabase
    .from("adviser_current_leaders")
    .select("current_leaders")
    .eq("adviser_id", session.sub)
    .single();

  if (error || !data) {
    console.error("Error fetching adviser current leaders:", error?.message);
    return 0;
  }

  return data.current_leaders;
};

export const getAdviserRequestsCount = async () => {
  const supabase = await createClient();
  const session = await getSession();

  if (!session) return 0;

  if (session.role !== "faculty") {
    return 0;
  }

  const { count, error } = await supabase
    .from("adviser_requests_view")
    .select("*", { count: "exact", head: true })
    .eq("adviser_id", session.sub);

  if (error) {
    console.error("Error fetching adviser requests count:", error.message);
    return 0;
  }

  return count ?? 0;
};

export const getPendingAdviserRequestsCount = async () => {
  const supabase = await createClient();
  const session = await getSession();

  if (!session) return 0;

  if (session.role !== "faculty") {
    return 0;
  }

  const { count, error } = await supabase
    .from("adviser_requests_view")
    .select("*", { count: "exact", head: true })
    .eq("adviser_id", session.sub)
    .in("status", ["pending", "reserved", "referred"]);

  if (error) {
    console.error("Error fetching adviser requests count:", error.message);
    return 0;
  }

  return count ?? 0;
};

export const getThesisSubmissionCount = async (
  status?: "pending" | "approved" | "returned"
) => {
  const supabase = await createClient();
  const session = await getSession();

  if (!session?.sub) return 0;

  let query = supabase
    .from("thesis_submissions")
    .select("id", { count: "exact", head: true })
    .eq("adviser_id", session.sub);

  if (status) {
    query = query.eq("status", status);
  }

  const { count, error } = await query;

  if (error) {
    console.error("Error fetching thesis submission count:", error);
    return 0;
  }

  return count || 0;
};

export const getHandledThesisCount = async () => {
  const supabase = await createClient();
  const session = await getSession();

  if (session?.role !== "faculty") {
    return 0;
  }

  const { count, error } = await supabase
    .from("adviser_handled_theses_view")
    .select("*", { count: "exact", head: true })
    .eq("adviser_id", session.sub);

  if (error) {
    console.error("Error fetching handled thesis count:", error.message);
    return 0;
  }

  return count || 0;
};
