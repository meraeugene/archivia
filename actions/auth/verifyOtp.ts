"use server";

import { createClient } from "@/utils/supabase/server";

export async function verifyOtp(email: string, otpCode: string) {
  const supabase = await createClient();

  // Step 1: Get user by email
  const { data: user, error: userError } = await supabase
    .from("user_profiles")
    .select("user_id")
    .eq("email", email)
    .single();

  if (userError || !user) {
    return { success: false, error: "Email not found." };
  }

  // Step 2: Get OTP for this user (regardless of expiry)
  const { data: otpEntry, error: otpError } = await supabase
    .from("user_otps")
    .select("*")
    .eq("user_id", user.user_id)
    .eq("otp", otpCode)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (otpError || !otpEntry) {
    return {
      success: false,
      error: "Invalid OTP. Please enter the correct code.",
    };
  }

  // Step 3: Check if OTP has expired
  const now = new Date();
  if (new Date(otpEntry.expires_at) < now) {
    return { success: false, error: "OTP has expired." };
  }

  // Step 4: Delete OTP so it can't be reused
  await supabase.from("user_otps").delete().eq("id", otpEntry.id);

  return { success: true, message: "OTP verified successfully!" };
}
