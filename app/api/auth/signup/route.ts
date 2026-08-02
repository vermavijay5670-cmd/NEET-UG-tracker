import { NextResponse } from "next/server";
import { signUpWithEmailPassword, getAuthCookieOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body?.email || "").trim();
    const password = String(body?.password || "");
    const name = String(body?.name || "").trim();

    const result = await signUpWithEmailPassword(email, password, name);
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
    return NextResponse.json({ ok: false, message: error instanceof Error ? error.message : "Signup failed" }, { status: 400 });
  }
}
