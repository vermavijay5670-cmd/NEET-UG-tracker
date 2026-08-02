import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

function getEnv(name: string) {
  const value = process.env[name];
  return value?.trim() || "";
}

function createSupabaseCookieOptions(): CookieOptions {
  return {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    httpOnly: true,
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
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Ignore if called during a request that is not allowed to write cookies.
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

export async function signInWithEmailPassword(email: string, password: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.session) {
    throw new Error(error?.message || "Invalid email or password");
  }

  return {
    user: {
      id: data.user.id,
      email: data.user.email || email,
      name: data.user.user_metadata?.full_name || "",
      createdAt: data.user.created_at || new Date().toISOString(),
    },
    session: data.session,
  };
}

export async function signUpWithEmailPassword(email: string, password: string, name?: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name || "" },
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.session || !data.user) {
    throw new Error("Please check your inbox to confirm the sign-up.");
  }

  return {
    user: {
      id: data.user.id,
      email: data.user.email || email,
      name: data.user.user_metadata?.full_name || name || "",
      createdAt: data.user.created_at || new Date().toISOString(),
    },
    session: data.session,
  };
}

export async function signOutServer() {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
}

export async function getAuthenticatedUser() {
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email || "",
    name: user.user_metadata?.full_name || "",
    createdAt: user.created_at || new Date().toISOString(),
  };
}

export async function getSessionFromRequest(request: NextRequest) {
  const cookieStore = request.cookies;
  const supabase = createServerClient(getEnv("SUPABASE_URL"), getEnv("SUPABASE_PUBLISHABLE_KEY"), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll() {
        // noop for middleware checks
      },
    },
  });

  try {
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session) {
      return null;
    }
    return data.session;
  } catch {
    return null;
  }
}

export function getAuthCookieOptions(): CookieOptions {
  return createSupabaseCookieOptions();
}

export function getTokenFromRequest(request: Request | NextRequest) {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(/(?:^|; )auth_token=([^;]+)/);
  return match?.[1] ? decodeURIComponent(match[1]) : null;
}

