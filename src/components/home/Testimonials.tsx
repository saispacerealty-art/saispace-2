import { Star } from "lucide-react";
import type { Testimonial } from "@/lib/types";

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-600">Client Stories</p>
      <h2 className="mt-3 font-display text-3xl font-semibold text-navy-900 sm:text-4xl">
        Trusted by families and businesses alike
      </h2>

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {testimonials.map((t) => (
          <figure key={t.id} className="flex flex-col rounded-2xl bg-navy-900 p-7 text-white">
            <div className="flex gap-1 text-gold-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <blockquote className="mt-5 flex-1 text-sm leading-relaxed text-white/80">
              “{t.quote}”
            </blockquote>
            <figcaption className="mt-6 border-t border-white/10 pt-4">
              <div className="font-display text-sm font-semibold">{t.name}</div>
              <div className="text-xs text-gold-300">{t.role}</div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
