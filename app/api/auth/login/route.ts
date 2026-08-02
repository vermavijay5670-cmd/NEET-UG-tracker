import { NextResponse } from "next/server";
import { signInWithEmailPassword } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body?.email || "").trim();
    const password = String(body?.password || "");

    const result = await signInWithEmailPassword(email, password);
    return NextResponse.json({ ok: true, user: result.user });
  } catch (error) {
    return NextResponse.json({ ok: false, message: error instanceof Error ? error.message : "Login failed" }, { status: 401 });
  }
}
