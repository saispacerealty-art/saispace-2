"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, Save, Upload, X } from "lucide-react";
import type { Property, PropertyStatus, PropertyType } from "@/lib/types";

const TYPES: PropertyType[] = ["Residential", "Commercial", "Plot", "Villa", "Apartment"];
const STATUSES: PropertyStatus[] = ["For Sale", "For Rent", "Sold"];

type FormState = {
  title: string;
  type: PropertyType;
  status: PropertyStatus;
  price: string;
  priceUnit: "total" | "month";
  city: string;
  locality: string;
  address: string;
  bedrooms: string;
  bathrooms: string;
  areaSqft: string;
  description: string;
  featuresText: string;
  featured: boolean;
  images: string[];
};

function toFormState(p?: Property): FormState {
  return {
    title: p?.title ?? "",
    type: p?.type ?? "Apartment",
    status: p?.status ?? "For Sale",
    price: p?.price?.toString() ?? "",
    priceUnit: p?.priceUnit ?? "total",
    city: p?.city ?? "",
    locality: p?.locality ?? "",
    address: p?.address ?? "",
    bedrooms: p?.bedrooms?.toString() ?? "0",
    bathrooms: p?.bathrooms?.toString() ?? "0",
    areaSqft: p?.areaSqft?.toString() ?? "",
    description: p?.description ?? "",
    featuresText: p?.features?.join(", ") ?? "",
    featured: p?.featured ?? false,
    images: p?.images ?? [],
  };
}

export function PropertyForm({ property }: { property?: Property }) {
  const router = useRouter();
  const isEdit = Boolean(property);
  const [form, setForm] = useState<FormState>(toFormState(property));
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        if (!res.ok) throw new Error("Upload failed");
        const data = await res.json();
        uploaded.push(data.url);
      }
      update("images", [...form.images, ...uploaded]);
    } catch {
      setError("One or more images failed to upload.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function removeImage(url: string) {
    update("images", form.images.filter((i) => i !== url));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      title: form.title,
      type: form.type,
      status: form.status,
      price: Number(form.price) || 0,
      priceUnit: form.priceUnit,
      city: form.city,
      locality: form.locality,
      address: form.address,
      bedrooms: Number(form.bedrooms) || 0,
      bathrooms: Number(form.bathrooms) || 0,
      areaSqft: Number(form.areaSqft) || 0,
      description: form.description,
      features: form.featuresText
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean),
      featured: form.featured,
      images: form.images,
    };

    try {
      const res = await fetch(isEdit ? `/api/properties/${property!.id}` : "/api/properties", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Save failed");
      router.push("/admin/properties");
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
        <h2 className="font-display text-lg font-semibold text-navy-900">Basic Details</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelClass}>Title</label>
            <input required value={form.title} onChange={(e) => update("title", e.target.value)} className={inputClass} placeholder="e.g. Skyline Vista Penthouse" />
          </div>
          <div>
            <label className={labelClass}>Property Type</label>
            <select value={form.type} onChange={(e) => update("type", e.target.value as PropertyType)} className={inputClass}>
              {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Status</label>
            <select value={form.status} onChange={(e) => update("status", e.target.value as PropertyStatus)} className={inputClass}>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Price (₹)</label>
            <input required type="number" min="0" value={form.price} onChange={(e) => update("price", e.target.value)} className={inputClass} placeholder="18500000" />
          </div>
          <div>
            <label className={labelClass}>Price Unit</label>
            <select value={form.priceUnit} onChange={(e) => update("priceUnit", e.target.value as "total" | "month")} className={inputClass}>
              <option value="total">Total</option>
              <option value="month">Per Month</option>
            </select>
          </div>
          <div className="flex items-center gap-2 sm:col-span-2">
            <input
              id="featured"
              type="checkbox"
              checked={form.featured}
              onChange={(e) => update("featured", e.target.checked)}
              className="h-4 w-4 rounded border-navy-900/20 text-gold-600 focus:ring-gold-500"
            />
            <label htmlFor="featured" className="text-sm text-navy-900/70">Mark as featured on the homepage</label>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-navy-900/8 bg-white p-6">
        <h2 className="font-display text-lg font-semibold text-navy-900">Location</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>City</label>
            <input required value={form.city} onChange={(e) => update("city", e.target.value)} className={inputClass} placeholder="Pune" />
          </div>
          <div>
            <label className={labelClass}>Locality</label>
            <input required value={form.locality} onChange={(e) => update("locality", e.target.value)} className={inputClass} placeholder="Kalyani Nagar" />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Full Address</label>
            <input required value={form.address} onChange={(e) => update("address", e.target.value)} className={inputClass} placeholder="Tower B, Riverfront Residences" />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-navy-900/8 bg-white p-6">
        <h2 className="font-display text-lg font-semibold text-navy-900">Specifications</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <label className={labelClass}>Bedrooms</label>
            <input type="number" min="0" value={form.bedrooms} onChange={(e) => update("bedrooms", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Bathrooms</label>
            <input type="number" min="0" value={form.bathrooms} onChange={(e) => update("bathrooms", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Area (sq.ft)</label>
            <input required type="number" min="0" value={form.areaSqft} onChange={(e) => update("areaSqft", e.target.value)} className={inputClass} />
          </div>
        </div>
        <div className="mt-4">
          <label className={labelClass}>Description</label>
          <textarea rows={5} value={form.description} onChange={(e) => update("description", e.target.value)} className={inputClass} placeholder="Describe the property..." />
        </div>
        <div className="mt-4">
          <label className={labelClass}>Features (comma-separated)</label>
          <input value={form.featuresText} onChange={(e) => update("featuresText", e.target.value)} className={inputClass} placeholder="Private terrace, Smart home, Modular kitchen" />
        </div>
      </section>

      <section className="rounded-2xl border border-navy-900/8 bg-white p-6">
        <h2 className="font-display text-lg font-semibold text-navy-900">Photos</h2>
        <p className="mt-1 text-sm text-navy-900/50">Upload JPG, PNG or WEBP images, up to 5MB each.</p>

        <label className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-navy-900/15 bg-ivory-50 px-6 py-8 text-sm font-medium text-navy-900/60 hover:border-gold-500 hover:text-navy-900">
          {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
          {uploading ? "Uploading..." : "Click to upload images"}
          <input type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" disabled={uploading} />
        </label>

        {form.images.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {form.images.map((url) => (
              <div key={url} className="group relative aspect-square overflow-hidden rounded-lg bg-navy-100">
                <Image src={url} alt="Property" fill sizes="120px" className="object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
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
          {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Property"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/properties")}
          className="rounded-xl border border-navy-900/10 px-6 py-3 text-sm font-semibold text-navy-900/70 hover:bg-navy-900/5"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
