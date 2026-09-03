"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Pencil, Trash2, Search, Star, AlertCircle } from "lucide-react";
import type { Property } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { useConfirmDialog } from "./ConfirmDialog";

export function PropertiesTable({ properties }: { properties: Property[] }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { confirm, dialog } = useConfirmDialog();

  const filtered = useMemo(() => {
    const term = q.toLowerCase().trim();
    if (!term) return properties;
    return properties.filter((p) =>
      [p.title, p.city, p.locality, p.type].some((f) => f.toLowerCase().includes(term))
    );
  }, [properties, q]);

  async function handleDelete(id: string, title: string) {
    if (!(await confirm(`Delete "${title}"? This cannot be undone.`))) return;
    setError(null);
    setDeletingId(id);
    try {
      const res = await fetch(`/api/properties/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? `Delete failed (${res.status})`);
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="rounded-2xl border border-navy-900/8 bg-white">
      {error && (
        <div className="flex items-center gap-2 border-b border-red-100 bg-red-50 px-4 py-2.5 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}
      <div className="flex items-center gap-2 border-b border-navy-900/8 p-4">
        <Search className="h-4 w-4 text-navy-900/40" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search properties by title, city or type"
          className="w-full bg-transparent text-sm text-navy-900 outline-none placeholder:text-navy-900/40"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-navy-900/8 text-xs uppercase tracking-wide text-navy-900/40">
              <th className="px-4 py-3 font-semibold">Property</th>
              <th className="px-4 py-3 font-semibold">Type</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Price</th>
              <th className="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-900/6">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-ivory-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-navy-100">
                      {p.images[0] && <Image src={p.images[0]} alt={p.title} fill sizes="64px" className="object-cover" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 font-medium text-navy-900">
                        {p.title}
                        {p.featured && <Star className="h-3.5 w-3.5 fill-gold-500 text-gold-500" />}
                      </div>
                      <div className="text-xs text-navy-900/50">{p.locality}, {p.city}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-navy-900/70">{p.type}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      p.status === "For Sale"
                        ? "bg-navy-900/5 text-navy-900"
                        : p.status === "For Rent"
                        ? "bg-gold-500/10 text-gold-700"
                        : "bg-emerald-50 text-emerald-600"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-3 font-semibold text-navy-900">{formatPrice(p.price, p.priceUnit)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/admin/properties/${p.id}/edit`}
                      className="rounded-lg p-2 text-navy-900/50 hover:bg-navy-900/5 hover:text-navy-900"
                      aria-label="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id, p.title)}
                      disabled={deletingId === p.id}
                      className="rounded-lg p-2 text-navy-900/50 hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="py-12 text-center text-sm text-navy-900/40">No properties match your search.</p>
        )}
      </div>
      {dialog}
    </div>
  );
}
