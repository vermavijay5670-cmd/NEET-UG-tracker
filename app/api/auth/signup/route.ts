import { NextResponse } from "next/server";
import { signUpWithEmailPassword } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body?.email || "").trim().toLowerCase();
    const password = String(body?.password || "");
    const name = String(body?.name || "").trim();

    if (!email || !password) {
      return NextResponse.json({ ok: false, message: "Email and password are required." }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ ok: false, message: "Password must be at least 6 characters." }, { status: 400 });
    }

    const result = await signUpWithEmailPassword(email, password, name);

    return NextResponse.json({
      ok: true,
      user: result.user,
      needsConfirmation: result.needsConfirmation,
      message: result.needsConfirmation
        ? "Account created. Check your inbox to confirm your email, then sign in."
        : "Account created.",
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Signup failed" },
      { status: 400 },
    );
  }
}
