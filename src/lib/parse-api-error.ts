/**
 * Reads the {error, code} JSON body API routes return on failure (see
 * src/lib/api-errors.ts) and formats it for display. Falls back gracefully
 * if the response has no JSON body at all (a truly unhandled exception, or
 * a proxy/host-level error page).
 */
export async function parseApiError(res: Response, fallback: string): Promise<string> {
  const data = await res.json().catch(() => null);
  if (data?.error) {
    return data.code ? `[${data.code}] ${data.error}` : data.error;
  }
  return `${fallback} (HTTP ${res.status})`;
}
