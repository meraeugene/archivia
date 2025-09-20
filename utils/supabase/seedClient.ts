// imported dotenv because without it process.env.* variables from .env.local
// won't be available when running this script with tsx (outside Next.js runtime)
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";

// ⚠️ Using the Service Role key here instead of the anon key because seeding
// requires full access to bypass Row Level Security (RLS).
// The service role key must NEVER be exposed to client-side code.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
);

// to run script : npx tsx scripts/seed.ts
