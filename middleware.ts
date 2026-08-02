import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getUserFromRequest } from "@/lib/auth";

const protectedPaths = ["/today", "/study-log", "/planner", "/question-practice", "/dashboard"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Auth API routes must be able to set cookies themselves.
  if (pathname.startsWith("/api/auth")) return NextResponse.next();

  // IMPORTANT: this response object is what carries refreshed auth cookies.
  const response = NextResponse.next({ request });
  const user = await getUserFromRequest(request, response);

  const isProtected = protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  if (isProtected && !user) {
    const url = new URL("/auth", request.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (pathname === "/auth" && user) {
    return NextResponse.redirect(new URL("/today", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icons/|manifest.json).*)"],
};
