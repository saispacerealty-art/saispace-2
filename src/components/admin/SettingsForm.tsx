"use client";

import { useState } from "react";
import { AlertCircle, Loader2, Save, CheckCircle2 } from "lucide-react";
import type { SiteSettings } from "@/lib/types";
import { parseApiError } from "@/lib/parse-api-error";

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [form, setForm] = useState(settings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  function updateSocial<K extends keyof SiteSettings["socials"]>(key: K, value: string) {
    setForm((f) => ({ ...f, socials: { ...f.socials, [key]: value } }));
    setSaved(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(await parseApiError(res, "Save failed"));
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-navy-900/10 bg-ivory-50 px-4 py-2.5 text-sm text-navy-900 outline-none focus:border-gold-500";
  const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-navy-900/50";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="rounded-2xl border border-navy-900/8 bg-white p-6">
        <h2 className="font-display text-lg font-semibold text-navy-900">Site Identity</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Site Name</label>
            <input value={form.siteName} onChange={(e) => update("siteName", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Tagline</label>
            <input value={form.tagline} onChange={(e) => update("tagline", e.target.value)} className={inputClass} />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-navy-900/8 bg-white p-6">
        <h2 className="font-display text-lg font-semibold text-navy-900">Homepage Hero</h2>
        <p className="mt-1 text-sm text-navy-900/50">Controls the headline shown at the top of your homepage.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelClass}>Hero Eyebrow</label>
            <input value={form.heroEyebrow} onChange={(e) => update("heroEyebrow", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Hero Title</label>
            <input value={form.heroTitle} onChange={(e) => update("heroTitle", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Hero Accent Line</label>
            <input value={form.heroAccent} onChange={(e) => update("heroAccent", e.target.value)} className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Hero Tagline</label>
            <textarea rows={2} value={form.heroTagline} onChange={(e) => update("heroTagline", e.target.value)} className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>About Text</label>
            <textarea rows={3} value={form.aboutText} onChange={(e) => update("aboutText", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Happy Clients (count)</label>
            <input type="number" min="0" value={form.happyClients} onChange={(e) => update("happyClients", Number(e.target.value))} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Years of Experience</label>
            <input type="number" min="0" value={form.yearsExperience} onChange={(e) => update("yearsExperience", Number(e.target.value))} className={inputClass} />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-navy-900/8 bg-white p-6">
        <h2 className="font-display text-lg font-semibold text-navy-900">Contact Information</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Phone</label>
            <input value={form.phone} onChange={(e) => update("phone", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>WhatsApp Number</label>
            <input value={form.whatsapp} onChange={(e) => update("whatsapp", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Office Hours</label>
            <input value={form.officeHours} onChange={(e) => update("officeHours", e.target.value)} className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Office Address</label>
            <input value={form.address} onChange={(e) => update("address", e.target.value)} className={inputClass} />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-navy-900/8 bg-white p-6">
        <h2 className="font-display text-lg font-semibold text-navy-900">Social Links</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Facebook</label>
            <input value={form.socials.facebook} onChange={(e) => updateSocial("facebook", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Instagram</label>
            <input value={form.socials.instagram} onChange={(e) => updateSocial("instagram", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>LinkedIn</label>
            <input value={form.socials.linkedin} onChange={(e) => updateSocial("linkedin", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>YouTube</label>
            <input value={form.socials.youtube} onChange={(e) => updateSocial("youtube", e.target.value)} className={inputClass} />
          </div>
        </div>
      </section>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-navy-900 px-6 py-3 text-sm font-semibold text-white hover:bg-navy-800 disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "Saving..." : "Save Settings"}
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
