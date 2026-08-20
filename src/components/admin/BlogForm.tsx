"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, Save, Upload, X } from "lucide-react";
import type { BlogPost } from "@/lib/types";

export function BlogForm({ post }: { post?: BlogPost }) {
  const router = useRouter();
  const isEdit = Boolean(post);
  const [form, setForm] = useState({
    title: post?.title ?? "",
    category: post?.category ?? "",
    excerpt: post?.excerpt ?? "",
    content: post?.content ?? "",
    coverImage: post?.coverImage ?? "",
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      update("coverImage", data.url);
    } catch {
      setError("Image failed to upload.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(isEdit ? `/api/posts/${post!.id}` : "/api/posts", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Save failed");
      router.push("/admin/blog");
      router.refresh();
    } catch {
      setError("Something went wrong while saving. Please try again.");
      setSaving(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-navy-900/10 bg-ivory-50 px-4 py-2.5 text-sm text-navy-900 outline-none focus:border-gold-500";
  const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-navy-900/50";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="rounded-2xl border border-navy-900/8 bg-white p-6">
        <h2 className="font-display text-lg font-semibold text-navy-900">Post Details</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelClass}>Title</label>
            <input required value={form.title} onChange={(e) => update("title", e.target.value)} className={inputClass} placeholder="e.g. Buying your first home in Pune" />
          </div>
          <div>
            <label className={labelClass}>Category</label>
            <input required value={form.category} onChange={(e) => update("category", e.target.value)} className={inputClass} placeholder="Buyer Guide" />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Excerpt</label>
            <textarea rows={2} value={form.excerpt} onChange={(e) => update("excerpt", e.target.value)} className={inputClass} placeholder="A short summary shown on the blog listing page" />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Content</label>
            <textarea rows={10} value={form.content} onChange={(e) => update("content", e.target.value)} className={inputClass} placeholder="Write the full article..." />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-navy-900/8 bg-white p-6">
        <h2 className="font-display text-lg font-semibold text-navy-900">Cover Image</h2>
        <label className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-navy-900/15 bg-ivory-50 px-6 py-8 text-sm font-medium text-navy-900/60 hover:border-gold-500 hover:text-navy-900">
          {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
          {uploading ? "Uploading..." : "Click to upload a cover image"}
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" disabled={uploading} />
        </label>
        {form.coverImage && (
          <div className="group relative mt-4 aspect-video w-full max-w-sm overflow-hidden rounded-lg bg-navy-100">
            <Image src={form.coverImage} alt="Cover" fill sizes="400px" className="object-cover" />
            <button
              type="button"
              onClick={() => update("coverImage", "")}
              className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </section>

      {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving || uploading}
          className="flex items-center gap-2 rounded-xl bg-navy-900 px-6 py-3 text-sm font-semibold text-white hover:bg-navy-800 disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "Saving..." : isEdit ? "Save Changes" : "Publish Post"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/blog")}
          className="rounded-xl border border-navy-900/10 px-6 py-3 text-sm font-semibold text-navy-900/70 hover:bg-navy-900/5"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
