import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { PageCopy } from "@/lib/types";

export function CTASection({ copy }: { copy: PageCopy }) {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-20">
      <div className="relative overflow-hidden rounded-3xl bg-navy-950 px-8 py-16 text-center sm:px-16">
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-gold-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-gold-500/10 blur-3xl" />
        <p className="relative text-xs font-semibold uppercase tracking-[0.3em] text-gold-300">
          {copy.ctaEyebrow}
        </p>
        <h2 className="relative mx-auto mt-4 max-w-xl font-display text-3xl font-semibold text-white sm:text-4xl">
          {copy.ctaTitle}
        </h2>
        <p className="relative mx-auto mt-4 max-w-md text-sm text-white/60">{copy.ctaSubcopy}</p>
        <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/contact"
            className="flex items-center gap-2 rounded-full bg-gold-500 px-7 py-3 text-sm font-semibold text-navy-950 transition-colors hover:bg-gold-400"
          >
            {copy.ctaPrimaryLabel} <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/properties"
            className="rounded-full border border-white/20 px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            {copy.ctaSecondaryLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
