import { NextResponse } from "next/server";
import { signUpWithEmailPassword } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body?.email || "").trim();
    const password = String(body?.password || "");
    const name = String(body?.name || "").trim();

    const result = await signUpWithEmailPassword(email, password, name);
    return NextResponse.json({ ok: true, user: result.user });
  } catch (error) {
    return NextResponse.json({ ok: false, message: error instanceof Error ? error.message : "Signup failed" }, { status: 400 });
  }
}
