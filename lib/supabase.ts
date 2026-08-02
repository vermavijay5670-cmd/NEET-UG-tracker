import { createClient } from "@supabase/supabase-js";

function getEnv(name: string) {
  const candidates = [
    process.env[name],
    process.env[`NEXT_PUBLIC_${name}`],
    name === "SUPABASE_PUBLISHABLE_KEY" ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY : undefined,
    name === "SUPABASE_URL" ? process.env.NEXT_PUBLIC_SUPABASE_URL : undefined,
  ];

  for (const value of candidates) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
}

const supabaseUrl = getEnv("SUPABASE_URL");
const supabaseAnonKey = getEnv("SUPABASE_PUBLISHABLE_KEY");

export function createBrowserSupabaseClient() {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });
}
