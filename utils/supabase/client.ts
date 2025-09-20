import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  // ✅ In the browser we must use the anon key or publishable key, since it's safe to expose
  // and limited by Row Level Security (RLS).
  // ❌ Never use the service role key here, it would expose full database access.
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}
