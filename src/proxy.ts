import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { SESSION_COOKIE } from "@/lib/auth/constants";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Keep login on the short /admin URL
  if (pathname === "/admin/login") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) {
    if (pathname === "/admin") {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
