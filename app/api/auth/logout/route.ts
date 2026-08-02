import { NextResponse } from "next/server";
import { signOutServer, getAuthCookieOptions } from "@/lib/auth";

export async function POST() {
  try {
    await signOutServer();
  } catch {
    // Continue even if the sign-out request fails so the client is logged out locally.
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set("sb-access-token", "", { ...getAuthCookieOptions(), maxAge: 0 });
  response.cookies.set("sb-refresh-token", "", { ...getAuthCookieOptions(), maxAge: 0 });
  return response;
}
