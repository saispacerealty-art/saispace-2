import Link from "next/link";
import Image from "next/image";

const TYPES = [
  {
    label: "Apartments",
    href: "/properties?type=Apartment",
    img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80",
  },
  {
    label: "Villas",
    href: "/properties?type=Villa",
    img: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=900&q=80",
  },
  {
    label: "Commercial",
    href: "/properties?type=Commercial",
    img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80",
  },
  {
    label: "Plots & Land",
    href: "/properties?type=Plot",
    img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=80",
  },
];

export function PropertyTypes() {
  return (
    <section className="bg-ivory-100 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-600">Browse by Category</p>
        <h2 className="mt-3 font-display text-3xl font-semibold text-navy-900 sm:text-4xl">
          Every kind of space, in one place
        </h2>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TYPES.map((t) => (
            <Link
              key={t.label}
              href={t.href}
              className="group relative h-64 overflow-hidden rounded-2xl"
            >
              <Image
                src={t.img}
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
