import "server-only";
import { NextResponse } from "next/server";

/**
 * Every error an API route can return on purpose. Keep this list in sync
 * with the `apiError(...)` calls across src/app/api/** — it's the contract
 * the admin UI (see src/lib/parse-api-error.ts) matches against to show a
 * useful message instead of a bare status code.
 */
export type ApiErrorCode =
  | "UNAUTHORIZED"
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "UNKNOWN_SECTION"
  | "NO_FILE_PROVIDED"
  | "UNSUPPORTED_FILE_TYPE"
  | "FILE_TOO_LARGE"
  | "STORAGE_ERROR"
  | "DATABASE_ERROR"
  | "INTERNAL_ERROR";

export function apiError(code: ApiErrorCode, message: string, status: number) {
  return NextResponse.json({ error: message, code }, { status });
}

/**
 * Catches whatever a route handler's try block throws (a Supabase/Postgrest
 * error from src/lib/repository.ts, a malformed request body, anything
 * unexpected) and turns it into a coded JSON response. Without this, an
 * uncaught throw in a Route Handler falls through to Next's default error
 * page, which has no JSON body — the admin UI's `res.json()` calls then
 * fail silently and every failure looks like a generic, reason-less error.
 */
export function apiErrorFromException(err: unknown, context: string) {
  if (err instanceof SyntaxError) {
    console.error(`[API_ERROR][VALIDATION_ERROR] ${context}: malformed JSON body — ${err.message}`);
    return apiError("VALIDATION_ERROR", "Request body is not valid JSON.", 400);
  }

  const message = err instanceof Error ? err.message : "Unexpected error";
  const code: ApiErrorCode = /^\[[A-Z0-9]+\]/.test(message) ? "DATABASE_ERROR" : "INTERNAL_ERROR";
  console.error(`[API_ERROR][${code}] ${context}: ${message}`);
  return apiError(code, message, 500);
}
