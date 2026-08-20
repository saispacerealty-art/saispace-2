"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

export function InquiryForm({
  propertyId,
  propertyTitle,
  compact = false,
}: {
  propertyId?: string;
  propertyTitle?: string;
  compact?: boolean;
}) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: propertyTitle ? `I'm interested in ${propertyTitle}. Please share more details.` : "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, propertyId, propertyTitle }),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-gold-500/30 bg-gold-500/10 p-8 text-center">
        <CheckCircle2 className="h-10 w-10 text-gold-600" />
        <p className="font-display text-lg font-semibold text-navy-900">Thank you!</p>
        <p className="text-sm text-navy-900/60">
          Your inquiry has been received. Our team will reach out to you shortly.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-2 text-sm font-semibold text-navy-900 underline underline-offset-4"
        >
          Send another inquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={compact ? "space-y-3" : "space-y-4"}>
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Full name"
          className="rounded-xl border border-navy-900/10 bg-ivory-50 px-4 py-3 text-sm text-navy-900 outline-none focus:border-gold-500"
        />
        <input
          required
          type="tel"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          placeholder="Phone number"
          className="rounded-xl border border-navy-900/10 bg-ivory-50 px-4 py-3 text-sm text-navy-900 outline-none focus:border-gold-500"
        />
      </div>
      <input
        type="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        placeholder="Email address"
        className="w-full rounded-xl border border-navy-900/10 bg-ivory-50 px-4 py-3 text-sm text-navy-900 outline-none focus:border-gold-500"
      />
      <textarea
        rows={compact ? 3 : 4}
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        placeholder="Tell us what you're looking for..."
        className="w-full rounded-xl border border-navy-900/10 bg-ivory-50 px-4 py-3 text-sm text-navy-900 outline-none focus:border-gold-500"
      />
      <button
        type="submit"
        disabled={status === "submitting"}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-navy-900 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-navy-800 disabled:opacity-60"
      >
        {status === "submitting" && <Loader2 className="h-4 w-4 animate-spin" />}
        {status === "submitting" ? "Sending..." : "Send Inquiry"}
      </button>
      {status === "error" && (
        <p className="text-center text-sm text-red-600">Something went wrong. Please try again.</p>
      )}
    </form>
  );
}
