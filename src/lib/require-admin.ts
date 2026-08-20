import { NextRequest } from "next/server";
import { verifySessionToken, SESSION_COOKIE_NAME } from "./auth";

export async function isAdminRequest(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}
