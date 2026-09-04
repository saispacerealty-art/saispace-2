"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, Save, Upload, X } from "lucide-react";
import type { Project, ProjectStatus } from "@/lib/types";
import { parseApiError } from "@/lib/parse-api-error";

const STATUSES: ProjectStatus[] = ["Under Construction", "Ready to Move", "New Launch"];

export function ProjectForm({ project }: { project?: Project }) {
  const router = useRouter();
  const isEdit = Boolean(project);
  const [form, setForm] = useState({
    name: project?.name ?? "",
    location: project?.location ?? "",
    detail: project?.detail ?? "",
    status: project?.status ?? ("Under Construction" as ProjectStatus),
    description: project?.description ?? "",
    image: project?.image ?? "",
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
      if (!res.ok) throw new Error(await parseApiError(res, "Upload failed"));
      const data = await res.json();
      update("image", data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Image failed to upload.");
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
      const res = await fetch(isEdit ? `/api/projects/${project!.id}` : "/api/projects", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(await parseApiError(res, "Save failed"));
      router.push("/admin/projects");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong while saving. Please try again.");
      setSaving(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-navy-900/10 bg-ivory-50 px-4 py-2.5 text-sm text-navy-900 outline-none focus:border-gold-500";
  const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-navy-900/50";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="rounded-2xl border border-navy-900/8 bg-white p-6">
        <h2 className="font-display text-lg font-semibold text-navy-900">Project Details</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Name</label>
            <input required value={form.name} onChange={(e) => update("name", e.target.value)} className={inputClass} placeholder="e.g. Sai Aurum Heights" />
          </div>
          <div>
            <label className={labelClass}>Location</label>
            <input required value={form.location} onChange={(e) => update("location", e.target.value)} className={inputClass} placeholder="Wakad, Pune" />
          </div>
          <div>
            <label className={labelClass}>Detail</label>
            <input value={form.detail} onChange={(e) => update("detail", e.target.value)} className={inputClass} placeholder="2 & 3 BHK residences" />
          </div>
          <div>
            <label className={labelClass}>Status</label>
            <select value={form.status} onChange={(e) => update("status", e.target.value as ProjectStatus)} className={inputClass}>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Description</label>
            <textarea rows={4} value={form.description} onChange={(e) => update("description", e.target.value)} className={inputClass} placeholder="Describe the project..." />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-navy-900/8 bg-white p-6">
        <h2 className="font-display text-lg font-semibold text-navy-900">Cover Image</h2>
        <label className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-navy-900/15 bg-ivory-50 px-6 py-8 text-sm font-medium text-navy-900/60 hover:border-gold-500 hover:text-navy-900">
          {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
          {uploading ? "Uploading..." : "Click to upload an image"}
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" disabled={uploading} />
        </label>
        {form.image && (
          <div className="group relative mt-4 aspect-video w-full max-w-sm overflow-hidden rounded-lg bg-navy-100">
            <Image src={form.image} alt="Project" fill sizes="400px" className="object-cover" />
            <button
              type="button"
              onClick={() => update("image", "")}
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
          {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Project"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/projects")}
          className="rounded-xl border border-navy-900/10 px-6 py-3 text-sm font-semibold text-navy-900/70 hover:bg-navy-900/5"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
