"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import type { BlogPost } from "@/lib/types";
import { formatDate } from "@/lib/format";

export function BlogTable({ posts }: { posts: BlogPost[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string, title: string) {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      router.refresh();
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-navy-900/8 bg-white">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-navy-900/8 text-xs uppercase tracking-wide text-navy-900/40">
            <th className="px-4 py-3 font-semibold">Title</th>
            <th className="px-4 py-3 font-semibold">Category</th>
            <th className="px-4 py-3 font-semibold">Published</th>
            <th className="px-4 py-3 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-navy-900/6">
          {posts.map((p) => (
            <tr key={p.id} className="hover:bg-ivory-50">
              <td className="max-w-sm px-4 py-3 font-medium text-navy-900">{p.title}</td>
              <td className="px-4 py-3">
                <span className="rounded-full bg-gold-500/10 px-2.5 py-1 text-xs font-semibold text-gold-700">{p.category}</span>
              </td>
              <td className="px-4 py-3 text-navy-900/60">{formatDate(p.publishedAt)}</td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  <Link href={`/admin/blog/${p.id}/edit`} className="rounded-lg p-2 text-navy-900/50 hover:bg-navy-900/5 hover:text-navy-900" aria-label="Edit">
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
      {posts.length === 0 && <p className="py-12 text-center text-sm text-navy-900/40">No posts yet.</p>}
    </div>
  );
}
