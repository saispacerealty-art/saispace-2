"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";

const TYPES = ["Any Type", "Residential", "Villa", "Commercial", "Plot"];

export function Hero({
  stats,
  copy,
}: {
  stats: { properties: number; cities: number; years: number; happyClients: number };
  copy: { eyebrow: string; title: string; accent: string; tagline: string };
}) {
  const router = useRouter();
  const [city, setCity] = useState("");
  const [type, setType] = useState("Any Type");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city.trim()) params.set("q", city.trim());
    if (type !== "Any Type") params.set("type", type);
    router.push(`/properties${params.toString() ? `?${params.toString()}` : ""}`);
  }

  return (
    <section className="relative overflow-hidden bg-navy-950">
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80"
          className="h-full w-full object-cover opacity-90"
        >
          <source src="/videos/hero-background.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/45 via-navy-950/35 to-navy-950" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-20 sm:pt-28 md:pb-32">
        <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.35em] text-gold-300">
          {copy.eyebrow}
        </p>
        <h1 className="animate-fade-up mt-5 max-w-3xl font-display text-4xl font-semibold leading-tight text-white sm:text-5xl md:text-6xl">
          {copy.title} <span className="gold-gradient-text">{copy.accent}</span>
        </h1>
        <p className="animate-fade-up mt-6 max-w-xl text-base text-white/70 sm:text-lg">{copy.tagline}</p>

        <form
          onSubmit={handleSearch}
          className="animate-fade-up mt-10 flex w-full max-w-2xl flex-col gap-3 rounded-2xl bg-white/95 p-3 shadow-2xl shadow-black/30 backdrop-blur sm:flex-row sm:items-center"
        >
          <div className="flex flex-1 items-center gap-2 px-3">
            <Search className="h-5 w-5 text-navy-900/40" />
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Search by city, locality or project"
              className="w-full bg-transparent py-2.5 text-sm text-navy-900 outline-none placeholder:text-navy-900/40"
            />
          </div>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="rounded-xl border border-navy-900/10 bg-ivory-50 px-3 py-2.5 text-sm text-navy-900 outline-none sm:border-0"
          >
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-xl bg-navy-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy-800"
          >
            Search Properties
          </button>
        </form>

        <dl className="animate-fade-up mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4">
          {[
            [`${stats.properties}+`, "Properties Listed"],
            [`${stats.cities}`, "Cities Covered"],
            [`${stats.years}`, "Years of Trust"],
            [`${stats.happyClients.toLocaleString("en-IN")}+`, "Happy Families"],
          ].map(([value, label]) => (
            <div key={label}>
              <dt className="font-display text-2xl font-semibold text-white sm:text-3xl">{value}</dt>
              <dd className="mt-1 text-xs uppercase tracking-wide text-white/50">{label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
