"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowRight, Trash2 } from "lucide-react";
import type { Referral, ReferralStatus } from "@/lib/types";
import { formatDateTime } from "@/lib/format";
import { useConfirmDialog } from "./ConfirmDialog";

const STATUSES: ReferralStatus[] = ["pending", "contacted", "rewarded"];
const FILTERS = ["all", ...STATUSES] as const;

export function ReferralsTable({ referrals }: { referrals: Referral[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { confirm, dialog } = useConfirmDialog();

  const filtered = useMemo(
    () => (filter === "all" ? referrals : referrals.filter((r) => r.status === filter)),
    [referrals, filter]
  );

  async function updateStatus(id: string, status: ReferralStatus) {
    setError(null);
    setBusyId(id);
    try {
      const res = await fetch(`/api/referrals/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? `Update failed (${res.status})`);
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed. Please try again.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(id: string, code: string) {
    if (!(await confirm(`Delete referral "${code}"? This cannot be undone.`))) return;
    setError(null);
    setBusyId(id);
    try {
      const res = await fetch(`/api/referrals/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? `Delete failed (${res.status})`);
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed. Please try again.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold capitalize transition-colors ${
              filter === f ? "bg-navy-900 text-white" : "bg-white text-navy-900/60 hover:bg-navy-900/5"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-3">
        {filtered.map((r) => (
          <div key={r.id} className="rounded-2xl border border-navy-900/8 bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <span className="inline-block rounded-lg bg-gold-500/10 px-2.5 py-1 font-mono text-xs font-semibold tracking-widest text-gold-700">
                  {r.code}
                </span>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                  <span className="font-display font-semibold text-navy-900">{r.referrerName}</span>
                  <span className="text-navy-900/40">{r.referrerPhone}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-navy-900/30" />
                  <span className="font-display font-semibold text-navy-900">{r.referredName}</span>
                  <span className="text-navy-900/40">{r.referredPhone}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={r.status}
                  disabled={busyId === r.id}
                  onChange={(e) => updateStatus(r.id, e.target.value as ReferralStatus)}
                  className="rounded-lg border border-navy-900/10 bg-ivory-50 px-2.5 py-1.5 text-xs font-semibold capitalize text-navy-900 outline-none"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <button
                  onClick={() => handleDelete(r.id, r.code)}
                  disabled={busyId === r.id}
                  className="rounded-lg p-2 text-navy-900/40 hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                  aria-label="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            {r.message && <p className="mt-3 text-sm text-navy-900/70">{r.message}</p>}
            <p className="mt-3 text-xs text-navy-900/35">{formatDateTime(r.createdAt)}</p>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="rounded-2xl border border-dashed border-navy-900/15 py-12 text-center text-sm text-navy-900/40">
            No referrals in this category.
          </p>
        )}
      </div>
      {dialog}
    </div>
  );
}
