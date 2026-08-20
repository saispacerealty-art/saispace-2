import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PropertyCard } from "@/components/PropertyCard";
import type { Property } from "@/lib/types";

export function FeaturedProperties({ properties }: { properties: Property[] }) {
  return (
    <section className="bg-ivory-100 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-600">Handpicked</p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-navy-900 sm:text-4xl">
              Featured Properties
            </h2>
          </div>
          <Link
            href="/properties"
            className="flex items-center gap-1.5 text-sm font-semibold text-navy-900 hover:text-gold-600"
          >
            View all properties <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </section>
  );
}
