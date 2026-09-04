"use client";

import { useState } from "react";
import { CheckCircle2, Copy, Loader2, MessageCircle } from "lucide-react";

export function ReferralForm({ whatsapp }: { whatsapp: string }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [code, setCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({
    referrerName: "",
    referrerPhone: "",
    referrerEmail: "",
    referredName: "",
    referredPhone: "",
    referredEmail: "",
    message: "",
  });

  function whatsappUrl(referralCode: string) {
    const digits = whatsapp.replace(/[^\d]/g, "");
    const text = [
      `Hi Sai Space Realty, I just submitted a referral (code ${referralCode}).`,
      `Referring: ${form.referredName} (${form.referredPhone})`,
      form.message ? `Note: ${form.message}` : null,
    ]
      .filter(Boolean)
      .join("\n");
    return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/referrals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setCode(data.code);
      setStatus("success");
      window.open(whatsappUrl(data.code), "_blank", "noreferrer");
    } catch {
      setStatus("error");
    }
  }

  async function copyCode() {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — the code is still shown on screen to copy manually.
    }
  }

  if (status === "success" && code) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-gold-500/30 bg-gold-500/10 p-8 text-center">
        <CheckCircle2 className="h-10 w-10 text-gold-600" />
        <div>
          <p className="font-display text-lg font-semibold text-navy-900">Thank you for referring!</p>
          <p className="mt-1 text-sm text-navy-900/60">
            We&apos;ll reach out to {form.referredName.split(" ")[0] || "your friend"} shortly. Here&apos;s your
            referral code — quote it when your reward is processed.
          </p>
        </div>
        <button
          type="button"
          onClick={copyCode}
          className="flex items-center gap-2 rounded-xl border-2 border-dashed border-gold-500/50 bg-white px-6 py-3 font-mono text-lg font-semibold tracking-widest text-navy-900 transition-colors hover:border-gold-500"
        >
          {code}
          <Copy className="h-4 w-4 text-navy-900/40" />
        </button>
        {copied && <p className="text-xs font-medium text-gold-700">Copied to clipboard</p>}
        <a
          href={whatsappUrl(code)}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
        >
          <MessageCircle className="h-4 w-4" fill="white" />
          Send us the details on WhatsApp
        </a>
        <button
          onClick={() => {
            setStatus("idle");
            setCode(null);
            setForm({
              referrerName: "",
              referrerPhone: "",
              referrerEmail: "",
              referredName: "",
              referredPhone: "",
              referredEmail: "",
              message: "",
            });
          }}
          className="mt-1 text-sm font-semibold text-navy-900 underline underline-offset-4"
        >
          Refer another friend
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-gold-600">Your Details</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <input
            required
            value={form.referrerName}
            onChange={(e) => setForm({ ...form, referrerName: e.target.value })}
            placeholder="Your full name"
            className="rounded-xl border border-navy-900/10 bg-ivory-50 px-4 py-3 text-sm text-navy-900 outline-none focus:border-gold-500"
          />
          <input
            required
            type="tel"
            value={form.referrerPhone}
            onChange={(e) => setForm({ ...form, referrerPhone: e.target.value })}
            placeholder="Your phone number"
            className="rounded-xl border border-navy-900/10 bg-ivory-50 px-4 py-3 text-sm text-navy-900 outline-none focus:border-gold-500"
          />
          <input
            type="email"
            value={form.referrerEmail}
            onChange={(e) => setForm({ ...form, referrerEmail: e.target.value })}
            placeholder="Your email (optional)"
            className="rounded-xl border border-navy-900/10 bg-ivory-50 px-4 py-3 text-sm text-navy-900 outline-none focus:border-gold-500 sm:col-span-2"
          />
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-gold-600">Who You&apos;re Referring</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <input
            required
            value={form.referredName}
            onChange={(e) => setForm({ ...form, referredName: e.target.value })}
            placeholder="Friend's full name"
            className="rounded-xl border border-navy-900/10 bg-ivory-50 px-4 py-3 text-sm text-navy-900 outline-none focus:border-gold-500"
          />
          <input
            required
            type="tel"
            value={form.referredPhone}
            onChange={(e) => setForm({ ...form, referredPhone: e.target.value })}
            placeholder="Friend's phone number"
            className="rounded-xl border border-navy-900/10 bg-ivory-50 px-4 py-3 text-sm text-navy-900 outline-none focus:border-gold-500"
          />
          <input
            type="email"
            value={form.referredEmail}
            onChange={(e) => setForm({ ...form, referredEmail: e.target.value })}
            placeholder="Friend's email (optional)"
            className="rounded-xl border border-navy-900/10 bg-ivory-50 px-4 py-3 text-sm text-navy-900 outline-none focus:border-gold-500 sm:col-span-2"
          />
        </div>
      </div>

      <textarea
        rows={3}
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        placeholder="Anything we should know? (e.g. what they're looking for)"
        className="w-full rounded-xl border border-navy-900/10 bg-ivory-50 px-4 py-3 text-sm text-navy-900 outline-none focus:border-gold-500"
      />

      <button
        type="submit"
        disabled={status === "submitting"}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-navy-900 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-navy-800 disabled:opacity-60"
      >
        {status === "submitting" && <Loader2 className="h-4 w-4 animate-spin" />}
        {status === "submitting" ? "Submitting..." : "Submit Referral"}
      </button>
      {status === "error" && (
        <p className="text-center text-sm text-red-600">Something went wrong. Please try again.</p>
      )}
    </form>
  );
}
