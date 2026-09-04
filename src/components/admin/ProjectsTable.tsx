"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Pencil, Trash2, AlertCircle } from "lucide-react";
import type { Project } from "@/lib/types";
import { parseApiError } from "@/lib/parse-api-error";
import { useConfirmDialog } from "./ConfirmDialog";

const STATUS_STYLES: Record<Project["status"], string> = {
  "Under Construction": "bg-gold-500/10 text-gold-700",
  "Ready to Move": "bg-emerald-50 text-emerald-600",
  "New Launch": "bg-navy-900/5 text-navy-900",
};

export function ProjectsTable({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { confirm, dialog } = useConfirmDialog();

  async function handleDelete(id: string, name: string) {
    if (!(await confirm(`Delete "${name}"? This cannot be undone.`))) return;
    setError(null);
    setDeletingId(id);
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (!res.ok) {
        throw new Error(await parseApiError(res, "Delete failed"));
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-navy-900/8 bg-white">
      {error && (
        <div className="flex items-center gap-2 border-b border-red-100 bg-red-50 px-4 py-2.5 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-navy-900/8 text-xs uppercase tracking-wide text-navy-900/40">
            <th className="px-4 py-3 font-semibold">Name</th>
            <th className="px-4 py-3 font-semibold">Location</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-navy-900/6">
          {projects.map((p) => (
            <tr key={p.id} className="hover:bg-ivory-50">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-navy-100">
                    {p.image && <Image src={p.image} alt={p.name} fill sizes="64px" className="object-cover" />}
                  </div>
                  <div>
                    <div className="font-medium text-navy-900">{p.name}</div>
                    <div className="text-xs text-navy-900/50">{p.detail}</div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-navy-900/70">{p.location}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[p.status]}`}>{p.status}</span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  <Link href={`/admin/projects/${p.id}/edit`} className="rounded-lg p-2 text-navy-900/50 hover:bg-navy-900/5 hover:text-navy-900" aria-label="Edit">
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(p.id, p.name)}
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
      {projects.length === 0 && <p className="py-12 text-center text-sm text-navy-900/40">No projects yet.</p>}
      {dialog}
    </div>
  );
}
