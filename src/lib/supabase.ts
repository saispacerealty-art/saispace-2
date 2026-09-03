import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

const MAX_RETRIES = 3;

/**
 * Supabase occasionally rejects the very first request from a freshly
 * created client with "JWT issued at future" — a transient cold-start race,
 * not real clock drift (seen locally and on Vercel, always recovers
 * immediately on retry). Retry that specific error a few times with a short
 * backoff instead of letting it fail a page render or build.
 */
async function fetchWithRetry(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  let lastResponse: Response | null = null;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const res = await fetch(input, init);
    if (res.ok) return res;

    const isJwtClockSkew = await res
      .clone()
      .text()
      .then((body) => body.includes("JWT issued at future"))
      .catch(() => false);

    if (!isJwtClockSkew || attempt === MAX_RETRIES) return res;

    lastResponse = res;
    await new Promise((resolve) => setTimeout(resolve, 200 * (attempt + 1)));
  }
  return lastResponse as Response;
}

export function getSupabase(): SupabaseClient {
  if (!client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !serviceRoleKey) {
      throw new Error("Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
    }
    client = createClient(url, serviceRoleKey, {
      auth: { persistSession: false },
      global: { fetch: fetchWithRetry },
    });
  }
  return client;
}
