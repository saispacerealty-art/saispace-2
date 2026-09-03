import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const isLoggedIn = await verifySessionToken(request.cookies.get(SESSION_COOKIE_NAME)?.value);
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
}

export const config = {
  matcher: ["/admin", "/admin/((?!login).*)"],
};
