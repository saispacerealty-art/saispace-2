"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const POLL_INTERVAL_MS = 15000;

export function LiveSync() {
  const router = useRouter();
  const versionRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function checkForUpdates() {
      try {
        const res = await fetch("/api/content-version", { cache: "no-store" });
        if (!res.ok) return;
        const { version } = (await res.json()) as { version: string };

        if (cancelled) return;

        if (versionRef.current === null) {
          versionRef.current = version;
          return;
        }

        if (version !== versionRef.current) {
          versionRef.current = version;
          router.refresh();
        }
      } catch {
        // Network hiccup — just try again on the next interval.
      }
    }

    checkForUpdates();
    const id = setInterval(checkForUpdates, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [router]);

  return null;
}
