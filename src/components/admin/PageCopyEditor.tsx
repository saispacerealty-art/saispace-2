"use client";

import { useState } from "react";
import { Loader2, Save, CheckCircle2 } from "lucide-react";
import type { PageCopy } from "@/lib/types";

export function PageCopyEditor({
  copy,
  title,
  description,
  fields,
}: {
  copy: PageCopy;
  title: string;
  description?: string;
  fields: { key: keyof PageCopy; label: string; type?: "text" | "textarea" }[];
}) {
  const [form, setForm] = useState(copy);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function update(key: keyof PageCopy, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const subset: Partial<PageCopy> = {};
      for (const f of fields) subset[f.key] = form[f.key];
      await fetch("/api/page-copy", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subset),
      });
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-navy-900/10 bg-ivory-50 px-4 py-2.5 text-sm text-navy-900 outline-none focus:border-gold-500";
  const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-navy-900/50";

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-navy-900/8 bg-white p-6">
      <h2 className="font-display text-lg font-semibold text-navy-900">{title}</h2>
      {description && <p className="mt-1 text-sm text-navy-900/50">{description}</p>}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {fields.map((f) => (
          <div key={f.key} className={f.type === "textarea" ? "sm:col-span-2" : undefined}>
            <label className={labelClass}>{f.label}</label>
            {f.type === "textarea" ? (
              <textarea
                rows={3}
                value={String(form[f.key] ?? "")}
                onChange={(e) => update(f.key, e.target.value)}
                className={inputClass}
              />
            ) : (
              <input
                value={String(form[f.key] ?? "")}
                onChange={(e) => update(f.key, e.target.value)}
                className={inputClass}
              />
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-navy-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-800 disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "Saving..." : "Save"}
        </button>
        {saved && (
          <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
            <CheckCircle2 className="h-4 w-4" /> Saved
          </span>
        )}
      </div>
    </form>
  );
}
