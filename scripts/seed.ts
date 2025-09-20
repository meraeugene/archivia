import { hashPassword } from "@/lib/hash";
import { supabase } from "@/utils/supabase/seedClient";

async function seed() {
  const users = [
    {
      user_id: "admin",
      password: "admin",
      role: "admin",
      profile: {
        first_name: "Admin",
        last_name: "User",
        email: "admin@example.com",
        profile_picture: null,
      },
    },
    {
      user_id: "1234567",
      password: "1234567",
      role: "faculty",
      profile: {
        first_name: "Johny",
        last_name: "Bobby",
        email: "johny.bobby@school.edu",
        profile_picture: null,
      },
    },
    {
      user_id: "2022304365",
      password: "2022304365",
      role: "student",
      profile: {
        first_name: "Andrew",
        last_name: "Villalon",
        email: "andrew.villalon@student.edu",
        profile_picture: null,
      },
    },
  ];

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
        first_name: user.profile.first_name,
        last_name: user.profile.last_name,
        email: user.profile.email,
        profile_picture: user.profile.profile_picture,
      });

    if (profileError)
      console.error("❌ Error inserting profile:", profileError);
    else console.log(`✅ Seeded ${user.user_id} with profile`);
  }

  process.exit(0);
}

seed();
