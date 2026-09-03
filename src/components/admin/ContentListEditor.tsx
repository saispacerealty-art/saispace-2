"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, Save, Trash2, Plus, AlertCircle, Upload, X, Image as ImageIconLucide } from "lucide-react";
import { getIcon, ICON_NAMES } from "@/lib/icons";
import type { ContentSectionParam } from "@/lib/content-sections";
import { useConfirmDialog } from "./ConfirmDialog";

export type ContentField<T> = {
  key: keyof T & string;
  label: string;
  type: "text" | "textarea" | "icon" | "list" | "select" | "image";
  options?: string[];
  placeholder?: string;
};

type Item = { id: string; [key: string]: unknown };

export function ContentListEditor<T extends Item>({
  section,
  title,
  description,
  fields,
  initialItems,
  emptyItem,
}: {
  section: ContentSectionParam;
  title: string;
  description?: string;
  fields: ContentField<T>[];
  initialItems: T[];
  emptyItem: Omit<T, "id">;
}) {
  const router = useRouter();
  const [items, setItems] = useState<T[]>(initialItems);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const { confirm, dialog } = useConfirmDialog();

  function updateField(id: string, key: string, value: unknown) {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, [key]: value } : item)));
  }

  async function handleImageUpload(itemId: string, fieldKey: string, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const uploadKey = `${itemId}:${fieldKey}`;
    setError(null);
    setUploadingKey(uploadKey);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Image upload failed");
      const data = await res.json();
      updateField(itemId, fieldKey, data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Image upload failed. Please try again.");
    } finally {
      setUploadingKey(null);
      e.target.value = "";
    }
  }

  async function handleSave(item: T) {
    setError(null);
    setSavingId(item.id);
    try {
      const res = await fetch(`/api/content/${section}/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? `Save failed (${res.status})`);
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed. Please try again.");
    } finally {
      setSavingId(null);
    }
  }

  async function handleDelete(id: string) {
    if (!(await confirm("Delete this item? This cannot be undone."))) return;
    setError(null);
    setDeletingId(id);
    try {
      const res = await fetch(`/api/content/${section}/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? `Delete failed (${res.status})`);
      }
      setItems((prev) => prev.filter((i) => i.id !== id));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleAdd() {
    setError(null);
    setAdding(true);
    try {
      const res = await fetch(`/api/content/${section}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emptyItem),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? `Create failed (${res.status})`);
      }
      const created = (await res.json()) as T;
      setItems((prev) => [...prev, created]);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Create failed. Please try again.");
    } finally {
      setAdding(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-navy-900/10 bg-ivory-50 px-4 py-2.5 text-sm text-navy-900 outline-none focus:border-gold-500";
  const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-navy-900/50";

  return (
    <section className="rounded-2xl border border-navy-900/8 bg-white p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-lg font-semibold text-navy-900">{title}</h2>
          {description && <p className="mt-1 text-sm text-navy-900/50">{description}</p>}
        </div>
        <button
          type="button"
          onClick={handleAdd}
          disabled={adding}
          className="flex shrink-0 items-center gap-1.5 rounded-xl bg-navy-900 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-800 disabled:opacity-60"
        >
          {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Add
        </button>
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}

      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border border-navy-900/8 bg-ivory-50 p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              {fields.map((field) => {
                const value = item[field.key];

                if (field.type === "icon") {
                  const Icon = getIcon(String(value ?? ""));
                  return (
                    <div key={field.key}>
                      <label className={labelClass}>{field.label}</label>
                      <div className="flex items-center gap-2">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-navy-900">
                          <Icon className="h-4 w-4 text-gold-400" />
                        </span>
                        <select
                          value={String(value ?? "")}
                          onChange={(e) => updateField(item.id, field.key, e.target.value)}
                          className={inputClass}
                        >
                          {ICON_NAMES.map((name) => (
                            <option key={name} value={name}>
                              {name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  );
                }

                if (field.type === "select") {
                  return (
                    <div key={field.key}>
                      <label className={labelClass}>{field.label}</label>
                      <select
                        value={String(value ?? "")}
                        onChange={(e) => updateField(item.id, field.key, e.target.value)}
                        className={inputClass}
                      >
                        {(field.options ?? []).map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                }

                if (field.type === "textarea") {
                  return (
                    <div key={field.key} className="sm:col-span-2">
                      <label className={labelClass}>{field.label}</label>
                      <textarea
                        rows={3}
                        value={String(value ?? "")}
                        onChange={(e) => updateField(item.id, field.key, e.target.value)}
                        className={inputClass}
                        placeholder={field.placeholder}
                      />
                    </div>
                  );
                }

                if (field.type === "list") {
                  const arr = Array.isArray(value) ? (value as string[]) : [];
                  return (
                    <div key={field.key} className="sm:col-span-2">
                      <label className={labelClass}>{field.label} (comma-separated)</label>
                      <textarea
                        rows={2}
                        value={arr.join(", ")}
                        onChange={(e) =>
                          updateField(
                            item.id,
                            field.key,
                            e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                          )
                        }
                        className={inputClass}
                        placeholder={field.placeholder}
                      />
                    </div>
                  );
                }

                if (field.type === "image") {
                  const uploadKey = `${item.id}:${field.key}`;
                  const isUploading = uploadingKey === uploadKey;
                  return (
                    <div key={field.key} className="sm:col-span-2">
                      <label className={labelClass}>{field.label}</label>
                      <div className="flex items-start gap-3">
                        <div className="group relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-navy-100">
                          {value ? (
                            <>
                              <Image src={String(value)} alt="" fill sizes="80px" className="object-cover" />
                              <button
                                type="button"
                                onClick={() => updateField(item.id, field.key, "")}
                                className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                                aria-label="Remove image"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </>
                          ) : (
                            <div className="flex h-full items-center justify-center text-navy-900/20">
                              <ImageIconLucide className="h-6 w-6" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 space-y-2">
                          <label className="flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-navy-900/15 bg-ivory-50 px-3 py-2.5 text-xs font-medium text-navy-900/60 hover:border-gold-500 hover:text-navy-900">
                            {isUploading ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Upload className="h-4 w-4" />
                            )}
                            {isUploading ? "Uploading..." : "Upload image"}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={isUploading}
                              onChange={(e) => handleImageUpload(item.id, field.key, e)}
                            />
                          </label>
                          <input
                            value={String(value ?? "")}
                            onChange={(e) => updateField(item.id, field.key, e.target.value)}
                            className={inputClass}
                            placeholder={field.placeholder ?? "or paste an image URL"}
                          />
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={field.key}>
                    <label className={labelClass}>{field.label}</label>
                    <input
                      value={String(value ?? "")}
                      onChange={(e) => updateField(item.id, field.key, e.target.value)}
                      className={inputClass}
                      placeholder={field.placeholder}
                    />
                  </div>
                );
              })}
            </div>
            <div className="mt-3 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => handleSave(item)}
                disabled={savingId === item.id}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-navy-900/70 hover:bg-navy-900/5 disabled:opacity-50"
              >
                {savingId === item.id ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Save className="h-3.5 w-3.5" />
                )}
                Save
              </button>
              <button
                type="button"
                onClick={() => handleDelete(item.id)}
                disabled={deletingId === item.id}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-navy-900/50 hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="py-8 text-center text-sm text-navy-900/40">Nothing here yet. Click Add to create one.</p>
        )}
      </div>
      {dialog}
    </section>
  );
}
