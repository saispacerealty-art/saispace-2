"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Phone, Trash2 } from "lucide-react";
import type { Inquiry, InquiryStatus } from "@/lib/types";
import { formatDateTime } from "@/lib/format";

const STATUSES: InquiryStatus[] = ["new", "contacted", "closed"];
const FILTERS = ["all", ...STATUSES] as const;

export function InquiriesTable({ inquiries }: { inquiries: Inquiry[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");
  const [busyId, setBusyId] = useState<string | null>(null);

  const filtered = useMemo(
    () => (filter === "all" ? inquiries : inquiries.filter((i) => i.status === filter)),
    [inquiries, filter]
  );

  async function updateStatus(id: string, status: InquiryStatus) {
    setBusyId(id);
    try {
      await fetch(`/api/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Delete inquiry from "${name}"?`)) return;
    setBusyId(id);
    try {
      await fetch(`/api/inquiries/${id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
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
        {filtered.map((i) => (
          <div key={i.id} className="rounded-2xl border border-navy-900/8 bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-display text-base font-semibold text-navy-900">{i.name}</p>
                <p className="text-xs text-navy-900/50">{i.propertyTitle ?? "General inquiry"}</p>
                <div className="mt-2 flex flex-wrap gap-4 text-xs text-navy-900/60">
                  <a href={`tel:${i.phone}`} className="flex items-center gap-1.5 hover:text-navy-900">
                    <Phone className="h-3.5 w-3.5 text-gold-600" /> {i.phone}
                  </a>
                  {i.email && (
                    <a href={`mailto:${i.email}`} className="flex items-center gap-1.5 hover:text-navy-900">
                      <Mail className="h-3.5 w-3.5 text-gold-600" /> {i.email}
                    </a>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={i.status}
                  disabled={busyId === i.id}
                  onChange={(e) => updateStatus(i.id, e.target.value as InquiryStatus)}
                  className="rounded-lg border border-navy-900/10 bg-ivory-50 px-2.5 py-1.5 text-xs font-semibold capitalize text-navy-900 outline-none"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <button
                  onClick={() => handleDelete(i.id, i.name)}
                  disabled={busyId === i.id}
                  className="rounded-lg p-2 text-navy-900/40 hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                  aria-label="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            {i.message && <p className="mt-3 text-sm text-navy-900/70">{i.message}</p>}
            <p className="mt-3 text-xs text-navy-900/35">{formatDateTime(i.createdAt)}</p>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="rounded-2xl border border-dashed border-navy-900/15 py-12 text-center text-sm text-navy-900/40">
            No inquiries in this category.
          </p>
        )}
      </div>
    </div>
  );
}
