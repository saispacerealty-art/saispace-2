import Image from "next/image";
import Link from "next/link";
import { BedDouble, Bath, MapPin, Ruler } from "lucide-react";
import type { Property } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { PLACEHOLDER_LISTING_IMAGE } from "@/lib/placeholders";

export function PropertyCard({ property }: { property: Property }) {
  return (
    <Link
      href={`/properties/${property.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-navy-900/8 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-navy-900/10"
    >
      <div className="relative h-56 w-full overflow-hidden bg-navy-100">
        <Image
          src={property.images[0] || PLACEHOLDER_LISTING_IMAGE}
          alt={property.title}
          fill
          sizes="(min-width: 1024px) 380px, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex gap-2">
          <span className="rounded-full bg-navy-950/85 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            {property.status}
          </span>
          {property.featured && (
            <span className="rounded-full bg-gold-500 px-3 py-1 text-xs font-semibold text-navy-950">
              Featured
            </span>
          )}
        </div>
        <div className="absolute bottom-3 right-3 rounded-full bg-white/95 px-3 py-1.5 text-sm font-bold text-navy-900 shadow">
          {formatPrice(property.price, property.priceUnit)}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gold-600">{property.type}</p>
          <h3 className="mt-1 font-display text-lg font-semibold text-navy-900 group-hover:text-navy-700">
            {property.title}
          </h3>
        </div>
        <p className="flex items-center gap-1.5 text-sm text-navy-900/60">
          <MapPin className="h-4 w-4 shrink-0 text-gold-600" />
          {property.locality}, {property.city}
        </p>

        <div className="mt-auto flex items-center gap-4 border-t border-navy-900/8 pt-4 text-sm text-navy-900/70">
          {property.bedrooms > 0 && (
            <span className="flex items-center gap-1.5">
              <BedDouble className="h-4 w-4 text-navy-900/40" /> {property.bedrooms}
            </span>
          )}
          {property.bathrooms > 0 && (
            <span className="flex items-center gap-1.5">
              <Bath className="h-4 w-4 text-navy-900/40" /> {property.bathrooms}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Ruler className="h-4 w-4 text-navy-900/40" /> {property.areaSqft.toLocaleString("en-IN")} sqft
          </span>
        </div>
      </div>
    </Link>
  );
}
