import { NextRequest, NextResponse } from "next/server";
import { createSessionToken, validateCredentials, SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from "@/lib/auth";
import { apiError, apiErrorFromException } from "@/lib/api-errors";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json().catch(() => ({ username: "", password: "" }));

  if (typeof username !== "string" || typeof password !== "string" || !validateCredentials(username, password)) {
    return apiError("UNAUTHORIZED", "Invalid username or password.", 401);
  }

  try {
    const token = await createSessionToken(username);
    const res = NextResponse.json({ ok: true });
    res.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_MAX_AGE_SECONDS,
    });
    return res;
  } catch (err) {
    return apiErrorFromException(err, "POST /api/auth/login");
  }
}
