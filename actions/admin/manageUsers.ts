"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { isValidEmail } from "@/utils/isValidEmail";
import bcrypt from "bcryptjs";
import { getSession } from "../auth/getSession";

export async function getAllUsers({
  page = 1,
  limit = 10,
  search = "",
  sortBy = "newest",
}: {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
}) {
  const supabase = await createClient();
  const session = await getSession();

  if (!session?.sub || session.role !== "admin") {
    throw new Error("Unauthorized");
  }

  const start = (page - 1) * limit;
  const end = start + limit - 1;

  let query = supabase
    .from("manage_users_view")
    .select("id, user_id, role, created_at, full_name, email", {
      count: "exact",
    });

  // Search filter
  if (search) {
    query = query.or(
      `user_id.ilike.%${search}%,full_name.ilike.%${search}%,email.ilike.%${search}%`
    );
  }

  // Sorting
  if (sortBy === "newest")
    query = query.order("created_at", { ascending: false });
  else if (sortBy === "oldest")
    query = query.order("created_at", { ascending: true });
  else if (sortBy === "role") query = query.order("role", { ascending: true });
  else if (sortBy === "name")
    query = query.order("full_name", { ascending: true });

  // Pagination
  const { data, error, count } = await query.range(start, end);

  if (error) throw new Error(error.message);

  return {
    users: data || [],
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  };
}

export async function addUser({
  user_id,
  password,
  role,
  full_name,
  email,
}: {
  user_id: string;
  password: string;
  role: string;
  full_name: string;
  email: string;
}) {
  if (!isValidEmail(email)) {
    throw new Error("Invalid email address");
  }

  const supabase = await createClient();
  const session = await getSession();

  if (!session?.sub || session.role !== "admin") {
    throw new Error("Unauthorized");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Step 1: Create user in 'users'
  const { data: userData, error: userError } = await supabase
    .from("users")
    .insert([{ user_id, password: hashedPassword, role }])
    .select("id")
    .single();

  if (userError) throw new Error(userError.message);
  const newUserId = userData.id;

  // Step 2: Create profile in 'user_profiles'
  const { error: profileError } = await supabase
    .from("user_profiles")
    .insert([{ user_id: newUserId, full_name, email }]);

  if (profileError) throw new Error(profileError.message);

  revalidatePath("/manage-users");
}
export async function editUser({
  id,
  password,
  full_name,
  email,
  role,
}: {
  id: string;
  password?: string;
  full_name: string;
  email: string;
  role: string;
}) {
  const supabase = await createClient();
  const session = await getSession();

  if (!session?.sub || session.role !== "admin") {
    throw new Error("Unauthorized");
  }

  if (email && !isValidEmail(email)) {
    throw new Error("Invalid email address");
  }

  // Step 1: Update role and optionally password in 'users' table
  const updateData: Partial<{ role: string; password: string }> = { role };

  if (password && password.trim() !== "") {
    updateData.password = await bcrypt.hash(password, 10);
  }

  const { error: userError } = await supabase
    .from("users")
    .update(updateData)
    .eq("id", id);

  if (userError) throw new Error(userError.message);

  // Step 2: Update full_name and email in 'user_profiles' table
  const { error: profileError } = await supabase
    .from("user_profiles")
    .update({ full_name, email })
    .eq("user_id", id);

  if (profileError) throw new Error(profileError.message);

  revalidatePath("/manage-users");
}

export async function deleteUser(id: string) {
  const supabase = await createClient();
  const session = await getSession();

  if (!session?.sub || session.role !== "admin") {
    throw new Error("Unauthorized");
  }

  // Prevent deleting own account
  if (session.sub === id) {
    throw new Error("You cannot delete your own account.");
  }

  const { error } = await supabase.from("users").delete().eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/manage-users");
}
