import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { signOutServer, getAuthCookieOptions } from "@/lib/auth";

export async function POST() {
  try {
    await signOutServer();
  } catch {
    // Continue so the client is logged out locally regardless.
  }

  const response = NextResponse.json({ ok: true });
  const store = await cookies();

  // The real Supabase cookie is sb-<project-ref>-auth-token (plus .0/.1 chunks
  // and code-verifier variants) — the old hardcoded names never existed.
  for (const cookie of store.getAll()) {
    if (cookie.name.startsWith("sb-") && cookie.name.includes("auth-token")) {
      response.cookies.set(cookie.name, "", { ...getAuthCookieOptions(), maxAge: 0 });
    }
  }

  return response;
}
