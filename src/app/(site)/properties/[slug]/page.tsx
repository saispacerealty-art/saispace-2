import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BedDouble, Bath, MapPin, Ruler, CheckCircle2, Phone, ArrowLeft } from "lucide-react";
import { repo } from "@/lib/repository";
import { formatPrice, formatArea, formatDate } from "@/lib/format";
import { PropertyGallery } from "@/components/PropertyGallery";
import { InquiryForm } from "@/components/InquiryForm";
import { PropertyCard } from "@/components/PropertyCard";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const property = await repo.getProperty(slug);
  if (!property) return {};
  return {
    title: property.title,
    description: property.description.slice(0, 155),
  };
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const property = await repo.getProperty(slug);
  if (!property) notFound();

  const settings = await repo.getSettings();
  const all = await repo.listProperties();
  const related = all.filter((p) => p.id !== property.id && p.city === property.city).slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <Link href="/properties" className="flex items-center gap-1.5 text-sm font-medium text-navy-900/60 hover:text-navy-900">
        <ArrowLeft className="h-4 w-4" /> Back to properties
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PropertyGallery images={property.images} title={property.title} />

          <div className="mt-8 flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-navy-900 px-3 py-1 text-xs font-semibold text-white">
                  {property.status}
                </span>
                <span className="text-xs font-semibold uppercase tracking-widest text-gold-600">
                  {property.type}
                </span>
              </div>
              <h1 className="mt-3 font-display text-2xl font-semibold text-navy-900 sm:text-3xl">
                {property.title}
              </h1>
              <p className="mt-2 flex items-center gap-1.5 text-sm text-navy-900/60">
                <MapPin className="h-4 w-4 text-gold-600" /> {property.address}, {property.city}
              </p>
            </div>
            <div className="text-right">
              <div className="font-display text-2xl font-bold text-navy-900 sm:text-3xl">
                {formatPrice(property.price, property.priceUnit)}
              </div>
              <p className="text-xs text-navy-900/50">Listed {formatDate(property.createdAt)}</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4 rounded-2xl border border-navy-900/8 bg-white p-5 sm:w-fit sm:grid-cols-none sm:flex sm:gap-10">
            {property.bedrooms > 0 && (
              <div className="flex items-center gap-2 text-sm text-navy-900/70">
                <BedDouble className="h-5 w-5 text-gold-600" />
                <span><strong className="text-navy-900">{property.bedrooms}</strong> Beds</span>
              </div>
            )}
            {property.bathrooms > 0 && (
              <div className="flex items-center gap-2 text-sm text-navy-900/70">
                <Bath className="h-5 w-5 text-gold-600" />
                <span><strong className="text-navy-900">{property.bathrooms}</strong> Baths</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-navy-900/70">
              <Ruler className="h-5 w-5 text-gold-600" />
              <span><strong className="text-navy-900">{formatArea(property.areaSqft)}</strong></span>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="font-display text-xl font-semibold text-navy-900">About this property</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-navy-900/70">
              {property.description || "Description coming soon — contact us for details."}
            </p>
          </div>

          {property.features.length > 0 && (
            <div className="mt-10">
              <h2 className="font-display text-xl font-semibold text-navy-900">Features &amp; Amenities</h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {property.features.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm text-navy-900/70">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-gold-600" /> {f}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="lg:col-span-1">
          <div className="sticky top-28 rounded-2xl border border-navy-900/8 bg-white p-6 shadow-sm">
            <h3 className="font-display text-lg font-semibold text-navy-900">Interested in this property?</h3>
            <p className="mt-1 text-sm text-navy-900/60">
              Share your details and our advisors will get back to you shortly.
            </p>
            <a
              href={`tel:${settings.phone}`}
              className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-navy-900/10 bg-ivory-50 px-4 py-3 text-sm font-semibold text-navy-900 hover:bg-ivory-100"
            >
              <Phone className="h-4 w-4 text-gold-600" /> {settings.phone}
            </a>
            <div className="mt-5">
              <InquiryForm propertyId={property.id} propertyTitle={property.title} compact />
            </div>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="font-display text-xl font-semibold text-navy-900">More properties in {property.city}</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
