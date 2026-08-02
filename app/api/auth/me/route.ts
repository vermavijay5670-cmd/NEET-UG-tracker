import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ ok: false, user: null }, { status: 401 });
    }

    return NextResponse.json({ ok: true, user });
  } catch {
    return NextResponse.json({ ok: false, user: null }, { status: 500 });
  }
}
