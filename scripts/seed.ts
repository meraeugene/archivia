import { users } from "@/data/users";
import { hashPassword } from "@/lib/hash";
import { supabase } from "@/utils/supabase/seedClient";

async function seed() {
  for (const user of users) {
    // 🔹 Make sure old user (and profile) is deleted first
    const { error: deleteError } = await supabase
      .from("users")
      .delete()
      .eq("user_id", user.user_id);

    if (deleteError) {
      console.error(`❌ Error deleting existing ${user.user_id}:`, deleteError);
    }

    // Hash password
    const password = await hashPassword(user.password);

    // Insert into users
    const { data, error } = await supabase
      .from("users")
      .insert({
        user_id: user.user_id,
        password,
        role: user.role,
      })
      .select("id") // get UUID id back
      .single();

    if (error) {
      console.error("❌ Error inserting user:", error);
      continue;
    }

    // Insert into user_profiles linked by user_id
    const { error: profileError } = await supabase
      .from("user_profiles")
      .insert({
        user_id: data.id, // FK to users.id
        full_name: user.profile.full_name,
        prefix: user.profile.prefix,
        suffix: user.profile.suffix,
        email: user.profile.email,
        profile_picture: user.profile.profile_picture,
        position: user.profile.position,
        bio: user.profile.bio,
        highest_educational_attainment:
          user.profile.highest_educational_attainment,
        research_interest: user.profile.research_interest,
        orcid: user.profile.orcid,
        handled_subjects: user.profile.handled_subjects,
      });

    if (profileError)
      console.error("❌ Error inserting profile:", profileError);
    else console.log(`✅ Seeded ${user.user_id} with profile`);
  }

  process.exit(0);
}

seed();
