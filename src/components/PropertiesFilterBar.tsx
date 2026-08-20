"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useState } from "react";

const TYPES = ["All Types", "Apartment", "Villa", "Commercial", "Plot", "Residential"];
const STATUSES = ["Any Status", "For Sale", "For Rent", "Sold"];
const SORTS = [
  { value: "newest", label: "Newest First" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export function PropertiesFilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") ?? "");

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value.startsWith("All") || value.startsWith("Any")) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/properties${params.toString() ? `?${params.toString()}` : ""}`);
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    updateParam("q", q);
  }

  return (
    <div className="rounded-2xl border border-navy-900/8 bg-white p-4 shadow-sm">
      <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 border-b border-navy-900/8 pb-4">
        <Search className="h-4 w-4 text-navy-900/40" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by title, city or locality"
          className="w-full bg-transparent text-sm text-navy-900 outline-none placeholder:text-navy-900/40"
        />
        <button type="submit" className="rounded-lg bg-navy-900 px-4 py-2 text-xs font-semibold text-white">
          Search
        </button>
      </form>

      <div className="mt-4 flex flex-wrap gap-3">
        <select
          defaultValue={searchParams.get("type") ?? "All Types"}
          onChange={(e) => updateParam("type", e.target.value)}
          className="rounded-lg border border-navy-900/10 bg-ivory-50 px-3 py-2 text-sm text-navy-900 outline-none"
        >
          {TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <select
          defaultValue={searchParams.get("status") ?? "Any Status"}
          onChange={(e) => updateParam("status", e.target.value)}
          className="rounded-lg border border-navy-900/10 bg-ivory-50 px-3 py-2 text-sm text-navy-900 outline-none"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          defaultValue={searchParams.get("sort") ?? "newest"}
          onChange={(e) => updateParam("sort", e.target.value)}
          className="rounded-lg border border-navy-900/10 bg-ivory-50 px-3 py-2 text-sm text-navy-900 outline-none"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        {(searchParams.get("q") || searchParams.get("type") || searchParams.get("status")) && (
          <button
            onClick={() => {
              setQ("");
              router.push("/properties");
            }}
            className="rounded-lg px-3 py-2 text-sm font-medium text-navy-900/60 hover:text-navy-900"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
