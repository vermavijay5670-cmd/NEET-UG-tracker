import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { NextRequest, NextResponse } from "next/server";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

function getEnv(name: string) {
  const candidates = [
    process.env[name],
    process.env[`NEXT_PUBLIC_${name}`],
    name === "SUPABASE_PUBLISHABLE_KEY" ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY : undefined,
    name === "SUPABASE_SECRET_KEY" ? process.env.SUPABASE_SERVICE_ROLE_KEY : undefined,
    name === "SUPABASE_URL" ? process.env.NEXT_PUBLIC_SUPABASE_URL : undefined,
  ];

  for (const value of candidates) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

export function getAuthCookieOptions(): CookieOptions {
  return {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  };
}

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(getEnv("SUPABASE_URL"), getEnv("SUPABASE_PUBLISHABLE_KEY"), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, { ...getAuthCookieOptions(), ...options }),
          );
        } catch {
          // Called from a Server Component render — cookies are read-only there.
        }
      },
    },
  });
}

export async function createSupabaseAdminClient() {
  const { createClient } = await import("@supabase/supabase-js");
  return createClient(getEnv("SUPABASE_URL"), getEnv("SUPABASE_SECRET_KEY"), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function toAuthUser(user: {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, unknown> | null;
  created_at?: string;
}): AuthUser {
  return {
    id: user.id,
    email: user.email || "",
    name: (user.user_metadata?.full_name as string) || "",
    createdAt: user.created_at || new Date().toISOString(),
  };
}

export async function signInWithEmailPassword(email: string, password: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // Surface the real cause instead of a generic failure.
    if (error.message.toLowerCase().includes("not confirmed")) {
      throw new Error("Your email isn't confirmed yet. Check your inbox for the confirmation link.");
    }
    throw new Error(error.message);
  }
  if (!data.session || !data.user) throw new Error("Invalid email or password");

  return { user: toAuthUser(data.user), session: data.session };
}

export async function signUpWithEmailPassword(email: string, password: string, name?: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: name || "" } },
  });

  if (error) throw new Error(error.message);
  if (!data.user) throw new Error("Sign-up failed. Please try again.");

  // No session => email confirmation is enabled. This is a SUCCESS, not an error.
  return {
    user: toAuthUser(data.user),
    session: data.session,
    needsConfirmation: !data.session,
  };
}

export async function signOutServer() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
}

export async function getAuthenticatedUser(): Promise<AuthUser | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return toAuthUser(data.user);
}

/**
 * Middleware-safe session check. Unlike the old version this uses getUser()
 * (which revalidates and refreshes) and writes rotated cookies onto the
 * outgoing response, so long-lived sessions no longer get bounced to /auth.
 */
export async function getUserFromRequest(request: NextRequest, response: NextResponse) {
  const supabase = createServerClient(getEnv("SUPABASE_URL"), getEnv("SUPABASE_PUBLISHABLE_KEY"), {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          response.cookies.set(name, value, { ...getAuthCookieOptions(), ...options });
        });
      },
    },
  });

  try {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) return null;
    return data.user;
  } catch {
    return null;
  }
}
