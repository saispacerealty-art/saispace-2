import Link from "next/link";
import Image from "next/image";
import type { PropertyTypeCard } from "@/lib/types";

export function PropertyTypes({ types }: { types: PropertyTypeCard[] }) {
  return (
    <section className="bg-ivory-100 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-600">Browse by Category</p>
        <h2 className="mt-3 font-display text-3xl font-semibold text-navy-900 sm:text-4xl">
          Every kind of space, in one place
        </h2>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {types.map((t) => (
            <Link
              key={t.id}
              href={`/properties?type=${t.type}`}
              className="group relative h-64 overflow-hidden rounded-2xl"
            >
              <Image
                src={t.image}
                alt={t.label}
                fill
                sizes="(min-width: 1024px) 280px, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <span className="font-display text-lg font-semibold text-white">{t.label}</span>
                <span className="mt-1 block text-xs font-medium text-gold-300 opacity-0 transition-opacity group-hover:opacity-100">
                  View listings →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
