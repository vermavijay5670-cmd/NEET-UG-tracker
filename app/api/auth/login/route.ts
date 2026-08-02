import { NextResponse } from "next/server";
import { signInWithEmailPassword, getAuthCookieOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body?.email || "").trim();
    const password = String(body?.password || "");

    const result = await signInWithEmailPassword(email, password);
    const response = NextResponse.json({ ok: true, user: result.user });

    response.cookies.set("sb-access-token", result.session.access_token, {
      ...getAuthCookieOptions(),
      maxAge: 60 * 60 * 24 * 7,
    });
    response.cookies.set("sb-refresh-token", result.session.refresh_token, {
      ...getAuthCookieOptions(),
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch (error) {
    return NextResponse.json({ ok: false, message: error instanceof Error ? error.message : "Login failed" }, { status: 401 });
  }
}
